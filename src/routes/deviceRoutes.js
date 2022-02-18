import { Router } from "express";
import { validateAPIKey } from "../middleware/authorize";
import deviceController from "../controllers/deviceController";
const router = Router()

router.get('/health-check', (req, res) => res.send('Healthy OK!'));
router.post('/postData', validateAPIKey, deviceController.postData);


export default router