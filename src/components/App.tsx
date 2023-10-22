import { Route, RouterProvider, createHashRouter, createRoutesFromElements, useNavigate, useParams } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RealmProvider } from './contexts/RealmContext';
import { catchError } from './catchError';
import { LogInPage } from './LogInPage';
import { ToasterProvider } from './contexts/ToasterProvider';
import { AppRoot } from './AppRoot';

const TestEl = () => {
    const { collection } = useParams();
    return <div className='text-3xl'>{collection}</div>;
};
export const router = createHashRouter(
    createRoutesFromElements(
        <Route path='/' errorElement={<ErrorBoundary />} element={<AppRoot />}>
            <Route path='data'>
                <Route path=':collection'>
                    <Route index element={<TestEl />}/>
                </Route>
            </Route>
            <Route path='login' element={<LogInPage />}></Route>
        </Route>
    )
);

export function Button(props: { children: string; onClick?: () => void; route?: string; condition: () => boolean }) {
    const { children, onClick, condition, route } = props;
    const navigate = useNavigate();
    const $onClick = onClick ? onClick : () => navigate(route);
    return condition() ? (
        <button
            className='bg-blue-500 text-white border border-white rounded-md uppercase text-2xl font-bold font-grandstander p-0.5 items-center justify-center inline-flex m-0.5 mx-2'
            onClick={$onClick}>
            <span>{children}</span>
        </button>
    ) : null;
}

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
