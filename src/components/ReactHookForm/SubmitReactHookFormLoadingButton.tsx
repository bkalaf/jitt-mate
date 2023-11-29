import { useFormContext } from 'react-hook-form-mui';
import { CircularProgress } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

export function SubmitReactHookFormLoadingButton() {
    const { formState } = useFormContext();
    const isLoading = formState.isSubmitting;
    return (
        <LoadingButton variant='contained' className='inline-flex' color='secondary' type='submit' size='small' loading={isLoading} loadingIndicator={<CircularProgress color='warning' />}>
            Submit
        </LoadingButton>
    );
}
