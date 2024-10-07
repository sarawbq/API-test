require("dotenv").config();
const axios = require("axios");

const { toBigNumberFixed, plus, multiply, divide } = require('../utils/calculator');
const { stat } = require("graceful-fs");

const baseURL = process.env.WALLPAY_TEST_BASEURL;
const bearerToken = process.env.WALLPAY_BEARER_TOKEN;

const axiosInstance = axios.create({
    baseURL,
    headers: { 'Authorization': `Bearer ${bearerToken}` },
    timeout: 9000
});

describe('parallel request for cnb Loans', () => {

    test('parallel', async () => {
        try {
            
            const [responseOfAgreement1, responseOfAgreement2] = await Promise.all([
                axiosInstance.post(`/v1/loans/agreement`, { loanAmount: "32000000", loanConfigID: 5 }),
                axiosInstance.post(`/v1/loans/agreement`, { loanAmount: "36000000", loanConfigID: 5 })
            ]);

            expect(responseOfAgreement1.status).toBe(201);
            expect(responseOfAgreement2.status).toBe(201);

            console.log(`responseOfAgreement1`, responseOfAgreement1.data);
            console.log(`responseOfAgreement2`, responseOfAgreement2.data);

            const id1 = responseOfAgreement1.data.id;
            const id2 = responseOfAgreement2.data.id;

            
            try {
                const [finalizeResponse1, finalizeResponse2] = await Promise.all([
                    axiosInstance.post(`/v1/loans/agreement/finalize`, { id: id1 }),
                    axiosInstance.post(`/v1/loans/agreement/finalize`, { id: id2 })
                ]);

                console.log(`Finalized Agreement 1:`, finalizeResponse1.data);
                console.log(`Finalized Agreement 2:`, finalizeResponse2.data);

                if (finalizeResponse1.data && finalizeResponse1.data.id) {
                    console.log(`Finalize ID:`, finalizeResponse1.data.id);
                } else {
                    console.log(`No ID found in finalize response`);
                }


                if (finalizeResponse2.data && finalizeResponse2.data.id) {
                    console.log(`Finalize ID:`, finalizeResponse2.data.id);
                } else {
                    console.log(`No ID found in finalize response`);
                }

            } catch (error) {
                console.error(`Error occurred while finalizing one of the agreements:`, error.response?.data);
                
                
                throw error;
            }

        } catch (error) {
            console.error(`Error occurred while calling agreement API:`, error.response?.data);
            throw error;
        }
    });

});
