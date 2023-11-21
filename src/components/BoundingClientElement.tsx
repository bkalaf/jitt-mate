import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { process } from '@electron/remote';


export function BoundingClientElement({ children }: { children: Children; }) {
    const [height, setHeight] = useState(0);
    const ref = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        if (ref.current) {
            const h = ref.current.getBoundingClientRect().height;
            setHeight(h);
        }
        process.stdout.write(`CHANGED Height: ${height}`);
        console.log(`CHANGED height`, height);
    }, [height]);
    const style = useMemo(
        (): React.CSSProperties =>
            height !== 0
                ? {
                      maxHeight: `${height.toFixed(0)}px`
                  }
                : {},
        [height]
    );
    useEffect(() => {
        const listener = (ev: Event) => {
            const h = ref.current?.getBoundingClientRect().height;
            setHeight(prev => prev === h ? prev : h ?? 0)
        }
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, []);
    return (
        <div
            className='flex flex-grow p-5 overflow-auto'
            ref={ref}
            style={style}>
            {children}
        </div>
    );
}
