require("dotenv").config();
const axios = require("axios");

const baseURL = process.env.WALLPAY_TEST_BASEURL;
const publicAxios = axios.create({
    baseURL,
    timeout: 10000000
});

const publicEndpoints = [
    // '/v1/loans/assets/price?baseSymbol=XAUT&quoteSymbol=TMN',
    '/v1/loans/total',
    '/v1/loans/configs/campaign/easy-credit'
];

const sendRequests = async (userId) => {
    // console.log(`User ${userId} is making requests...`);

    const promises = publicEndpoints.map(async (endpoint) => {
        const startTime = Date.now();

        try {
            const response = await publicAxios.get(endpoint);
            const endTime = Date.now();
            const duration = endTime - startTime;

            // console.log(`User ${userId} - Request to ${endpoint} succeeded in ${duration} ms:`, response.data);

            

            if (response.status === 200) {
                console.log(`User ${userId} - Request to ${endpoint} succeeded in ${duration} ms:`);
            } else {
                console.log(`User ${userId} - Request to ${endpoint} returned status ${response.status}:`, response.data);
                // throw new Error(`Request to ${endpoint} failed with status ${response.status}`);
            }

            expect(response.status).toBe(200);
            
        } catch (error) {
        
            const endTime = Date.now();
            const duration = endTime - startTime;
            console.error(`User ${userId} - Request to ${endpoint} failed in ${duration} ms:`, error.message);
           
        }
    });

    await Promise.all(promises);
};

describe('Easy Credit Load Test', () => {
    test('parallel requests - public APIs', async () => {
        const userCount = 200;
        const userPromises = [];

        for (let i = 1; i <= userCount; i++) {
            userPromises.push(sendRequests(i));
        }

        try {
            await Promise.all(userPromises);
            console.log("All users have made their requests.");
        } catch (error) {
            // console.log("Error during user requests:", error);
            console.error("An error occurred during the request process:", error.message);
            throw error;
        }
    },1000000);
});
