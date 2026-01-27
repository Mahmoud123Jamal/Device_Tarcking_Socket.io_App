import express from "express";
import locationsRoute from "./routes/locationsRoute";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api", locationsRoute);
export default app;
