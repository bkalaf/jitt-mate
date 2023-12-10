export const ParseResult = {
    ctor: {
        success<T>(value: T): ParseResult<T> {
            return { kind:'success', value }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        failure(value: string, dataType: string): ParseResult<any> {
            return { kind: 'failure', value, message: `Could not parse a ${dataType} from this value.`}
        }
    },
    is: {
        success<T>(pr: ParseResult<T>): pr is IParseSuccess<T> {
            return pr.kind === 'success';
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        failure(pr: ParseResult<any>): pr is IParseFailure {
            return pr.kind === 'failure';
        }
    },
    fromEl: <T>(method: 'value' | 'valueAsDate' | 'valueAsNumber') => (el: HTMLInputElement): ParseResult<T> => {
        try {
            const value = el[method];
            return ParseResult.ctor.success<T>(value as T);
        } catch (error) {
            return ParseResult.ctor.failure(el.value, method === 'value' ? 'string' : method.replaceAll('valueAs', '').toLowerCase())
        }
    }
}

