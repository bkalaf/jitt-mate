import { Route, createHashRouter, createRoutesFromElements } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { AppRoot } from './AppRoot';
import { CollectionTableMRT } from './Table/CollectionTableMRT';
import { CollectionItemTableMRT } from './Table/CollectionItemTableMRT';

export const router = createHashRouter(
    createRoutesFromElements(
        <Route path='/' errorElement={<ErrorBoundary />} element={<AppRoot />}>
            <Route path='data'>
                <Route id='collectionRoute' path=':collection' element={<CollectionTableMRT />}>
                    <Route path=':oid' element={<CollectionItemTableMRT />} />
                </Route>
            </Route>
            <Route
                index
                element={
                    <></>
                }
            />
        </Route>
    )
);
