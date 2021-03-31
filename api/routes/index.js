const route = require("./route");
const teamvesting = require("./teamVesting");
const cLiquidity = require("./cLiquidity");
const governance = require("./governance");
const history = require("./txHistory");
const reward = require("./rewards");

class Routes {
  constructor(app) {
    this.app = app;
  }
  configRoutes() {
    this.app.use("/", route);
    this.app.use("/cLiquidity", cLiquidity);
    this.app.use("/governance", governance);
    this.app.use("/teamvesting", teamvesting);
    this.app.use("/history", history);
    this.app.use("/rewards", reward);
  }
}

module.exports = Routes;
