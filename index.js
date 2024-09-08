import express from "express";
import router from "./routes/routes.js";
import "./database/connection.js";
import cors from "cors";

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
const PORT = 8181;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

//routes
app.use(router);

app.listen(PORT, () => {
  const name = process.env.npm_package_name;
  const version = process.env.npm_package_version;
  const message = `${name} ${version} is running on port ${PORT}`;
  console.log(message);
});
