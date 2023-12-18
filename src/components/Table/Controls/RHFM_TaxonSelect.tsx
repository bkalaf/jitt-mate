// ///<reference path="./../../../global.d.ts" />
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { taxonomy } from '../../../dal/enums/taxa';
import { createFrom } from '../../../common/array/createFrom';
import { endsWith } from '../../../dal/endsWith';
import { useFormContext, useWatch } from 'react-hook-form';
import { AutocompleteElement } from 'react-hook-form-mui';
import { IconButton, Stack, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

export function getOptions(fullname: string) {
    const count = fullname.split('.').length;
    const segments = createFrom(() => fullname, count);
    return [[], ...segments.map((x, ix) => x.split('.').slice(0, ix + 1))];
}

export function getNodeLevel(name: string) {
    if (endsWith('kingdom')(name)) return 0;
    if (endsWith('phylum')(name)) return 1;
    if (endsWith('klass')(name)) return 2;
    if (endsWith('order')(name)) return 3;
    if (endsWith('family')(name)) return 4;
    if (endsWith('genus')(name)) return 5;
    if (endsWith('species')(name)) return 6;
    throw new Error(`could not get nodeLevel ${name}`);
}
export function RHFM_TaxonSelect<T extends MRT_RowData>(props: Parameters<Exclude<MRT_ColumnDef<T, string>['Edit'], undefined>>[0]) {
    const name = props.column.columnDef.accessorKey ?? props.column.columnDef.id ?? 'n/a';
    const header = props.column.columnDef.header;
    const nodeLevel = getNodeLevel(name);
    const context = useFormContext();
    console.info(`context`, context);
    if (context == null) throw new Error('no context');
    const nameParts = useWatch({
        name: ['taxon.kingdom', 'taxon.phylum', 'taxon.klass', 'taxon.family', 'taxon.order', 'taxon.genus', 'taxon.species']
    });
    const fullname = nameParts.filter((x) => x != null && typeof x === 'string' && x.length > 0).join('.');
    const segments = getOptions(fullname);
    const materializedPath = segments.length > nodeLevel ? segments[nodeLevel] : undefined;
    console.log(`materializedPath`, materializedPath);
    const options = Object.keys(
        materializedPath?.reduce((pv, cv) => {
            return Object.keys(pv).includes(cv) ? pv[cv] : {};
        }, taxonomy as Record<string, any>) ?? {}
    ).map((value) => ({ id: value, label: value }));
    const { getValues } = context;
    const value = getValues(name)
    return (
        <Stack direction='row'>
            <AutocompleteElement
                name={name}
                label={header}
                control={context.control}
                options={options}
                autocompleteProps={{
                    className: 'flex flex-grow',
                    clearOnEscape: true,
                    handleHomeEndKeys: true,
                    onChange: (ev: React.SyntheticEvent<any, any>, value: { id: string, label: string }) => {
                        context.setValue(name, value.id);
                    }
                }}
            />
            {value != null && typeof value === 'string' && value.length > 0 && (
                <Tooltip title='Clear value'>
                    <IconButton color='error' onClick={() => context.setValue(name, null)}>
                        <FontAwesomeIcon icon={faTimes} className='w-8 h-8 object-contains' />
                    </IconButton>
                </Tooltip>
            )}
        </Stack>
    );
}

export function testGetOptions(name: string, fullname: string) {
    const nodeLevel = getNodeLevel(name);
    const segments = getOptions(fullname);
    const materializedPath = segments.length > nodeLevel ? segments[nodeLevel] : undefined;
    console.log(`materializedPath`, materializedPath);
    const opts = Object.keys(
        materializedPath?.reduce((pv, cv) => {
            return pv[cv];
        }, taxonomy as Record<string, any>) ?? {}
    );
    console.log(opts);
}

console.log(taxonomy);
// testGetOptions('kingdom', '');
// testGetOptions('this.phylum', 'apparel.men.bottoms');
// testGetOptions('this.order', 'apparel.men.bottoms.pants');
// testGetOptions('this.species', 'apparel.men.bottoms.pants');
// testGetOptions('this.phylum', 'apparel.men.tops.button-front');
// testGetOptions('this.klass', 'apparel.men.tops.button-front');
// testGetOptions('this.order', 'apparel.men.tops.button-front');
// testGetOptions('this.family', 'apparel.men.tops.button-front');
