import { Router } from "express";
import { CreateProduct } from "src/controllers/product/CreateProduct";
import { DeleteProduct } from "src/controllers/product/DeleteProduct";
import { DeleteProductImage } from "src/controllers/product/DeleteProductImage";
import { GetProductDetail } from "src/controllers/product/GetProductDetail";
import { UpdateProduct } from "src/controllers/product/UpdateProduct";
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
  CreateProduct
);
productRouter.patch(
  "/:id",
  isAuth,
  fileParser,
  validate(newProductSchema),
  UpdateProduct
);
productRouter.delete("/:id", isAuth, DeleteProduct);
productRouter.delete("/image/:productId/:imageId", isAuth, DeleteProductImage);
productRouter.get("/:id", isAuth, GetProductDetail);

export default productRouter;
