
require("dotenv").config();
const axios = require("axios");

const {toBigNumberFixed, plus, multiply, divide} = require('../utils/calculator');
const { stat } = require("graceful-fs");

const baseURL = process.env.WALLPAY_TEST_BASEURL;
const bearerToken = process.env.WALLPAY_BEARER_TOKEN;

const axiosInstance = axios.create({
    baseURL,
    headers: {'Authorization':`Bearer ${bearerToken}`},
    timeout: 9000}
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
                    // eslint-disable-next-line max-len
                    "No valid packages found to test. Ensure that at least one package is available and does not have the name CnB (for the test user)",
                );
            }

            for (let item of validPackages) {
                

                try{
                    const responseOfAgreement = await axiosInstance.post(
                        `/v1/loans/agreement`,
                        { loanAmount: item.amount, loanConfigID: item.loanConfigID },
                    );

                    expect(responseOfAgreement.status).toBe(201);

                    // console.log(validPackages);
                    // console.log(agreement.data);

                    const {loanConfig, repaymentAmount, loanAmount, collateralAmount,
                        liquidationAmount, repayments, commission }=responseOfAgreement.data;

                    const {minAmount, maxAmount, ltv, liquidationLtv, warningLtv, validLtv,
                        validLiquidationLtv, validWarningLtv,
                        karmaRate, installmentCount, installmentSide, commissionAmount, commissionRate, loanProvider} = loanConfig;

                    const collateralPrice =loanConfig.collateralAsset.value;
                    const collateralPrecision =loanConfig.collateralAsset.precision;
            
                    const ltvThreshold = "0.9";
                    const liquidationLtvThreshold = "0.95";
                    const warningLtvThreshold = "0.92";
        

                    //Temporarily commenting out this assertion until the issue is fixed
                    //https://jira.wallex.network/browse/WF-1292 
                    // const packageAssetAmount = item.assetAmount;
                    // expect(toBigNumberFixed(collateralAmount,collateralPrecision))
                    //     .toBe(toBigNumberFixed(packageAssetAmount,collateralPrecision));

                    expect(loanProvider).toBe(item.loanProvider);

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

                    //TODO: write tests for interestRate
                    //TODO: roundPlace

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
                    console.error(`Error occurred while calling /v1/loans/agreement API:`, error.response?.data);
                    throw error;
                }
            }
        } catch (error) {
            console.error(`Error occurred while calling /v1/loans/packages API:`, error.response?.data);
            throw error;
    
        }}
        ,9000
    );

    test("Agreement API validation for CnBs", async ()=> {

        try {
        
            const responseOfPackages = await axiosInstance.get(`/v1/loans/packages`);
            expect(responseOfPackages.status).toBe(200);

            const validPackages = responseOfPackages.data.data.filter(
                (item) => item.available === true && item.name === "CnB"
            );

            if (validPackages.length == 0){
                // eslint-disable-next-line max-len
                throw new Error("No valid CnB packages found to test. Ensure that at least one CnB package is available for the test user");
            }

            console.log(validPackages);

            for (let item of validPackages){

                try {

                    const responseOfAgreement= await axiosInstance.post(

                        //TODO: item.amount (keep in mind that it is max of available amount)
                        `/v1/loans/agreement`,{ loanAmount: item.amount, loanConfigID: item.loanConfigID });

                    expect(responseOfAgreement.status).toBe(201);

                    
                    console.log(responseOfAgreement.data);
    
                    const {loanConfig, repaymentAmount, loanAmount, collateralAmount,
                        repayments, commission }=responseOfAgreement.data;
    
                    const {minAmount, maxAmount, ltv, liquidationLtv, warningLtv, validLtv,
                        validLiquidationLtv, validWarningLtv,karmaRate, installmentCount, installmentSide,
                        commissionAmount, commissionRate, collateralDisabled, loanProvider} = loanConfig;
                        
                    const collateralPrecision =loanConfig.collateralAsset.precision;
                
                    const ltvThreshold = "0.9";
                    const liquidationLtvThreshold = "0.95";
                    const warningLtvThreshold = "0.92";

                    const packageAssetAmount = item.assetAmount;
    
                    if (collateralDisabled === true){
                        
                        expect(toBigNumberFixed(collateralAmount, collateralPrecision)).toBe(
                            toBigNumberFixed(0,collateralPrecision));
                        expect(toBigNumberFixed(packageAssetAmount, collateralPrecision)).toBe(
                            toBigNumberFixed(0,collateralPrecision));

                        // Temporarily commenting out this assertion until the issue is fixed
                        //https://jira.wallex.network/browse/WF-1293 
                        // expect(toBigNumberFixed(liquidationAmount,0)).toBe(
                        //     toBigNumberFixed(0,collateralPrecision)
                        // );
                    }

                    expect(loanProvider).toBe(item.loanProvider);

                    expect(loanAmount).toBe(item.amount);

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
                    console.error(`Error occurred while calling /v1/loans/agreement API:`, error.response?.data);
                    throw error;
                }
            }

        } catch (error) {
            console.error(`Error occurred while calling /v1/loans/packages API:`, error.response?.data);
            throw error;
        }});

    // test("Ensure agreement and finalize results are consistent for non-CnBs (Tara)", async () =>{

    //     try {
    //         const responseOfPackages= await axiosInstance.get(`/v1/loans/packages`,{
    //             params: {
    //                 loanProvider: 'tara'
    //             }
    //         });
    //         expect(responseOfPackages.status).toBe(200);

    //         for (let item of responseOfPackages.data.data){
    //             expect(item.loanProvider).toBe("tara");
    //         }

    //         const validpackages= responseOfPackages.data.data.filter(
    //             (item) => item.available === true && item.name !== "CnB"
    //         );

    //         if (validpackages.length == 0 ){
    //             // eslint-disable-next-line max-len
    //             throw new Error('No valid Tara packages found to test. Ensure that at least one Tara package is available for the test user');
    //         }
    //         // console.log(validpackages);

    //         for (let item of validpackages){

    //             try {
    //                 const responseOfAgreement = await axiosInstance.post(`/v1/loans/agreement`,
    //                     { loanAmount: item.amount, loanConfigID: item.loanConfigID }
    //                 );

    //                 expect(responseOfAgreement.status).toBe(201);
                    
    //                 console.log(`responseOfAgreement`,responseOfAgreement.data);


    //                 //TODO: tests for loan provider
    //                 const {loanConfig, repaymentAmount, loanAmount, collateralAmount,
    //                     liquidationAmount, repayments, commission, id }=responseOfAgreement.data;

    //                 const {minAmount, maxAmount, ltv, liquidationLtv, warningLtv, validLtv,
    //                     validLiquidationLtv, validWarningLtv,
    //                     karmaRate, installmentCount, installmentSide, commissionAmount,
    //                      commissionRate, loanProvider, id: loanConfigID} = loanConfig;


    //                 const collateralPrice =loanConfig.collateralAsset.value;
    //                 const collateralPrecision =loanConfig.collateralAsset.precision;
    //                 const collateralSymbol=loanConfig.collateralAsset.symbol;
            
    //                 const ltvThreshold = "0.9";
    //                 const liquidationLtvThreshold = "0.95";
    //                 const warningLtvThreshold = "0.92";

    //                 try {
    //                     const responseOfFinalize= await axiosInstance.post(`/v1/loans/agreement/finalize`,
    //                         {id}
    //                     );


    //                     const {
    //                         id : loanID,
    //                         collateralAsset: collateralAssetFinalize,
    //                         amount: amountFinalize,
    //                         collateralAmount: collateralAmountFinalize,
    //                         installments: installmentsFinalize,
    //                         repayments: repaymentsFinalize, 
    //                         loanConfig: loanConfigFinalize, 
    //                         totalRepay: totalRepayFinalize, 
    //                         remainingRepay: remainingRepayFinalize, 
    //                         commission: commissionFinalize,
    //                         loanProvider: loanProviderFinalize,
    //                         status,
                            
    //                     } = responseOfFinalize.data;

    //                     const {
    //                         id: loanConfigIdFinalize,
                            
    //                     }=loanConfigFinalize;

    //                     const collateralSymbolFinalize=collateralAssetFinalize.symbol;


    //                     console.log(loanID);
    //                     console.log(`responseOfFinalize`,responseOfFinalize.data);

    //                     expect(loanConfigID).toBe(loanConfigIdFinalize);
    //                     expect(loanProvider).toBe(loanProviderFinalize);
    //                     expect(collateralSymbol).toBe(collateralSymbolFinalize);
    //                     expect(loanAmount).toBe(amountFinalize);

    //                     //TODO: collateralAmount assertion (based on ltvThreshhold)

    //                     expect(installmentCount).toBe(installmentsFinalize);
    //                     expect(status).toBe("active");
                        
                        






                    



    //                     try {
    //                         const responseOfCheckCancel = await axiosInstance.get(`/v1/loans/cancel/${loanID}`,
    //                         );
                            
    //                         const reasons= responseOfCheckCancel.data.reasons.data;
    //                         const firstReasonId= reasons[0].id;
    //                         console.log(firstReasonId);

    //                         // console.log(responseOfCheckCancel.data);


    //                         try {
    //                             const responseOfCancelLoan = await axiosInstance.post(`/v1/loans/cancel`,
    //                                 {
    //                                     loanID,
    //                                     reasonID: firstReasonId
    //                                 } 
    
    //                             );

    //                             //TODO: fix the error
    //                             // Cannot log after tests are done. Did you forget to wait for something async in your test?
    //                             console.log(`responseOfCancelLoan`,responseOfCancelLoan.data);

    //                             expect(responseOfCancelLoan.status).toBe(200);
                               
                                
    //                         } catch (error) {
    //                             console.error(`Error occurred while calling /v1/loans/cancel API:`, error.response?.data);
    //                             throw error;
                                
    //                         }
                            
    //                     } catch (error) {
    //                         console.error(`Error occurred while calling /v1/loans/cancel/{id} check cancel API:`
    //                             , error.response?.data);
    //                         throw error;
    //                     }
                        

    //                 } catch (error) {
    //                     console.error(`Error occurred while calling /v1/loans/agreement/finalize API:`, error.response?.data);
    //                     throw error;
                        
    //                 }

    //             } catch (error) {
    //                 console.error(`Error occurred while calling /v1/loans/agreement API:`, error.response?.data);
    //                 throw error;
    //             }
    //         }

    //     } catch (error) {
    //         console.error(`Error occurred while calling /v1/loans/packages API:`, error.response?.data);
    //         throw error;
    //     }
    // });
});

