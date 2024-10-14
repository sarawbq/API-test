import http from 'k6/http';
import { sleep } from 'k6';


export const options = {
    vus: 200, 
    duration: '1s',
};

export default function () {
    const res = http.get('https://wallpay-api-dev2.staging.k8s.wallex.dev/v1/loans/total');
    // if (res.status !== 200) {
    //     console.error(`Request failed with status ${res.status}`);
    // }
    if (res.status !== 200 && !errorOccurred) {
        errorOccurred = true; 
        console.error(`Error occurred at ${__VU} VUs with status: ${res.status}`);
    }
    // sleep(1);
}


// export default () =>{
//     http.get('https://wallpay-api-dev2.staging.k8s.wallex.dev/v1/loans/total');
    
// }
