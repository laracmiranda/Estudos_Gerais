import express from "express";
import { ProductController } from "../controllers/ProductController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

const productController = new ProductController();

// Product Routes
router.get("/", productController.findAllProducts);
router.post("/produtos", upload.single("image"), productController.saveProduct);

export { router }

