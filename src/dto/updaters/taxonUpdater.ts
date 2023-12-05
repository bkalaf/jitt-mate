import { ignore } from '../../common/functions/ignore';
import { IProductAttributes, IProductTaxonomy } from '../../dal/types';


export function taxonUpdater(this: IProductAttributes, inBetween: () => void = ignore) {
    if (this.taxon == null) {
        this.taxon = {} as Entity<IProductTaxonomy>;
    }
    inBetween();
    if (this.taxon != null && this.taxon.update != null) {
        this.taxon = this.taxon.update();
    }
}
