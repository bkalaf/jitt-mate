/* eslint-disable @typescript-eslint/no-unused-vars */
import { MRT_Row, MRT_TableInstance } from 'material-react-table';
import { QueryClientProvider } from '@tanstack/react-query';
import { $$queryClient } from '../../App';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import React, { useCallback, useState } from 'react';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { CollectionTableMRT } from '../CollectionTableMRT';

export function createDetailSubComponent(infos: FieldInfo[]) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function DetailSubComponent<T extends EntityBase>({ row, table }: { table: MRT_TableInstance<T>; row: MRT_Row<T>; }) {
        const [value, setValue] = useState<string>(infos[0][0])
        const handleChange = useCallback((ev: React.SyntheticEvent, newValue: string) => {
            setValue(newValue);
        }, [])
        return (
            <QueryClientProvider client={$$queryClient}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label='Detail Sub Panel'>
                                {infos.map(([propertyName, type, objectType], ix) => (
                                    <Tab key={ix} label={toProperFromCamel(propertyName)} value={propertyName} />
                                ))}
                            </TabList>
                        </Box>
                        {infos.map(([propertyName, type, objectType], ix) => (
                            <TabPanel value={propertyName} key={ix}>
                                <CollectionTableMRT propertyName={propertyName} type={type as any} objectType={objectType} parentRow={row as any} />
                            </TabPanel>
                        ))}
                    </TabContext>
                </Box>
            </QueryClientProvider>
        );
    };
    return infos.length > 0 ? DetailSubComponent : () => null;
}