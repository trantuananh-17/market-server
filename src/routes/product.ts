import { Router } from "express";
import { createProduct } from "src/controllers/product/createProduct";
import { deleteProduct } from "src/controllers/product/deleteProduct";
import { deleteProductImage } from "src/controllers/product/deleteProductImage";
import { getLatestProducts } from "src/controllers/product/getLatestProducts";
import { getListings } from "src/controllers/product/getListings";
import { getProductDetail } from "src/controllers/product/getProductDetail";
import { getProductsByCategory } from "src/controllers/product/getProductsByCategory";
import { updateProduct } from "src/controllers/product/updateProduct";
import fileParser from "src/middleware/fileParser";
import { isAuth } from "src/middleware/isAuth";
import validate from "src/middleware/validator";
import { newProductSchema } from "src/utils/validationSchema";

const productRouter = Router();

productRouter.post(
  "/create",
  isAuth,
  fileParser,
  validate(newProductSchema),
  createProduct
);
productRouter.patch(
  "/:id",
  isAuth,
  fileParser,
  validate(newProductSchema),
  updateProduct
);
productRouter.delete("/:id", isAuth, deleteProduct);
productRouter.delete("/image/:productId/:imageId", isAuth, deleteProductImage);
productRouter.get("/detail/:id", isAuth, getProductDetail);
productRouter.get("/by-category/:category", getProductsByCategory);
productRouter.get("/latest", getLatestProducts);
productRouter.get("/listings", isAuth, getListings);

export default productRouter;
