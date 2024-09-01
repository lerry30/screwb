export const toNumber = (value) => {
    try {
        const cNumber = Number(value);
        return isNaN(cNumber) ? Number(value.replace(/[^0-9.]/g, '')) : cNumber;
    } catch(error) {
        return 0;
    }
}

export const formatNumber = (number) => {
    const num = toNumber(number);
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}
