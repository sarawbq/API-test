
require("dotenv").config();
const axios = require("axios");

const {toBigNumberFixed, plus, multiply, divide} = require('../utils/calculator');

const baseURL = process.env.WALLPAY_TEST_BASEURL;
const bearerToken = process.env.WALLPAY_BEARER_TOKEN;

const axiosInstance = axios.create({
    baseURL,
    headers: {'Authorization':`Bearer ${bearerToken}`},
    timeout: 3000}
);

describe("Credit Process from Packages", () => {
    test("Agreement API validation for non-CnBs", async () => {

        try{
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

                    try{
                        const agreement = await axiosInstance.post(
                            `/v1/loans/agreement`,
                            { loanAmount: item.amount, loanConfigID: item.loanConfigID },
                        );

                        expect(agreement.status).toBe(201);

                        // console.log(agreement.data);

                        const packageAssetAmount = item.assetAmount;

                        const {loanConfig, repaymentAmount, loanAmount, collateralAmount,
                            liquidationAmount, repayments, commission }=agreement.data;

                        const {minAmount, maxAmount, ltv, liquidationLtv, warningLtv, validLtv,
                            validLiquidationLtv, validWarningLtv,
                            karmaRate, installmentCount, installmentSide, commissionAmount, commissionRate} = loanConfig;

                        const collateralPrice =loanConfig.collateralAsset.value;
                        const collateralPrecision =loanConfig.collateralAsset.precision;
            
                        const ltvThreshold = "0.9";
                        const liquidationLtvThreshold = "0.95";
                        const warningLtvThreshold = "0.92";
        
                        expect(toBigNumberFixed(collateralAmount,collateralPrecision))
                            .toBe(toBigNumberFixed(packageAssetAmount,collateralPrecision));

                        expect(loanAmount).toBe(item.amount);

                        expect(toBigNumberFixed(collateralAmount,collateralPrecision)).toBe(
                            toBigNumberFixed(
                                divide(
                                    divide(repaymentAmount,validLtv),
                                    collateralPrice
                                ),
                                collateralPrecision
                            )
                        );

                        expect(+loanAmount).toBeGreaterThanOrEqual(+minAmount);
                        expect(+loanAmount).toBeLessThanOrEqual(+maxAmount);

                        let newLtv = multiply(karmaRate,ltv);
                        if (newLtv > ltvThreshold) {
                            newLtv = ltvThreshold;
                        }

                        let newLiquidationLtv = multiply(karmaRate,liquidationLtv);
                        if (newLiquidationLtv > liquidationLtvThreshold) {
                            newLiquidationLtv = liquidationLtvThreshold;
                        }

                        let newWarningLtv = multiply(karmaRate,warningLtv);
                        if (newWarningLtv > warningLtvThreshold) {
                            newWarningLtv = warningLtvThreshold;
                        }
                   
                        expect(validLtv).toBe(newLtv);
                        expect(validLiquidationLtv).toBe(newLiquidationLtv);
                        expect(validWarningLtv).toBe(newWarningLtv);

                        expect(toBigNumberFixed(liquidationAmount,0)).toBe(
                            toBigNumberFixed(
                                divide(repaymentAmount,validLiquidationLtv),
                                0
                            )
                        );

                        if (installmentSide === "internal") {
                            expect(repayments).toHaveLength(installmentCount);
                    
                            let totalRepyamentAmount = 0;

                            for (let r of repayments){
                                totalRepyamentAmount = plus(totalRepyamentAmount,r.amount);
                            }
                    
                            expect (toBigNumberFixed(totalRepyamentAmount,0)).toBe(toBigNumberFixed(repaymentAmount,0));
                        }
                        else if (installmentSide === "external") {
                            expect(repayments).toHaveLength(0);
                        }


                        let totalCommission = 0;
                        totalCommission = plus(totalCommission, commissionAmount);
                        if (commissionRate !== '0') {
                            const commissionRateAmount = multiply(loanAmount,commissionRate);
                            totalCommission = plus(totalCommission, commissionRateAmount);   
                        }
                        expect(toBigNumberFixed(totalCommission,0)).toBe(toBigNumberFixed(commission));
                    } catch (error) {
                        console.error("Error occurred:", error.response?.data);
                        throw error;
                    }}
            }
        } catch (error) {
            console.error("Error occurred:", error.response?.data);
            throw error;
        }});
});

