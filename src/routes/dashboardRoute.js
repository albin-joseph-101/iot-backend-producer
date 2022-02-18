import { Router } from "express";
import dashboardController from '../controllers/dashboardController'
import { setRole, validateUser } from "../middleware/authorize";
const router = Router()

router.use((req, res, next) => {
    const role = {all: 'all'};
    setRole(req, res, next, role);
});

router.get('/getAllKeys', validateUser, dashboardController.getAllKeys)
router.get('/createKey', validateUser, dashboardController.createKey)
router.get('/errorData', validateUser, dashboardController.getErrorLogData)
router.get('/errorDeviceData', validateUser, dashboardController.getErrorDeviceData)
router.get('/deviceData', validateUser, dashboardController.getDeviceData)
router.get('/changeStatus', validateUser, dashboardController.toggleErrorStatus)

router.use((req, res, next) => {
    const role = { admin: 'admin' };
    setRole(req, res, next, role);
});

router.delete('/deleteKey', validateUser, dashboardController.deleteKey)
router.get('/getKey', validateUser, dashboardController.getKey)

export default router