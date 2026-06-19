export const smartTrim = (str = '', n: number, delim = ' ', appendix = '...') => {
    const trueLength = Math.max(0, n - appendix.length);

    if (str.length <= trueLength) return str;
    const trimmedStr = str.slice(0, trueLength + delim.length);
    const lastDelimIndex = trimmedStr.lastIndexOf(delim);
    if (lastDelimIndex >= 0) return trimmedStr.slice(0, lastDelimIndex) + appendix;
    return trimmedStr + appendix;
};
