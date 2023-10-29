import { Button } from './Button';
import { TRUE } from '../../common/TRUE';
import { not } from '../../dal/not';

export interface ISubmitButtonProps {
    children?: string;
    condition?: (() => boolean) | undefined;
}
export function SubmitButton({ children, condition }: ISubmitButtonProps) {
    return (
        <Button disabledCondition={not(condition ?? TRUE)} type='submit'>
            {children ?? 'Submit'}
        </Button>
    );
    // return (condition ?? TRUE)() ? (
    //     <button
    //         className='flex items-center justify-center px-2 py-1 text-2xl font-bold text-white uppercase transition-all duration-1000 ease-in-out delay-150 bg-pink-700 border border-white rounded-lg font-pala-dark ring-transparent ring-2 hover:bg-yellow-400 hover:text-black'
    //         type='submit'>
    //         <span className='inline-flex px-1.5'>{children ?? 'Submit'}</span>
    //     </button>
    // ) : null;
}
