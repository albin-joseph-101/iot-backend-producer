import express from "express";
import dotEnv from "dotenv";
import path from "path";
import cors from "cors";
import errorResponse from "./utils/errorResponse";
import { HTTP_ERROR_CODE } from "./utils/constants";
dotEnv.config({ path: path.join(__dirname, "../.env") });
import routes from "./routes/index";
import "./database/connection";
import "./cache/redisClient";

const PORT = process.env.PORT;
const Errors = {
  default: {
    type: HTTP_ERROR_CODE.NOT_FOUND,
    message: "Not Found",
    details: "Please contact the system administrator",
  },
};

const app = express();
app.use(express.json({ limit: "50mb" }));

app.use(cors());

app.use("/", routes);

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Battery Smart IoT API" });
});

app.use("*", (req, res) => errorResponse(Errors.default, res));

app.listen(PORT, () => console.log("Express server is running on port", PORT));
