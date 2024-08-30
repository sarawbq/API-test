require("dotenv").config();
const axios = require("axios");

const {toBigNumberFixed, plus, minus, multiply, divide} = require('../utils/calculator');

const baseURL = process.env.WALLPAY_TEST_BASEURL;
const bearerToken = process.env.WALLPAY_BEARER_TOKEN;

const axiosInstance = axios.create({
    baseURL,
    headers: {'Authorization':`Bearer ${bearerToken}`}}
);

describe("GetLoan API tests", () => {
    describe("checking agreement of every returned package", () => {
        test("checking correctness of agreement response for available packages (none CnBs)", async () => {
            const responseOfPackages = await axiosInstance.get(
                `/v1/loans/packages`
            );
            expect(responseOfPackages.status).toBe(200);

            const validPackages = responseOfPackages.data.data.filter(
                (item) => item.available === true && item.name !== "CnB",
            );

            if (validPackages.length == 0) {
                throw new Error(
                    "No valid packages found to test. Ensure that at least one package is available and does not have the name CnB",
                );
            }

            for (let item of responseOfPackages.data.data) {
                if ((item.available == true) & (item.name != "CnB")) {
                    const agreement = await axiosInstance.post(
                        `/v1/loans/agreement`,
                        { loanAmount: item.amount, loanConfigID: item.loanConfigID },
                    );

                    expect(agreement.status).toBe(201);


                    // const packageConfigId = item.loanConfigID;
                    const packageAssetAmount = item.assetAmount;

                    const {loanConfig, repaymentAmount, loanAmount, collateralAmount, liquidationAmount}=agreement.data;

                    const collateralPrice =loanConfig.collateralAsset.value;
                    const collateralPrecision =loanConfig.collateralAsset.precision;
                    const ltv = loanConfig.ltv;
                    const liquidationLtv = loanConfig.liquidationLtv;
                    const warningLtv = loanConfig.warningLtv;
                    const karma = loanConfig.karmaRate;
                    const ltvThreshold = "0.9";
                    const liquidationLtvThreshold = "0.95";
                    const warningLtvThreshold = "0.92";
                    const validLtv = loanConfig.validLtv;
                    const validLiquidationLtv =loanConfig.validLiquidationLtv;
                    const validWarningLtv = loanConfig.validWarningLtv;
                    const minAmount = loanConfig.minAmount;
                    const maxAmount = loanConfig.maxAmount;

            
                    expect(toBigNumberFixed(collateralAmount,collateralPrecision))
                        .toBe(toBigNumberFixed(packageAssetAmount,collateralPrecision));

                    expect(loanAmount).toBe(item.amount);


                    expect(toBigNumberFixed(collateralAmount,collateralPrecision)).toBe(
                        toBigNumberFixed(divide (divide(repaymentAmount,validLtv),collateralPrice),collateralPrecision)
                    );

                    expect(+loanAmount).toBeGreaterThanOrEqual(+minAmount);
                    expect(+loanAmount).toBeLessThanOrEqual(+maxAmount);

                    let newLtv = multiply(karma,ltv);
                    if (newLtv > ltvThreshold) {
                        newLtv = ltvThreshold;
                    }

                    let newLiquidationLtv = multiply(karma,liquidationLtv);
                    if (newLiquidationLtv > liquidationLtvThreshold) {
                        newLiquidationLtv = liquidationLtvThreshold;
                    }

                    let newWarningLtv = multiply(karma,warningLtv);
                    if (newWarningLtv > warningLtvThreshold) {
                        newWarningLtv = warningLtvThreshold;
                    }
                   
                    expect(validLtv).toBe(newLtv);
                    expect(validLiquidationLtv).toBe(newLiquidationLtv);
                    expect(validWarningLtv).toBe(newWarningLtv);

                    expect(toBigNumberFixed(liquidationAmount,0)).toBe(
                        toBigNumberFixed((divide(repaymentAmount,validLiquidationLtv)),0)
                    );
                }
            }
        });
    });
});
