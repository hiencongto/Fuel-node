const express = require("express");
const fuelService = require("./services/fuelService");

const app = express();

// dùng EJS
app.set("view engine", "ejs");

// API JSON (giống Laravel index)
app.get("/api/fuel", async (req, res) => {
  try {
    const data = await fuelService.getFuelPrices();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// View (giống blade)
app.get("/fuel", async (req, res) => {
  try {
    const data = await fuelService.getFuelPrices();
    res.render("fuel", { data });
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

app.listen(3000, () => {
  console.log("Server chạy tại http://localhost:3000");
});