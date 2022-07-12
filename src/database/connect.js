import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import log from "../logger";

export default function connect() {
  const uri = process.env.MONGO_URI;

  return mongoose
    .connect(uri, {})
    .then(() => {
      log.info("Database connected");
    })
    .catch((error) => {
      log.error(`Mongo connection error ${error.message}`);
      process.exit(1);
    });
}
