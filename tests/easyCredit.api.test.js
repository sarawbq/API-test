require("dotenv").config();
const axios = require("axios");

const baseUrl = process.env.WALLPAY_TEST_BASEURL;
const wallexBaseUrl = process.env.WALLEX_BASEURL;
const bearerToken = process.env.WALLPAY_BEARER_TOKEN;

describe("easyCredit API tests", () => {
  test("pre agreement API test / with toBePayedAmount", async () => {
    const toBePayedAssetAmountBody = "1000000";
    const responseOfPreAgreement = await axios.post(
      `${baseUrl}/v1/loans/pre-agreement`,
      {
        loanConfigID: 36,
        toBePayedAssetAmount: toBePayedAssetAmountBody,
      },
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      },
    );
    console.log(responseOfPreAgreement.data);
    const collateralAsset =
      responseOfPreAgreement.data.loanConfig.collateralAsset.symbol;

    const collateralPrecision =
      responseOfPreAgreement.data.loanConfig.collateralAsset.precision;

    const ResponseOfOtcPrice = await axios.get(
      `${wallexBaseUrl}/v1/otc/price?symbol=${collateralAsset}TMN&side=BUY`,
    );

    const collateralPrice = ResponseOfOtcPrice.data.result.price;
    console.log(collateralPrice);

    const toGetAmount = Number(responseOfPreAgreement.data.toGetAmount).toFixed(
      collateralPrecision,
    );

    const toBePayedAssetAmount =
      responseOfPreAgreement.data.toBePayedAssetAmount;

    const collateralAmount = Number(
      responseOfPreAgreement.data.collateralAmount,
    ).toFixed(collateralPrecision);

    expect(toBePayedAssetAmount).toBe(toBePayedAssetAmountBody);

    expect(toGetAmount).toBe(collateralAmount);

    expect(toGetAmount).toBe(
      Number(toBePayedAssetAmountBody / collateralPrice).toFixed(
        collateralPrecision,
      ),
    );
  });
});
