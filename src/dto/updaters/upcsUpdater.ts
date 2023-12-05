import { IUPC } from '../../dal/types';


export function upcsUpdater(this: IUPC) {
    if (this.upcs == null) {
        this.upcs = [] as any;
    }
    this.upcs.forEach((upc) => upc.update());
}
