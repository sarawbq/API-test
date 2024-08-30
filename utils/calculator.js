const BigNumber = require ('bignumber.js')

const toBigNumberFixed = (value, decimals) => {
    return new BigNumber(value).toFixed(decimals);
}

const plus = (a,b) => {
   const A = new BigNumber(a);
   const B = new BigNumber(b);
   const result = A.plus(B);
   return result.toString(10)
}

const minus = (a,b) => {
    const A = new BigNumber(a);
    const B = new BigNumber(b);
    const result = A.minus(B);
    return result.toString(10)
 }

 const multiply = (a,b) => {
    const A = new BigNumber(a);
    const B = new BigNumber(b);
    const result = A.multipliedBy(B);
    return result.toString(10)
 }

 const divide = (a,b) => {
    const A = new BigNumber(a);
    const B = new BigNumber(b);
    const result = A.div(B);
    return result.toString(10)
 }

module.exports = {
    toBigNumberFixed, plus, minus, multiply, divide
}