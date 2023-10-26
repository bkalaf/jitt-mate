import { useNavigate } from 'react-router-dom';
import { FALSE } from '../../common/FALSE';
import { TRUE } from '../../common/TRUE';
import { useMemo } from 'react';
import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { LabelOrIcon } from './LabelOrIcon';
import { NavLink } from 'react-router-dom';
import { $cn } from '../../util/$cn';
import { ignore } from '../../common/functions/ignore';
import { is } from '../../dto/is';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toProperFromCamel } from '../../common/text/toProperCase';

export function createActiveClassFunction({ className, baseClasses }: { className?: string; baseClasses?: string }) {
    return function activeClassName({ isActive }: { isActive?: boolean }) {
        return $cn({ className: [className, baseClasses].filter((x) => is.not.nil(x) && is.not.empty(x)).join(' ') } as Props, { 'bg-lime-500': isActive ?? false }).className;
    };
}
export function Button(
    props: { children?: string; route?: string; disabledCondition?: () => boolean; renderCondition?: () => boolean; icon?: IconDefinition } & Partial<React.ButtonHTMLAttributes<HTMLButtonElement>>
) {
    const baseClasses =
        'flex items-center justify-center px-2 py-1 transition-all duration-700 ease-in-out delay-75 bg-pink-700 border-2 border-white rounded-lg hover:bg-yellow-400 hover:text-black disabled:blur font-open-sans text-xl font-bold text-white no-underline mx-auto';
    const { children, onClick, disabledCondition, disabled, renderCondition, route, type, icon, className, ...remain } = props;
    const $className = useMemo(() => createActiveClassFunction({ className, baseClasses }), [className]);
    const $onClick = useMemo(() => (onClick != null ? onClick : ignore), [onClick]);
    const $disabled = useMemo(() => (disabledCondition != null ? disabledCondition() : disabled != null ? disabled : false), [disabled, disabledCondition]);
    const $canRender = useMemo(() => (renderCondition != null ? renderCondition() : true), [renderCondition]);
    return $canRender ? (
        route != null ? (
            <NavLink to={route} className={$className} aria-disabled={$disabled}>
                {icon != null ? <FontAwesomeIcon icon={icon} className='block object-fill w-5 h-5' /> : is.nil(route) ? is.nil(children) ? null : children : toProperFromCamel(route)}
            </NavLink>
        ) : (
            <button type={type ?? 'button'} className={$className({ isActive: false })} onClick={$onClick} disabled={$disabled} {...remain}>
                {icon != null ? <FontAwesomeIcon icon={icon} className='block object-fill w-5 h-5' /> : is.nil(children) ? null : children}
            </button>
        )
    ) : null;
}
