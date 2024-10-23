// import http from 'k6/http';
// import { sleep, check } from 'k6';



// export const options = {

//     stages: [
//         { duration: '1s', target:50},
//         // { duration: '2m', target:200},
//         // { duration: '1m', target:0}
//     ]
// };



// export default function () {

//     const responses = http.batch([
//         ['GET', 'https://wallpay-api-dev2.staging.k8s.wallex.dev/v1/loans/total'],
//         ['GET', 'https://wallpay-api-dev2.staging.k8s.wallex.dev/v1/loans/configs/campaign/easy-credit']
//     ]);

//     // Check if both requests returned status 200
//     if (responses[0].status !== 200) {
//         console.error(`Error on loans/total at ${__VU} VUs with status: ${responses[0].status}`);
//     }
//     if (responses[1].status !== 200) {
//         console.error(`Error on loans/configs/campaign/easy-credit at ${__VU} VUs with status: ${responses[1].status}`);
//     }
// }
// // export default function () {
// //     const res = http.get('https://wallpay-api-dev2.staging.k8s.wallex.dev/v1/loans/total');
// //     // if (res.status !== 200) {
// //     //     console.error(`Request failed with status ${res.status}`);
// //     // }
// //     if (res.status !== 200 && !errorOccurred) {
// //         errorOccurred = true; 
// //         console.error(`Error occurred at ${__VU} VUs with status: ${res.status}`);
// //     }
   
// // }



// // export default () =>{
// //     http.get('https://wallpay-api-dev2.staging.k8s.wallex.dev/v1/loans/total');
    
// // }
