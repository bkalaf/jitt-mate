import { QueryClient } from '@tanstack/react-query';

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
