require('dotenv').config();

const axios = require('axios');
const process= require('process');

const console= require('console');


const baseUrl=process.env.WALLPAY_TEST_BASEURL;
const bearerToken=process.env.WALLPAY_BEARER_TOKEN;

describe ('GetLoan API tests',()=>{

    test ('checking agreement of every returned package', async()=>{
        console.log(baseUrl);
        const responseOfPackages= await axios.get(`${baseUrl}v1/loans/packages?loanProvider=digikala`,{
            headers:{
                Accept: 'application/json',
                Authorization: `Bearer ${bearerToken}`
            }
        });
        expect(responseOfPackages.status).toBe(200);
        console.log(responseOfPackages.data);


    });
   



});
