export const getSiginifcantDigits = (n?: number) => {
    function peelEnd(digits: string[]) {
        if (digits.length === 0) return 0;
        if (digits.reverse()[0] === '0') {
            return peelEnd(digits.slice(0, digits.length - 1));
        }
        return digits.length;
    }
    return n == null || !n.toFixed(4).split('').includes('.') ? 0 : peelEnd(n.toFixed(4).split('.')[1].split(''));
};
