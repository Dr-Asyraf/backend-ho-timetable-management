import { Router } from "express";
import healthController from "../controllers/health.js";
import authController from "../controllers/auth.js";
import isAuth from "../middlewares/isAuth.js";
import roleCheck from "../middlewares/roleCheck.js";
import createTimetable from "../controllers/timetables/createTimetable.js";
import updateShift from "../controllers/timetables/updateShift.js";
import markAbsent from "../controllers/timetables/emergencyAbsent.js";
import confirmReplacement from "../controllers/timetables/confirmReplacement.js";
import getShifts from "../controllers/timetables/getShifts.js";
import deleteShift from "../controllers/timetables/deleteShift.js";
import getAllShifts from "../controllers/timetables/getAllShifts.js";

const router = Router();

router.get("/", healthController.getHealth);
router.post("/", healthController.postHealth);
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

//Timetable routes
router.post(
  "/leaderDashboard/generate",
  isAuth,
  roleCheck("Leader"),
  createTimetable
);
router.get("/timetables/week", isAuth, getShifts);
router.get("/ho-shifts/:username", isAuth, roleCheck("Leader"), getAllShifts);
router.put("/edit-shift/:shiftId", isAuth, roleCheck("Leader"), updateShift);
router.delete(
  "/delete-shift/:shiftId",
  isAuth,
  roleCheck("Leader"),
  deleteShift
);
router.post(
  "/leaderDashboard/emergency/absent",
  isAuth,
  roleCheck("Leader"),
  markAbsent
);
router.put(
  "/leaderDashboard/emergency/suggestions",
  isAuth,
  roleCheck("Leader"),
  confirmReplacement
);

export default router;
