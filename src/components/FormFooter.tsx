import { Button } from './Buttons/Button';
import { useFormContext } from './Contexts/useFormContext';
import { ignore } from '../common/functions/ignore';


export function FormFooter() {
    const { formID } = useFormContext();
    return (
        <div className='flex justify-end col-span-2 px-5'>
            <Button type='button' className='inline-flex' form={formID} onClick={ignore}>Cancel</Button>
            <Button type='reset' className='inline-flex' form={formID}></Button>
            <Button type='submit' className='inline-flex' form={formID}></Button>
        </div>
    );
}
