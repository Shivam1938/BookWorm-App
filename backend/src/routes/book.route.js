import { Router } from "express";
import {createBook, getUserBooks, deleteBook} from "../controllers/book.controller.js"
import  protectRoute from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").post(protectRoute, createBook)
router.route("/user").get(protectRoute, getUserBooks)
router.route("/:id").delete(protectRoute, deleteBook)

export default router;

