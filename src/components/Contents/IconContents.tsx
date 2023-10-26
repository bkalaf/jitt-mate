import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function IconContents({ icon, className }: { icon?: IconDefinition; className?: string; }) {
    console.log(`IconEl`, icon, className);
    return icon != null ? (
        <span className='inline-flex p-0.5'>
            <FontAwesomeIcon icon={icon} className={['block object-fill w-5 h-5', className].join(' ')} />
        </span>
    ) : null;
}
