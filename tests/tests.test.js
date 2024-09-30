
require("dotenv").config();
const axios = require("axios");

// const {toBigNumberFixed, plus, multiply, divide} = require('../utils/calculator');

const baseURL = process.env.WALLPAY_TEST_BASEURL;
const bearerToken = process.env.WALLPAY_BEARER_TOKEN;

const axiosInstance = axios.create({
    baseURL,
    headers: {'Authorization':`Bearer ${bearerToken}`},
    timeout: 5000}
);

test("Ensure agreement and finalize results are consistent for non-CnBs (Tara)", async () =>{


    const loanID= 194;

    try {
        const responseOfCheckCancel = await axiosInstance.get(`/v1/loans/cancel/${loanID}`,
        );
        
        // const reasons= responseOfCheckCancel.reasons.data;
        // const firstReasonId= reasons[0].id;
        // console.log(firstReasonId);
    
        console.log(responseOfCheckCancel.data);
        const reasons= responseOfCheckCancel.data.reasons.data;
        console.log(reasons);
        // const firstReasonId= reasons[0].id;
        // console.log(firstReasonId);

    
    
        // try {
        //     const responseOfCancelLoan = await axiosInstance.post(`/v1/loans/cancel`,
        //         {
        //             loanID,
        //             reasonID: firstReasonId
        //         } 
    
        //     );
    
        //     console.log(responseOfCancelLoan.data);
            
        // } catch (error) {
        //     console.error(`Error occurred while calling /v1/loans/cancel API:`, error.response?.data);
        //     throw error;
            
        // }
        
    } catch (error) {
        if (error.response) {
            console.error(`Error occurred while calling /v1/loans/cancel/${loanID} check cancel API:`, error.response.data);
        } else {
            console.error(`Error occurred while calling /v1/loans/cancel/${loanID} check cancel API:`, error.message);
        }
        throw error; // Optional: rethrow the error if you want to fail the test
    }
    
    


});


