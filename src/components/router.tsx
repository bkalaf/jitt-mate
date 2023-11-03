import { Route, createHashRouter, createRoutesFromElements } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { LogInPage } from './LogInPage';
import { AppRoot } from './AppRoot';
import { collectionLoader } from '../routes/loaders/collectionLoader';
import { Index } from './Index';
import { BoundingClientElement } from './BoundingClientElement';
import { RealmObjectView } from './Views/RealmObjectView';

export const router = createHashRouter(
    createRoutesFromElements(
        <Route path='/' errorElement={<ErrorBoundary />} element={<AppRoot />}>
            <Route path='data'>
                <Route
                    id='collectionRoute'
                    path=':collection'
                    loader={collectionLoader}
                    element={
                        <BoundingClientElement>
                            <RealmObjectView />
                        </BoundingClientElement>
                    }></Route>
            </Route>
            <Route path='login' element={<LogInPage />}></Route>
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