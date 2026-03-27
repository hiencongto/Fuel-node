const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 600 }); // 10 phút

class FuelService {
  async getFuelPrices() {
    const cached = cache.get("fuel_prices");
    if (cached) return cached;

    const data = await this.crawl();
    cache.set("fuel_prices", data);

    return data;
  }

  async crawl() {
    const url = "https://webgia.com/gia-xang-dau/petrolimex/";

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      timeout: 10000,
    });

    const html = response.data;

    const $ = cheerio.load(html);

    const data = [];

    $("table.table-radius tbody tr").each((i, el) => {
      const name = $(el).find("th").text().trim();
      const tds = $(el).find("td");

      if (!name || tds.length < 2) return;

      let v1 = $(tds[0]).text().trim();
      let v2 = $(tds[1]).text().trim();

      // convert số
      v1 = parseInt(v1.replace(/\./g, ""));
      v2 = parseInt(v2.replace(/\./g, ""));

      data.push({
        name,
        vung_1: v1,
        vung_2: v2,
      });
    });

    return data;
  }
}

module.exports = new FuelService();