
export function TableCell({ children }: { children?: Children; }) {
    return (
        <td className='text-base font-medium border border-black font-open-sans'>
            <span className='flex w-full h-full whitespace-nowrap'>
                {children}
            </span>
        </td>
    );
}
