import { FALSE } from '../../common/FALSE';
import { TRUE } from '../../common/TRUE';
import { useMemo } from 'react';
import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { $cn } from '../../util/$cn';
import { ignore } from '../../common/functions/ignore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toProperFromCamel } from '../../common/text/toProperCase';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { is } from '../../dal/is';

export function createActiveClassFunction({ className, baseClasses }: { className?: string; baseClasses?: string }) {
    return function activeClassName({ isActive }: { isActive?: boolean }) {
        return $cn({ className: [baseClasses, className].filter((x) => is.not.nil(x) && is.not.empty(x)).join(' ') } as Props, { 'bg-lime-500': isActive ?? false }).className;
    };
}
export function handleCondition(condition?: ConditionOrBoolean, ifNull: Predicate<void> = FALSE) {
    if (condition == null) return ifNull();
    return is.func(condition) ? condition() : condition;
}
export function Button(
    props: { form?: string; children?: string; route?: string; disabledCondition?: ConditionOrBoolean; renderCondition?: ConditionOrBoolean; icon?: IconDefinition; iconSize?: SizeProp } & Partial<
        React.ButtonHTMLAttributes<HTMLButtonElement>
    >
) {
    const baseClasses =
        'flex items-center justify-center px-1 py-0.5 transition-all duration-700 ease-in-out delay-75 border-2 border-black rounded-md hover:bg-yellow-400 hover:text-black disabled:blur font-open-sans text-xl font-bold text-white no-underline mx-auto';
    const { children, onClick, disabledCondition, disabled, renderCondition, route, type, icon, className, ...remain } = props;
    const $className = useMemo(() => createActiveClassFunction({ className: '', baseClasses }), [className]);
    const $onClick = useMemo(() => (onClick != null ? onClick : ignore), [onClick]);
    const $disabled: boolean = useMemo(() => disabled ?? handleCondition(disabledCondition), [disabled, disabledCondition]);
    const $canRender: boolean = useMemo(() => handleCondition(renderCondition, TRUE), [renderCondition]);
    return $canRender ? (
        route != null ? (
            <NavLink to={route} className={$className} aria-disabled={$disabled}>
                {icon != null ? <FontAwesomeIcon icon={icon} className='block object-fill w-5 h-5' /> : is.nil(route) ? is.nil(children) ? null : children : toProperFromCamel(route)}
            </NavLink>
        ) : type === 'submit' || type =='reset' ? (
            <input type={type ?? 'button'} className={$className({ isActive: false })} disabled={$disabled} form={props.form} />
        ) : (
            <button type={type ?? 'button'} className={$className({ isActive: false })} onClick={$onClick} disabled={$disabled} {...remain}>
                {icon != null ? <FontAwesomeIcon icon={icon} className={`${className} object-fill block`} size={props.iconSize} /> : is.nil(children) ? null : children}
            </button>
        )
    ) : null;
}
