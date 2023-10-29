import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useInvalidator(objectType: string) {
    const queryClient = useQueryClient();
    return useMemo(() => {
        return {
            onSuccess: () => {
                console.log(`invalidating`);
                console.log(`querykey`, [objectType]);
                queryClient
                    .invalidateQueries({
                        queryKey: [objectType ?? '']
                    })
                    .then(() => {
                        queryClient.refetchQueries(
                            {
                                queryKey: [objectType ?? '']
                            },
                            {
                                throwOnError: true
                            }
                        );
                    });
            }
        };
    }, [objectType, queryClient]);
}
