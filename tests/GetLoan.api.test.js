require('dotenv').config();
const axios = require('axios');

const baseUrl=process.env.WALLPAY_TEST_BASEURL;
const bearerToken=process.env.WALLPAY_BEARER_TOKEN;

describe ('GetLoan API tests', () => {


    describe ('checking agreement of every returned package',()=>{

        test ('checking agreement of every returned package', async()=>{
       
            const responseOfPackages= await axios.get(`${baseUrl}/v1/loans/packages?loanProvider=digikala`,{
                headers:{
                    Authorization: `Bearer ${bearerToken}`
                }
            });
            expect(responseOfPackages.status).toBe(200);
            // console.log(responseOfPackages.data);
    
            for (let item of responseOfPackages.data.data){

                const agreement = await axios.post(`${baseUrl}/v1/loans/agreement`,
                    {loanAmount: item.amount , loanConfigID: item.loanConfigID},
                    {
                        headers:{
                            Authorization: `Bearer ${bearerToken}`
                        }}
                );

                console.log(agreement.data);
                expect(agreement.status).toBe(201);

                const collateralPrice=agreement.data.loanConfig.collateralAsset.value;
                const collateralPrecision=agreement.data.loanConfig.collateralAsset.precision;
                const ltv=agreement.data.loanConfig.ltv;
                const karma=agreement.data.loanConfig.karmaRate;
                const ltvThreshold= "0.9";
                const validLtv=agreement.data.loanConfig.validLtv;
                const repaymentAmount=agreement.data.repaymentAmount;
                const loanAmount=agreement.data.loanAmount;
                const collateralAmount=agreement.data.collateralAmount;
            
                
                expect(loanAmount).toBe(item.amount);
                expect(collateralAmount).toBe(((repaymentAmount/validLtv)/collateralPrice).toFixed(collateralPrecision));
                
                let newLtv=karma*ltv;
                if (newLtv > ltvThreshold){
                    newLtv= ltvThreshold;
                }
                newLtv= newLtv.toString();
                expect(validLtv).toBe(newLtv);
                
                
            }
    
    
        });
       
        
    });

 



});
