import http from 'k6/http';
import { sleep, check } from 'k6';


export const options = {
    stages: [
        { duration: '10s', target: 50 }, 
        
    ],
};


const config = {
    apis: [
        {
            url: 'https://wallpay-api-dev2.staging.k8s.wallex.dev/v1/loans/total',
            method: 'GET',
            expectedStatus: 200,
        },
        {
            url: 'https://wallpay-api-dev2.staging.k8s.wallex.dev/v1/loans/configs/campaign/easy-credit',
            method: 'GET',
            // headers: { 'Authorization': '' }, 
            expectedStatus: 200,
        },
        // {
        //     url: 'https://api.example.com/resource',
        //     method: 'POST',
        //     body: JSON.stringify({ key: 'value' }),
        //     headers: { 'Authorization': '' }, 
        //     expectedStatus: 201,
        // },
    ],
};


export default function () {
    const requests = config.apis.map(api => {
        if (api.method === 'POST') {
            return ['POST', api.url, api.body, { headers: api.headers }];

        } else if (api.method === 'GET') {
            return ['GET', api.url, null, { headers: api.headers || {} }];
    });

   
    const responses = http.batch(requests);

   
    responses.forEach((response, index) => {
        const api = config.apis[index]; 
        if (response.status !== api.expectedStatus) {
            console.error(`Error on ${api.url} at VU ${__VU} with status: ${response.status} (Expected: ${api.expectedStatus})`);
        } 
    });
}
