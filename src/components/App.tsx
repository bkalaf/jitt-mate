import { Route, RouterProvider, createHashRouter, createRoutesFromElements, useLoaderData, useParams } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RealmProvider } from './Providers/RealmProvider';
import { catchError } from './catchError';
import { LogInPage } from './LogInPage';
import { ToasterProvider } from './Providers/ToasterProvider';
import { AppRoot } from './AppRoot';
import { collectionLoader } from '../routes/loaders/collectionLoader';
import { CollectionView } from './CollectionView';

const TestEl = () => {
    const { collection } = useParams();
    const loadedData = useLoaderData();
    console.log('loadedData', loadedData);
    return (
        <div className='text-3xl'>
            <span className='flex'>{collection}</span>
            <span className='flex'>{(loadedData != null && 'length' in (loadedData as Record<string, any>) ? (loadedData as any).length : 0).toFixed(0)}</span>
        </div>
    );
};

export const router = createHashRouter(
    createRoutesFromElements(
        <Route path='/' errorElement={<ErrorBoundary />} element={<AppRoot />}>
            <Route path='data'>
                <Route id='collectionRoute' path=':collection' loader={collectionLoader} element={<CollectionView />}></Route>
            </Route>
            <Route path='login' element={<LogInPage />}></Route>
        </Route>
    )
);

export function alertError(err: unknown) {
    alert((err as Error).message);
    catchError(err);
}
export const $$queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            placeholderData: [],
            suspense: true,
            networkMode: 'online',
            staleTime: 1000 * 60 * 60,
            gcTime: 1000 * 60 * 60 * 24,
            refetchOnMount: true,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 5,
            retryDelay(failureCount) {
                return Math.min(1000 * 2 ** failureCount, 30000);
            }
        },
        mutations: {
            networkMode: 'online',
            // onSuccess(this: Mutation<unknown, unknown, unknown, unknown>, data: unknown) {
            //     console.log(`this`, this);
            //     const { objectType, mutationVerb } = this.meta ?? { objectType: 'undefined', mutationVerb: '<unknown action>' };
            //     $$queryClient
            //         .invalidateQueries([objectType])
            //         .then(() => {
            //             console.log(`invalided queries with key: ${objectType}`);
            //         })
            //         .catch((err) => console.error(err.message));
            //     $$queryClient
            //         .refetchQueries([objectType])
            //         .then(() => {
            //             console.log(`refetching queries with key: ${objectType}`);
            //         })
            //         .catch((err) => console.error(err.message));
            //     const count = (data as any[] ?? []).length;
            //     const func = count > 1 ? pluralize : identity;
            //     const message = `Successfully ${mutationVerb.toLowerCase()} ${count} ${toTitleCase(objectType)} ${func('record')}.`
            //     window.$$toaster.success(message);
            // },
            retry: false
            // onError(error) {
            //     window.$$toaster.tryCatch(error as Error);
            // },
        }
    }
});

export function App() {
    return (
        <QueryClientProvider client={$$queryClient}>
            <ToasterProvider>
                <RealmProvider>
                    <RouterProvider router={router} />
                </RealmProvider>
            </ToasterProvider>
        </QueryClientProvider>
    );
}
