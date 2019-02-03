const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bodyParser = require("body-parser");

const log_session = require("./routes/log_session");
const sessions = require("./routes/sessions");

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("got it"));

const mlab = require("./config/keys").mongoURI;

mongoose
  .connect(
    mlab,
    { useNewUrlParser: true }
  )
  .then(() => console.log("connected"))
  .catch(err => console.log(err));

const db = mongoose.connection;

app.use("/api", log_session);
app.use("/api", sessions);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
