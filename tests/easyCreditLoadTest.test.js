require("dotenv").config();
const axios= require ("axios");

const baseURL = process.env.WALLPAY_TEST_BASEURL;
const bearerToken = process.env.WALLPAY_BEARER_TOKEN;

const publicAxios = axios.create( {
    baseURL,
    headers: {'Authorization': `Bearer ${bearerToken}`},
    timeout: 9000
});

const axiosInstance = axios.create({
    baseURL,
    timeout:9000
})

describe( 'Easy Credit Load Test', () =>{

    test('parallel requests - public APIs', async()=>{
        const requestCount = 20;
        
        const publicEndpoints= [
            '/v1/loans/assets/price?baseSymbol=XAUT&quoteSymbol=TMN',
            '/v1/loans/total',
            '/v1/loans/configs/campaign/easy-credit'
        ];

        const sendRequests = async (endpoint) => {
            for (let i=0; i< requestCount; i++){
                // console.log(`request to ${endpoint} #${i+1}`);
                // const now = new Date()
                // .then(response=>{
                // const successNow = new Date()
                // })
                publicAxios.get(endpoint)
                .catch(error => {
                    console.error(`request to ${endpoint} #${i+1} failed:`,error.message);
                });
            }
        };
        try {
            
            const requests = publicEndpoints.map(endpoint => sendRequests(endpoint));
            await Promise.all(requests);

            console.log("All requests have been sent.");

        } catch (error) {
            console.error("An error occurred during the request process:", error.message);

        }





    });



});

