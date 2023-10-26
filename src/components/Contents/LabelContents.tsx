export function LabelContents({ children }: { children?: string; }) {
    console.log(`LabelEl`, children);
    return children != null ? <span className='flex flex-grow w-full text-xl font-bold text-white uppercase font-open-sans text-center px-2.5 py-1'>{children}</span> : null;
}
