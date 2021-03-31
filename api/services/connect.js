const mongoose = require("mongoose");
const db = require("../config/db");

class dbConnect {
  //Function to connect MongoDB
  connect() {
    mongoose
      .connect(
        db.dbURL,
        { useUnifiedTopology: true, useNewUrlParser: true },
        () => {
          console.log("MongoDB connected successfully");
        }
      )
      .catch((Err) => {
        console.log(Err);
      });
  }
}

module.exports = dbConnect;
