import { useRealmContext } from '../hooks/useRealmContext';
import { useEffect } from 'react';
import { useReflectionContext } from '../hooks/useReflectionContext';

export function SchemaLoader() {
    const { schema } = useRealmContext();
    const { register } = useReflectionContext();
    useEffect(() => {
        schema.forEach((s) => {
            console.log(`Registering: ${s.schema?.name}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            register(s as any);
        });
    }, [register, schema]);
    return <></>;
}
