// import { process } from '@electron/remote';

export function catchError(err: unknown) {
    console.error((err as Error).message);
    console.log(err);
    process.stdout.write((err as Error).name.concat('\n'));
    process.stdout.write((err as Error).message.concat('\n'));
    process.stdout.write(((err as Error).stack?.toString() ?? '').concat('\n'));
}
