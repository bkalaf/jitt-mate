import { TabPanelProvider } from '../../TabPanelProvider';
import { Tab } from '../../../dal/Tab';
import { MRT_Row, MRT_TableInstance } from 'material-react-table';
import { QueryClientProvider } from '@tanstack/react-query';
import { $$queryClient } from '../../App';
import { TaxonomyPanel } from '../DetailsPanel/TabPanels/TaxonomyPanel';
import { $cn } from '../../../util/$cn';


export function toGridCols(qty: number) {
    switch (qty) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
            return 'grid-cols-4';
        case 5:
            return 'grid-cols-5';
        case 6:
            return 'grid-cols-6';
        case 7:
            return 'grid-cols-7';
        case 8:
            return 'grid-cols-8';
        case 9:
            return 'grid-cols-9';
        default:
            return 'grid-cols-10';
    }
}

export function createSubComponent(infos: FieldInfo[]) {
    function SubComponent<T extends EntityBase>({ row, collectionName, table }: { table: MRT_TableInstance<T>; row: MRT_Row<T>; collectionName: string }) {
        const spread = $cn({}, { [toGridCols(infos?.length)]: true }, 'grid justify-start w-full p-2')
        return (
            <QueryClientProvider client={$$queryClient}>
                <TabPanelProvider>
                    <section className='flex flex-col w-full h-full'>
                        <nav role='tablist' aria-label='SubComponent Tabs' {...spread}>
                            {collectionName === 'productTaxonomy' && <Tab key={-1} propertyName='taxon' objectType='productTaxonomy' type='object' />}
                            {infos.map(([propertyName, type, objectType], ix) => (
                                <Tab key={ix} propertyName={propertyName} objectType={objectType ?? ''} type={type} />
                            ))}
                        </nav>
                        <div className='flex flex-grow w-full h-full'>
                            <TaxonomyPanel from={collectionName} parentRow={row.original as any} />
                            {/* {infos.map(([propertyName, type, objectType], ix) => (
                            <TabPanel<T, any, any, any> key={ix} propertyName={propertyName} objectType={objectType ?? ''} collectionName={collectionName} type={type} parentRow={row} table={table} />
                        ))} */}
                        </div>
                    </section>
                </TabPanelProvider>
            </QueryClientProvider>
        );
    }
    return SubComponent;
}
