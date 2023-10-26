import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getNumericIconFromText } from './getNumericIconFromText';

export function NumericIcon({ children }: { children: string }) {
    const icon = useMemo(() => getNumericIconFromText(children), [children]);
    return (
        <span className='inline-block w-auto h-auto mx-1'>
            <FontAwesomeIcon icon={icon} className='object-cover text-white' size='2x' />
        </span>
    );
}
