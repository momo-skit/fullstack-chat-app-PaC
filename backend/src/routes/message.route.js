import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages); // /:id allows you to handle dynamic values in the URL, making your routing more flexible and scalabl==The /:id part represents a route parameter in Express, which is a placeholder for a dynamic value in the URL path.


router.post("/send/:id", protectRoute, sendMessage)

export default router;// export as router simialart to the auth.route
