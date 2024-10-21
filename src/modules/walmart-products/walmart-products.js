const { WALMART_DATA } = require("../../../config/index");
const { fetchWithTimeout } = require("../../helpers/fetch-with-timeout.js");
const {
  WalmartScrapping,
} = require("../../services/walmart-scrapping.service.js");

const walmartProducts = async () => {
  try {
    const retailerData = {
      result: {},
      data: {},
      errors: {},
    };

    // Fetch data
    const response = await fetchWithTimeout(WALMART_DATA);
    const products = await response.json();

    if (response.status !== 200) throw new Error("Endpoint not found");

    // Make scrapping
    const walmartScrapper = new WalmartScrapping(products);
    const resultProds = await walmartScrapper.scrappingProducts();

    retailerData.data = resultProds.data;
    retailerData.errors = resultProds.errors;
    retailerData.result = resultProds.result;

    return {
      data: retailerData.result,
      errors: retailerData.errors,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = { walmartProducts };
