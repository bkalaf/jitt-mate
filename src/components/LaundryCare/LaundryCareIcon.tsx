import { useCallback, useEffect } from 'react';
import { $cn } from '../../util/$cn';

export function LaundryCareIcon({
    SvgElement,
    className,
    isSelected,
    name,
    register,
    getToggler
}: {
    isSelected: (n: string) => boolean;
    className: string;
    register: (n: string) => void;
    name: string;
    getToggler: (n: string) => () => void;
    SvgElement: React.FunctionComponent<{ className?: string }>;
}) {
    const spread = $cn({}, {}, className, 'aria-selected:bg-lime-500 aria-unselected:bg-neutral-400');
    const onClick = useCallback(() => {
        getToggler(name)();
    }, [getToggler, name]);
    useEffect(() => {
        register(name);
    }, [name, register]);
    return (
        <button type='button' onClick={onClick} className='p-0 m-0'>
            <SvgElement {...spread} aria-selected={isSelected(name) ?? false} />
        </button>
    );
}
