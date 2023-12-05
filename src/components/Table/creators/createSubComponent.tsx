import { TabPanelProvider } from '../../TabPanelProvider';
import { Tab } from '../../../dal/Tab';
import { MRT_Row, MRT_TableInstance } from 'material-react-table';
import { QueryClientProvider } from '@tanstack/react-query';
import { $$queryClient } from '../../App';
import { TaxonomyPanel } from '../DetailsPanel/TabPanels/TaxonomyPanel';
import { $cn } from '../../../util/$cn';
import { toGridCols } from './toGridCols';

export function createSubComponent(infos: FieldInfo[]) {
    function SubComponent<T extends EntityBase>({ row, collectionName, table }: { table: MRT_TableInstance<T>; row: MRT_Row<T>; collectionName: string }) {
        const spread = $cn({}, { [toGridCols(infos?.length)]: true }, 'grid justify-start w-full p-2');
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

export function RHFM_createDetailPanel(infos: FieldInfo[], collectionName: string) {
    function SubComponent<T extends EntityBase>({ row, table }: { table: MRT_TableInstance<T>; row: MRT_Row<T> }) {
        const spread = $cn({}, { [toGridCols(infos?.length)]: true }, 'grid justify-start w-full p-2');
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