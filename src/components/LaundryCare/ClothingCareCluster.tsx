import { LaundryCareIcon } from './LaundryCareIcon';

export function ClothingCareCluster(props: IClothingCareClusterProps) {
    const { elements, isSelected, getToggler, title, register } = props;
    return (
        <div className='flex flex-col'>
            <div className='inline-flex items-center justify-start py-1 pl-5 text-xl font-bold text-white bg-black border-2 border-black font-open-sans'>
                <span className='inline-flex px-2 bg-cyan-600/50 p-0.5 border border-white shadow-inner shadow-sky-300 rounded-md'>{title}</span>
            </div>
            <div className='flex flex-row justify-center px-4 space-x-2 bg-slate-700'>
                {elements.map(({ SvgElement, name }, ix) => (
                    <LaundryCareIcon register={register} className='w-10 h-10' key={ix} name={name} getToggler={getToggler} isSelected={isSelected} SvgElement={SvgElement} />
                ))}
            </div>
        </div>
    );
}
