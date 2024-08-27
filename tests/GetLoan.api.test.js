require("dotenv").config();
const axios = require("axios");

const baseUrl = process.env.WALLPAY_TEST_BASEURL;
const bearerToken = process.env.WALLPAY_BEARER_TOKEN;

describe("GetLoan API tests", () => {
  describe("checking agreement of every returned package", () => {
    test("checking correctness of agreement response for available packages (none CnBs)", async () => {
      const responseOfPackages = await axios.get(
        `${baseUrl}/v1/loans/packages`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      );
      expect(responseOfPackages.status).toBe(200);

      const validPackages = responseOfPackages.data.data.filter(
        (item) => item.available === true && item.name !== "CnB",
      );

      if (validPackages.length == 0) {
        throw new Error(
          "No valid packages found to test. Ensure that at least one package is available and does not have the name CnB",
        );
      }

      for (let item of responseOfPackages.data.data) {
        if ((item.available == true) & (item.name != "CnB")) {
          const agreement = await axios.post(
            `${baseUrl}/v1/loans/agreement`,
            { loanAmount: item.amount, loanConfigID: item.loanConfigID },
            {
              headers: {
                Authorization: `Bearer ${bearerToken}`,
              },
            },
          );

          expect(agreement.status).toBe(201);

          const packageConfigId = item.loanConfigID;
          const packageCollateralPrecision = item.asset.precision;
          const packageAssetAmount = item.assetAmount;

          const collateralPrice =
            agreement.data.loanConfig.collateralAsset.value;
          const collateralPrecision =
            agreement.data.loanConfig.collateralAsset.precision;
          const ltv = agreement.data.loanConfig.ltv;
          const liquidationLtv = agreement.data.loanConfig.liquidationLtv;
          const warningLtv = agreement.data.loanConfig.warningLtv;
          const karma = agreement.data.loanConfig.karmaRate;
          const ltvThreshold = "0.9";
          const liquidationLtvThreshold = "0.95";
          const warningLtvThreshold = "0.92";
          const validLtv = agreement.data.loanConfig.validLtv;
          const validLiquidationLtv =
            agreement.data.loanConfig.validLiquidationLtv;
          const validWarningLtv = agreement.data.loanConfig.validWarningLtv;
          const repaymentAmount = agreement.data.repaymentAmount;
          const loanAmount = agreement.data.loanAmount;
          const collateralAmount = agreement.data.collateralAmount;
          const liquidationAmount = agreement.data.liquidationAmount;
          const minAmount = agreement.data.loanConfig.minAmount;
          const maxAmount = agreement.data.loanConfig.maxAmount;

          toFixedPackageAssetAmount = Number(packageAssetAmount).toFixed(
            packageCollateralPrecision,
          );
          //toDo: removeTrailingZeros
          expect(collateralAmount).toBe(toFixedPackageAssetAmount);
          //   expect(+collateralAmount).toBeCloseTo(+toFixedPackageAssetAmount);

          expect(loanAmount).toBe(item.amount);
          expect(collateralAmount).toBe(
            (repaymentAmount / validLtv / collateralPrice).toFixed(
              collateralPrecision,
            ),
          );

          //   const loanAmountNum = Number(loanAmount);
          //   const minAmountNum = Number(minAmount);
          //   const maxAmountNum = Number(maxAmount);

          expect(+loanAmountNum).toBeGreaterThanOrEqual(+minAmountNum);
          expect(+loanAmountNum).toBeLessThanOrEqual(+maxAmountNum);

          let newLtv = karma * ltv;
          if (newLtv > ltvThreshold) {
            newLtv = ltvThreshold;
          }
          newLtv = newLtv.toString();

          let newLiquidationLtv = karma * liquidationLtv;
          if (newLiquidationLtv > liquidationLtvThreshold) {
            newLiquidationLtv = liquidationLtvThreshold;
          }
          newLiquidationLtv = newLiquidationLtv.toString();

          let newWarningLtv = karma * warningLtv;
          if (newWarningLtv > warningLtvThreshold) {
            newWarningLtv = warningLtvThreshold;
          }
          newWarningLtv = newWarningLtv.toString();
          expect(validLtv).toBe(newLtv);
          expect(validLiquidationLtv).toBe(newLiquidationLtv);
          expect(validWarningLtv).toBe(newWarningLtv);

          expect(liquidationAmount).toBe(
            (repaymentAmount / validLiquidationLtv).toFixed(0),
          );
        }
      }
    });
  });
});
