import { $cn } from '../../util/$cn';

export function TableCell({ children, ...remain }: { children?: Children; className?: string }) {
    const $spread = $cn(remain, {}, 'indent-0 flex w-full h-full whitespace-nowrap');
    return (
        <td className='text-base font-medium border border-black font-open-sans'>
            <span {...$spread}>{children}</span>
        </td>
    );
}
