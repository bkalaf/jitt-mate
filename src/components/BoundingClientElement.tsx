import { useCallback, useEffect, useMemo, useState } from 'react';
import { process } from '@electron/remote';


export function BoundingClientElement({ children }: { children: Children; }) {
    const [height, setHeight] = useState(0);
    const ref = useCallback((node: HTMLElement | null) => {
        if (node != null) {
            const h = node.getBoundingClientRect().height;
            process.stdout.write(`Height: ${h}`);
            console.log(`height`, h);
            setHeight(h);
        }
    }, []);
    useEffect(() => {
        process.stdout.write(`CHANGED Height: ${height}`);
        console.log(`CHANGED height`, height);
    }, [height]);
    const style = useMemo((): React.CSSProperties => height !== 0 ? ({
        maxHeight: `${height.toFixed(0)}px`
    }) : {}, [height]);
    return (
        <div className='relative w-full h-full overflow-auto' ref={ref} style={style}>
            {children}
        </div>
    );
}
