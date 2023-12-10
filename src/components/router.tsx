import { Route, createHashRouter, createRoutesFromElements } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { LogInDialog } from './Dialogs/LogInDialog';
import { AppRoot } from './AppRoot';
import { Index } from './Index';
import { CollectionTableMRT } from './Table/CollectionTableMRT';

export const router = createHashRouter(
    createRoutesFromElements(
        <Route path='/' errorElement={<ErrorBoundary />} element={<AppRoot />}>
            <Route path='data'>
                <Route id='collectionRoute' path=':collection' element={<CollectionTableMRT />}></Route>
            </Route>
            <Route
                index
                element={
                    <div>
                        <Index />
                    </div>
                }
            />
        </Route>
    )
);
