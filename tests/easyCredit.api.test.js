// require("dotenv").config();
// const axios = require("axios");

// const {toBigNumberFixed, plus, minus, multiply, divide} = require('../utils/calculator');


// const baseURL = process.env.WALLPAY_TEST_BASEURL;
// const wallexBaseUrl = process.env.WALLEX_BASEURL;
// const bearerToken = process.env.WALLPAY_BEARER_TOKEN;

// const axiosInstance = axios.create({
//     baseURL,
//     headers: {'Authorization':`Bearer ${bearerToken}`}}
// );

// describe("easyCredit API tests", () => {
  
//     test("pre agreement API test / with toBePayedAmount", async () => {

//         //TODO: get the fields from API
       
//         const loanConfigIdBody = 36;
//         const toBePayedAssetAmountBody = "1000000";
//         const responseOfPreAgreement = await axiosInstance.post(
//             `/v1/loans/pre-agreement`,
//             {
//                 loanConfigID: loanConfigIdBody,
//                 toBePayedAssetAmount: toBePayedAssetAmountBody,
//             },
//         );
//         console.log(responseOfPreAgreement.data);

//         const {loanConfig, toGetAmount, toBePayedAssetAmount, collateralAmount}= responseOfPreAgreement.data;

//         const collateralAsset = loanConfig.collateralAsset.symbol;

//         const collateralPrecision = loanConfig.collateralAsset.precision;

//         const ResponseOfOtcPrice = await axios.get(
//             `${wallexBaseUrl}/v1/otc/price?symbol=${collateralAsset}TMN&side=BUY`,
//         );

//         const collateralPrice = ResponseOfOtcPrice.data.result.price;
//         console.log(collateralPrice);

//         expect(toBePayedAssetAmount).toBe(toBePayedAssetAmountBody);

//         expect(toBigNumberFixed(toGetAmount,collateralPrecision)).toBe(toBigNumberFixed(collateralAmount,collateralPrecision));

//         expect(toBigNumberFixed(toGetAmount,collateralPrecision)).toBe(
//             toBigNumberFixed(divide(toBePayedAssetAmountBody,collateralPrice),collateralPrecision)
//         );
//     });

//     test("pre agreement API test / with toBePayedAmount and walletWithdrawalAmount ", async () => {
//         const loanConfigIdBody = 36;
//         const toBePayedAssetAmountBody = "1000000";

//         //TODO: call assets API
//         const walletWithdrawalAmountBody = "15";

//         const responseOfPreAgreement = await axiosInstance.post(
//             `/v1/loans/pre-agreement`,
//             {
//                 loanConfigID: loanConfigIdBody,
//                 toBePayedAssetAmount: toBePayedAssetAmountBody,
//                 walletWithdrawalAmount: walletWithdrawalAmountBody
//             },
//         );
//         console.log(responseOfPreAgreement.data);

//         const {loanConfig, toGetAmount, toBePayedAssetAmount, collateralAmount, walletWithdrawalAmount} 
//         = responseOfPreAgreement.data;
       
//         const collateralAsset = loanConfig.collateralAsset.symbol;

//         const collateralPrecision = loanConfig.collateralAsset.precision;

//         const ResponseOfOtcPrice = await axios.get(
//             `${wallexBaseUrl}/v1/otc/price?symbol=${collateralAsset}TMN&side=BUY`,
//         );

//         const collateralPrice = ResponseOfOtcPrice.data.result.price;


//         expect(toBePayedAssetAmount).toBe(toBePayedAssetAmountBody);

      
//         expect(toBigNumberFixed(toGetAmount,collateralPrecision)).toBe(
//             toBigNumberFixed(divide(toBePayedAssetAmountBody,collateralPrice),collateralPrecision)
//         );

//         expect(toBigNumberFixed(collateralAmount,collateralPrecision)).toBe(
//             toBigNumberFixed((plus(toGetAmount,walletWithdrawalAmount)),collateralPrecision)
//         );

//     });
// });
