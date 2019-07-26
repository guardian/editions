const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1)

/*
from https://blog.abelotech.com/posts/number-currency-formatting-javascript/
*/
const addCommas = (num: number): string =>
    num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

export { capitalizeFirstLetter, addCommas }
