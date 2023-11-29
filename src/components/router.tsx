import { Route, createHashRouter, createRoutesFromElements } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { LogInDialog } from './Dialogs/LogInDialog';
import { AppRoot } from './AppRoot';
import { collectionLoader } from '../routes/loaders/collectionLoader';
import { Index } from './Index';
import { CollectionTableMRT } from './Table/CollectionTableMRT';

export const router = createHashRouter(
    createRoutesFromElements(
        <Route path='/' errorElement={<ErrorBoundary />} element={<AppRoot />}>
            <Route path='data'>
                <Route id='collectionRoute' path=':collection' loader={collectionLoader} element={<CollectionTableMRT />}></Route>
            </Route>
            <Route path='login' element={<LogInDialog />}></Route>
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
