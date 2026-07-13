import express from "express";

import {create, getAll, getOne, update, remove} from "../controllers/postController.js"
import authenticate from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { createPostSchema } from "../validators/postValidator.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:slug", getOne);
router.post("/", authenticate, validate(createPostSchema), create);
router.put("/:slug", authenticate, validate(createPostSchema), update)
router.delete("/:slug", authenticate, remove)

export default router;