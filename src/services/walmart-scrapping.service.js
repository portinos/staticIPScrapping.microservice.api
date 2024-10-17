const cheerio = require("cheerio");
const { fetchWithTimeout } = require("../helpers/fetch-with-timeout");

class WalmartScrapping {
  constructor(products = {}) {
    this.products = products;
  }

  async scrappingProducts() {
    const result = { data: {}, errors: {}, result: {} };

    const promises = Object.keys(this.products).map(async (key) => {
      const prod = this.products[key];
      const prodResult = await this.scrappingProduct(prod.link_direct);
      if (prodResult.error)
        result.errors[key] = {
          hatch_id: prod.hatch_id,
          errors: prodResult.errors,
        };
      else {
        result.data[key] = {
          hatch_id: prod.hatch_id,
          ...prodResult,
        };
        result.result[key] = {
          ...prod,
          name_on_retailer: prodResult?.nameOnRetailer,
          price: prodResult?.price,
          stock_info: prodResult?.stock ? "true" : "false",
          images: prodResult?.images,
          image: prodResult?.images?.[0],
        };
      }
    });
    await Promise.all(promises);

    return result;
  }

  async scrappingProductsPriceStock() {
    const result = { data: {}, errors: {}, result: {} };

    const promises = Object.keys(this.products).map(async (key) => {
      const prod = this.products[key];
      const prodResult = await this.scrappingProductPriceStock(
        prod.link_direct
      );
      if (prodResult.error)
        result.errors[key] = {
          hatch_id: prod.hatch_id,
          errors: prodResult.errors,
        };
      else {
        result.data[key] = {
          hatch_id: prod.hatch_id,
          ...prodResult,
        };
        result.result[key] = {
          ...prod,
          price: prodResult?.price,
          stock_info: prodResult?.stock ? "true" : "false",
        };
      }
    });
    await Promise.all(promises);

    return result;
  }

  async scrappingProduct(productLink) {
    try {
      const result = {
        notFound: false,
        error: false,
        errors: [],
        nameOnRetailer: "",
        stock: null,
      };

      const response = await fetchWithTimeout(productLink, {
        headers: {
          "Content-Type": "application/html",
          Accept: "application/html",
          "User-Agent": "wmtintel11429",
        },
      });
      const html = await response.text();
      const $ = cheerio.load(html);

      if ((response.status < 400) & (response.status > 299))
        result.notFound = true;

      if (!result.notFound) {
        // Get title
        result.nameOnRetailer = await this.scrappingProductTitle($);

        // Get price
        result.price = await this.scrappingPrice($);

        // Get stock
        result.stock = await this.scrappingStock($);

        // Get images
        result.images = await this.scrappingImagesLink($);
      } else result.stock = false;

      // Check errors
      if (result.nameOnRetailer === "" || !result.nameOnRetailer) {
        result.error = true;
        result.errors.push({
          message: "Name on retailer not found",
        });
      } else if (
        result.nameOnRetailer.includes("Robot or human?") ||
        result.nameOnRetailer.includes("Access Denied")
      ) {
        result.error = true;
        result.errors.push({
          message: "Bot detected",
        });

        return result;
      }
      if (result.price === null) {
        result.error = true;
        result.errors.push({
          message: "Price not found",
        });
      }
      if (result.stock === null) {
        result.error = true;
        result.errors.push({
          message: "Stock not found",
        });
      }
      if (result.images.length === 0) {
        result.error = true;
        result.errors.push({
          message: "Images not found",
        });
      }

      return result;
    } catch (err) {
      console.log(err);
      return {
        notFound: false,
        error: true,
        errors: [
          {
            message: "Puppeteer error",
          },
        ],
        nameOnRetailer: "",
        stock: false,
      };
    }
  }

  async scrappingProductPriceStock(productLink) {
    try {
      const result = {
        notFound: false,
        error: false,
        errors: [],
        nameOnRetailer: "",
        stock: null,
      };

      const response = await fetchWithTimeout(productLink, {
        headers: {
          "Content-Type": "application/html",
          Accept: "application/html",
          "User-Agent": "wmtintel11429",
        },
      });
      const html = await response.text();
      const $ = cheerio.load(html);

      if ((response.status < 400) & (response.status > 299))
        result.notFound = true;

      if (!result.notFound) {
        // Get title to check bot
        result.nameOnRetailer = await this.scrappingProductTitle($);

        // Get price
        result.price = await this.scrappingPrice($);

        // Get stock
        result.stock = await this.scrappingStock($);
      } else result.stock = false;

      // Check errors
      if (
        result.nameOnRetailer.includes("Robot or human?") ||
        result.nameOnRetailer.includes("Access Denied")
      ) {
        result.error = true;
        result.errors.push({
          message: "Bot detected",
        });

        return result;
      }
      if (result.price === null) {
        result.error = true;
        result.errors.push({
          message: "Price not found",
        });
      }
      if (result.stock === null) {
        result.error = true;
        result.errors.push({
          message: "Stock not found",
        });
      }

      return result;
    } catch (err) {
      console.log(err);
      return {
        notFound: false,
        error: true,
        errors: [
          {
            message: "Puppeteer error",
          },
        ],
        nameOnRetailer: "",
        stock: false,
      };
    }
  }

  async scrappingProductTitle(page) {
    try {
      return page("h1").text();
    } catch (err) {
      return "";
    }
  }

  async scrappingImagesLink(page) {
    try {
      // Open gallery
      const images = page('div[data-testid="vertical-carousel-container"] img');

      // Check repeated images
      const imagesNotRepeated = [];
      images.each((_, img) => {
        const src = $(img).attr("src");
        if (!imagesNotRepeated.includes(src)) imagesNotRepeated.push(img);
      });
      return imagesNotRepeated;
    } catch (err) {
      return [];
    }
  }

  async scrappingPrice(page) {
    try {
      const price = page(`span[itemprop="price"]`)
        .text()
        .replace(/[^0-9.]/g, "")
        .toString();

      if (price === "") throw new Error("No price");
      return price;
    } catch (err) {
      return null;
    }
  }

  async scrappingStock(page) {
    try {
      const button = await page('div[data-automation-id="atc"]').text();
      return !!button;
    } catch (err) {
      return null;
    }
  }
}

module.exports = { WalmartScrapping };
