const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
console.log("SERVER FILE LOADED");
app.use((req, res, next) => {
  console.log(
    "REQUEST:",
    req.method,
    req.url
  );
  next();
});
app.use("/api/analyze", require("./routes/analyze"));

app.get("/", (req, res) => {
  res.send("Server Working");
});

app.listen(8000, () => {
  console.log("Server running on 8000");
});