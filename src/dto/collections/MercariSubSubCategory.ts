/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Realm, { PropertySchema, PropertyTypeName } from 'realm';
import { $db } from '../../dal/db';
import { ICustomItemField, IHashTag, IMercariSubCategory, IMercariSubSubCategory, IProductTaxonomy } from '../../dal/types';
import { cleanup, is } from '../../common/is';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { $$queryClient } from '../../components/App';
import { mergeProductTaxonomy } from '../../util/mergeProductTaxonomy';
import { prependText } from '../../common/text/prependText';
import { HashTag } from './HashTag';

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
    fullname!: string;
    parent: OptionalEntity<IMercariSubCategory>;
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
        if (this.hashTags == null) this.hashTags = [] as any;
        if (this.customItemFields == null) this.customItemFields = [] as any;
        if (this.taxon == null) this.taxon = { lock: false } as any;
        if ('parent' in this) {
            const parent = this.parent;
            if (parent != null) {
                const target = parent.taxon ?? ({ lock: false } as IProductTaxonomy);
                if (target != null && !target.lock) {
                    const values = [parent.taxon?.kingdom, parent.taxon?.phylum, parent.taxon?.klass, parent.taxon?.order, parent.taxon?.family, parent.taxon?.genus, parent.taxon?.species].filter(
                        (x) => x != null
                    ) as string[];
                    const setters = [
                        (value: string) => (target.kingdom = value),
                        (value: string) => (target.phylum = value),
                        (value: string) => (target.klass = value),
                        (value: string) => (target.order = value),
                        (value: string) => (target.family = value),
                        (value: string) => (target.genus = value),
                        (value: string) => (target.species = value)
                    ];
                    for (let index = 0; index < values.length; index++) {
                        const currentValue = values[index];
                        setters[index](currentValue);
                    }
                }
            }
        }
        if (this.taxon != null && this.taxon.update != null) {
            this.taxon = this.taxon.update();
        }
        if (!this.id.startsWith('#')) {
            this.id = prependText('#')(this.id);
        }
        if (this.hashTags) {
            HashTag.pruneList(this.hashTags);
        }
        this.fullname = [this.parent?.parent?.name, this.parent?.name, this.name].filter((x) => x != null).join('::');
        const merged = mergeProductTaxonomy(this.taxon, this.parent?.taxon);
        if (merged) {
            this.taxon = merged as any;
        }
        return this;
    }

    get effectiveShipWeightPercent(): Optional<number> {
        return this.parent?.effectiveShipWeightPercent ?? this.shipWeightPercent;
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
