const ejs = require("ejs");
const path = require("path");
const fuelService = require("../services/fuelService");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  try {
    const data = await fuelService.getFuelPrices();
    
    // Render EJS template
    const html = await ejs.renderFile(
      path.join(process.cwd(), "views/fuel.ejs"),
      { data }
    );
    
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};
