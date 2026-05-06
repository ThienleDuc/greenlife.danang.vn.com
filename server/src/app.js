const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const keHoachRoutes = require("./routes/kehoach.routes");
const locationRoutes = require("./routes/location.routes");
const danhmucRoutes = require("./routes/danhmuc.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", keHoachRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api", danhmucRoutes);

module.exports = app;