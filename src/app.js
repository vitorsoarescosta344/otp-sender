import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import log from "./logger";

//routes
import send_otp_to_phone from "./routes/sendOTP_to_phone";
import send_otp_to_email from "./routes/sendOTP_to_email";
import verify_otp from "./routes/verifyOTP";

const app = express();

const port = process.env.PORT || 3030;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOption = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["x-auth-token"],
};

app.use(cors(corsOption));

app.use(helmet());

//using imported routes
app.use("/api/v1/", send_otp_to_phone);
app.use("/api/v1/", send_otp_to_email);
app.use("/api/v1/", verify_otp);

app.get("/", function (req, res) {
  log.info("route / is accessed");
  res.sendStatus(200);
});

app.listen(port, () => {
  log.info(`Server is running on port ${port}`);
});
