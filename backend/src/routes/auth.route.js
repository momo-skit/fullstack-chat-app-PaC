import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup); // ("/the route", callback fn )
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile); // router.METHOD(PATH, [MIDDLEWARE1, MIDDLEWARE2, ..., CALLBACK]); router.METHOD(PATH, [CALLBACK1, CALLBACK2, ...]); ==> but (req,res,next), chain with next() in two cases

router.get("/check", protectRoute, checkAuth) // we call this when ever we refresh application-- which link to useAuthSTore in front end

export default router;  //export as router similar to the message.route
