import express from "express";
import {
  createProfile,
  getProfile,
  getProfiles,
  updateProfile,
  deleteProfile,
} from "../controllers/profiles.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getProfiles).post(createProfile);

router
  .route("/:uid")
  .get(getProfile)
  .put(auth, updateProfile)
  .patch(auth, updateProfile)
  .delete(auth, deleteProfile);

export default router;
