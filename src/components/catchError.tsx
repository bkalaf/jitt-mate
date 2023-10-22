export function catchError(err: unknown) {
    console.error((err as Error).message);
    console.log(err);
}
