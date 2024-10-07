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

describe('parallel request for cnb Loans',()=> {

    test('parallel',async() =>{

        try {


            const responseOfAgreement = await axiosInstance.post(`/v1/loans/agreement`,
                { loanAmount: "20000000", loanConfigID: 5 }
            );

            expect(responseOfAgreement.status).toBe(201);
            
            console.log(`responseOfAgreement`,responseOfAgreement.data);


            //TODO: tests for loan provider
            const { id }=responseOfAgreement.data;

            try {
                const responseOfFinalize= await axiosInstance.post(`/v1/loans/agreement/finalize`,
                    {id}
                );

                console.log(responseOfFinalize.data.id);

            }  catch (error) {
                console.error(`Error occurred while calling finalize API:`, error.response?.data);
                throw error;
            
            }


            



        } catch (error) {
            console.error(`Error occurred while calling agreement API:`, error.response?.data);
            throw error;
        
        }

});


});