import { Router } from "express";
import stationData from "../database/models/stationData";
import dashboardRoute from "./dashboardRoute";
import deviceRoute from "./deviceRoutes";
const router = Router();

router.use("/v1/api", deviceRoute);
router.use("/api", dashboardRoute);
router.post("/api/station/heartBeat", async (req, res) => {
  try {
    const resp = await stationData.create({
      endpoint: "heartBeat",
      body: req.body,
    });
    res.send({
      success: true,
      message: "Data sent Successfully",
      data: resp,
    });
  } catch (error) {
    console.log(error);
    res.send(JSON.stringify(error));
  }
});

router.post("/api/station/transaction", async (req, res) => {
    try {
      const resp = await stationData.create({
        endpoint: "transaction",
        body: req.body,
      });
      res.send({
        success: true,
        message: "Data sent Successfully",
        data: resp,
      });
    } catch (error) {
      console.log(error);
      res.send(JSON.stringify(error));
    }
  });

export default router;
