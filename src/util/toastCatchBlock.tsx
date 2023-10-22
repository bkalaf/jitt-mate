
export function toastCatchBlock(createErrorToast: (s: string, t: string) => void, createFailureToast: (s: string, t: string) => void) {
    return (error: unknown) => {
        if (error instanceof Error) {
            createErrorToast(error.message, error.name);
        } else {
            createFailureToast('The log out failed for an unknown reason.', 'LOG OUT FAILED');
        }
    };
}
