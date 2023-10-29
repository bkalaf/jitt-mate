
export function daysDiff(date1: Date) {
    const factor = 1000 * 60 * 60 * 24;
    return function (date2: Date) {
        return (date1.valueOf() - date2.valueOf()) / factor;
    };
}
