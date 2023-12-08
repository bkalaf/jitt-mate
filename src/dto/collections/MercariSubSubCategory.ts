/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Realm, { PropertySchema, PropertyTypeName } from 'realm';
import { $db } from '../../dal/db';
import { ICustomItemField, IHashTag, IMercariSubCategory, IMercariSubSubCategory, IProductTaxonomy } from '../../dal/types';
import { cleanup, is } from '../../dal/is';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { $$queryClient } from '../../components/App';
import { parentedUpdate } from '../updaters/parentedUpdate';
import { listDefaultUpdater } from '../updaters/listDefaultUpdater';
import { categorySelectorUpdater } from '../updaters/categorySelectorUpdater';
import { hashTaggedUpdater } from '../updaters/hashTaggedUpdater';
import { taxonUpdater } from '../updaters/taxonUpdater';
import { mergeProductTaxonomy } from '../embedded/mergeProductTaxonomy';

export const ifList = (s: string): string | PropertySchema => (is.realmType.list(s) ? { type: 'list', objectType: cleanup(s) } : s);
export const ifOpt = (s: string): string | PropertySchema => {
    const result = is.realmType.optional(s) ? { type: cleanup(s) as Realm.PropertyTypeName, optional: true } : s;
    if (!is.string(result) && is.realmType.primitive(result.type)) {
        return result;
    }
    if (is.string(result)) return result;
    if (['list', 'dictionary', 'set', 'linkingObjects'].includes(result.type)) return result;
    return { optional: result.optional, type: 'object', objectType: result.type }
}
export const ifDictionary = (s: string): string | PropertySchema => (is.realmType.dictionary(s) ? { type: 'dictionary', objectType: cleanup(s) } : s);
export const ifSet = (s: string): string | PropertySchema => (is.realmType.set(s) ? { type: 'set', objectType: cleanup(s) } : s);
export const ifPrimitive = (s: string): PropertySchema | string => (is.realmType.primitive(s) ? { type: s as PropertyTypeName, optional: false } : s);

export const handleIf = (func: (s: string) => string | PropertySchema) => (item: string | PropertySchema) => is.string(item) ? func(item) : item;

export class MercariSubSubCategory extends Realm.Object<IMercariSubSubCategory> implements IMercariSubSubCategory {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setImmediate(() =>
            Promise.resolve(this.update()).then(() => {
                $$queryClient
                    .invalidateQueries({
                        queryKey: [MercariSubSubCategory.schema.name]
                    })
                    .then(() => {
                        $$queryClient.refetchQueries({
                            queryKey: [MercariSubSubCategory.schema.name]
                        });
                    });
            })
        );    
    }

    static generateFullName(arg: IMercariSubSubCategory) {
        return [arg.parent?.parent?.name, arg.parent?.name, arg.name].filter((x) => x != null).join('::') ?? '';
    }

    id!: string;
    shipWeightPercent: Optional<number>;
    taxon: OptionalEntity<IProductTaxonomy>;
    hashTags!: DBSet<Entity<IHashTag>>;
    name!: string;
    parent: OptionalEntity<IMercariSubCategory>;
    fullname!: string;
    customItemFields!: DBList<ICustomItemField>;
    get categoryID(): Optional<string> {
        return this.parent?.categoryID;
    }
    get subCategoryID(): Optional<string> {
        return this.parent?.id;
    }

    _id!: OID;

    @wrapInTransactionDecorator()
    update() {
        const lu = listDefaultUpdater<IMercariSubSubCategory>;
        lu.bind(this)(['hashTags', 'customItemFields']);
        const pu = parentedUpdate<'parent', IMercariSubCategory, IMercariSubSubCategory>;
        taxonUpdater.bind(this, pu.bind(this, 'parent'))();
        categorySelectorUpdater.bind(this)();
        hashTaggedUpdater.bind(this)();  
        this.fullname = [this.parent?.parent?.name, this.parent?.name, this.name].filter(x => x != null).join('::');
        const merged = mergeProductTaxonomy(this.taxon, this.parent?.taxon);
        if (merged) {
            this.taxon = merged as any;
        }
        return this;
    }

    get effectiveShipWeightPercent(): Optional<number> {
        return this.parent?.effectiveShipWeightPercent ?? this.shipWeightPercent;
    }

    get effectiveTaxon(): OptionalEntity<IProductTaxonomy> {
        return this.parent?.effectiveTaxon ?? this.taxon;
    }

    get allHashTags(): Entity<IHashTag>[] {
        return [...(this.parent?.allHashTags ?? []), ...Array.from(this.hashTags.values() ?? [])];
    }
    static schema: Realm.ObjectSchema = {
        name: $db.mercariSubSubCategory(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            id: $db.string.empty,
            parent: $db.mercariSubCategory.opt,
            apparelType: $db.string.opt,
            apparelGroup: $db.string.opt,
            itemGroup: $db.string.opt,
            fullname: $db.string.opt,
            hashTags: $db.hashTag.set,
            legType: $db.string.opt,
            topAdornment: $db.string.opt,
            taxon: $db.productTaxonomy.opt,
            sleeveType: $db.string.opt,
            sizingType: $db.string.opt,
            customItemFields: $db.customItemField.list,
            shipWeightPercent: { type: $db.float() as any, optional: true }
        }
    };
}
