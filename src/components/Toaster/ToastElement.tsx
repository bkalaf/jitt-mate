import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { $cn } from '../../util/$cn';
import { faBug, faNewspaper, faSquare, faThumbsUp, faTrafficCone } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggler } from '../../hooks/useToggler';
import { Toast, ToastStage, cycleToastStage } from '../Contexts/ToasterContext';
import { randomString } from '../../util/randomString';

export function ToastElement({ message, title, toastType, prune }: Toast) {
    const [stage, setStage] = useState<ToastStage>('animating-in');
    const triggerCycler = useCallback(() => setStage(cycleToastStage), []);
    const onAnimationEnd = useCallback(
        () =>
            setStage((prev) => {
                if (prev === 'animating-in' || prev === 'animating-out') return cycleToastStage(prev);
                return prev;
            }),
        []
    );
    const [isPinned, togglePinned] = useToggler(false);
    const triggerCallback = useCallback(() => {
        token.current = setTimeout(() => {
            token.current = undefined;
            triggerCycler();
        }, 8000);
    }, [triggerCycler]);
    useEffect(() => {
        if (isPinned) {
            setStage('waiting');
            if (token.current) clearTimeout(token.current);
        }
    }, [isPinned, stage, triggerCallback]);
    const { className } = useMemo(
        () =>
            $cn(
                {} as { className?: string },
                {
                    animate__bounceInDown: stage === 'animating-in',
                    animate__fadeOutLeft: stage === 'animating-out'
                    // hidden: stage === 'expired' || stage === 'initialize',
                },
                'flex animate__animated w-full flex-row pointer-events-auto',
                'bg-slate-700 text-white'
            ),
        [stage]
    );
    console.log(`props`, className);
    const token = useRef<NodeJS.Timeout | undefined>(undefined);
    useEffect(() => {
        if (stage === 'waiting' && !isPinned) {
            triggerCallback();
        }
    }, [isPinned, stage, triggerCallback]);
    useEffect(() => {
        if (token.current && stage === 'expired') {
            clearTimeout(token.current);
            token.current = undefined;
        }
    }, [stage]);
    const onClick = useCallback(() => {
        if (stage !== 'animating-out' && stage !== 'expired') {
            if (token.current) {
                clearTimeout(token.current);
            }
            setStage('animating-out');
        }
    }, [stage]);
    const ref = useRef<HTMLDivElement | null>(null);
    const selfDestruct = useCallback(() => {
        if (ref.current != null) {
            ref.current.remove();
            prune();
        }
    }, [prune]);
    useEffect(() => {
        if (stage === 'expired') {
            selfDestruct();
        }
    }, [selfDestruct, stage]);
    const icon = useMemo(() => (toastType === 'success' ? faThumbsUp : toastType === 'error' ? faBug : toastType === 'info' ? faNewspaper : toastType === 'failure' ? faTrafficCone : faSquare), [toastType]);
    const inputId = useMemo(() => randomString(24), []);
    const spanProps = useMemo(
        () =>
            $cn(
                { className: 'inline-flex p-0.5 items-center' },
                {
                    'bg-red-500 text-white': toastType === 'error',
                    'bg-orange-500 text-white': toastType === 'failure',
                    'bg-lime-500 text-white': toastType === 'success',
                    'bg-cyan-500 text-white': toastType === 'info'
                }
            ),
        [toastType]
    );
    return (
        <div ref={ref} className={className} onAnimationEnd={onAnimationEnd} onClick={onClick}>
            <span {...spanProps}>
                <FontAwesomeIcon className='inline-block object-scale-down w-12 h-12' icon={icon} />
            </span>
            <span className='flex flex-col flex-grow w-full'>
                <header className='flex items-center justify-center w-full text-lg font-extrabold text-white uppercase bg-black border-2 border-white font-open-sans'>{title}</header>
                <p className='items-center justify-start flex w-full flex-grow px-1.5 text-base font-open-sans font-medium'>{message}</p>
                <span className='flex flex-row justify-start w-full indent-2'>
                    <label className='inline-flex text-sm text-black font-open-sans' htmlFor={inputId}>
                        SAVE and PIN this toast.
                    </label>
                    <input className='inline-flex text-lg' type='checkbox' defaultChecked={isPinned} onChange={togglePinned} id={inputId} />
                </span>
            </span>
        </div>
    );
}
