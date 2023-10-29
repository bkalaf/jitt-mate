import { Row, Table } from '@tanstack/react-table';
import { TabPanelProvider } from '../components/TabPanelProvider';
import { Tab } from './Tab';
import { TabPanel } from './TabPanel';

// props: { row: Row<T>, table: Table<T> }

export function createSubComponent<T extends EntityBase>(infos: FieldInfo[]) {
    const Result = function ({ row, collectionName, table }: { table: Table<T>; row: Row<T>; collectionName: string; }) {
        return (
            <TabPanelProvider>
                <section className='flex flex-col w-full h-auto'>
                    <nav className='grid justify-start w-full grid-cols-10 p-2' role='tablist' aria-label='SubComponent Tabs'>
                        {infos.map(([propertyName, type, objectType], ix) => (
                            <Tab key={ix} propertyName={propertyName} objectType={objectType ?? ''} type={type} />
                        ))}
                    </nav>
                    <div className='flex flex-grow w-full h-full'>
                        {infos.map(([propertyName, type, objectType], ix) => (
                            <TabPanel<T, any, any, any> key={ix} propertyName={propertyName} objectType={objectType ?? ''} collectionName={collectionName} type={type} parentRow={row} table={table} />
                        ))}
                    </div>
                </section>
            </TabPanelProvider>
        );
    };
    Result.displayName = 'SubComponent';
    return Result;
}
