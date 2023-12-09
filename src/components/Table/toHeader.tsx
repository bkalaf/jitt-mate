import { toProperFromCamel } from '../../common/text/toProperCase';


export function toHeader(opts: { header?: string; } = {}, name: string) {
    return opts.header ?? toProperFromCamel(name.split('.').reverse()[0]);
}
