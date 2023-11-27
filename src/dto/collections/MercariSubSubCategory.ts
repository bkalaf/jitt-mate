/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Realm, { PropertySchema, PropertyTypeName } from 'realm';
import { $db } from '../../dal/db';
import { ICustomItemField, IHashTag, IMercariSubCategory, IMercariSubSubCategory, IProductTaxonomy } from '../../dal/types';
import { cleanup, is } from '../../dal/is';
import { staticColumnsDecorator } from '../../decorators/class/defineColumnsDecorator';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { prependText } from '../../common/text/prependText';
import { realmCollectionDecorator } from '../../decorators/class/realmCollectionDecorator';
import { $$queryClient } from '../../components/App';
import { HashTag } from './HashTag';

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

@realmCollectionDecorator('fullname', 'fullname')
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
        if (!this.id.startsWith('#')) {
            this.id = prependText('#')(this.id);
        }
        if (this.parent) {
            this.parent = this.parent.update();
        }
        if (this.hashTags) {
            HashTag.pruneList(this.hashTags);
        }
        if (this.taxon == null) this.taxon = {} as Entity<IProductTaxonomy>;
        if (this.parent && !(this.taxon?.lock ?? false)) {
            [this.parent.taxon?.kingdom, this.parent.taxon?.phylum, this.parent.taxon?.klass, this.parent.taxon?.order, this.parent.taxon?.family, this.parent.taxon?.genus, this.parent.taxon?.species]
                .filter((x) => x != null && x.length > 0)
                .forEach((value, ix) => {
                    switch (ix) {
                        case 0:
                            (this.taxon as any).kingdom = value;
                            break;
                        case 1:
                            (this.taxon as any).phylum = value;
                            break;
                        case 2:
                            (this.taxon as any).klass = value;
                            break;
                        case 3:
                            (this.taxon as any).order = value;
                            break;
                        case 4:
                            (this.taxon as any).family = value;
                            break;
                        case 5:
                            (this.taxon as any).genus = value;
                            break;
                        case 6:
                            (this.taxon as any).species = value;
                            break;
                    }
                });
        }
        if (this.taxon && this.taxon.update) {
            this.taxon = this.taxon?.update();
        }
        this.fullname = MercariSubSubCategory.generateFullName(this);
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

    // update<T>(this: T, realm: Realm): T {
    //     const $this = this as IMercariSubSubCategory;
    //     const { categoryName, subCategoryName, subSubCategoryName } = $this.gather();
    //     const fullname = [categoryName, subCategoryName, subSubCategoryName].join('::');
    //     const func = () => {
    //         $this.fullname = fullname;
    //         HashTag.update(realm, ...$this.hashTags.values());
    //     };
    //     checkTransaction(realm)(func);
    //     return this;
    // }

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
    @staticColumnsDecorator
    static columns(...prefixes: string[]): DefinedColumns {
        return [];
    }
}
