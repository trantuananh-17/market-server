import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import ProductModel from "src/models/product";
import { isValidObjectId } from "mongoose";
import { cloudApi } from "src/cloud";

export const DeleteProduct: RequestHandler = async (req, res) => {
  const productId = req.params.id;

  if (!isValidObjectId(productId))
    return sendErrorRes(res, "Invalid product id!", 422);

  const product = await ProductModel.findOneAndDelete({
    _id: productId,
    owner: req.user.id,
  });

  if (!product) return sendErrorRes(res, "Product not found!", 404);

  const images = product?.images || [];
  if (images.length) {
    const ids = images.map(({ id }) => id);
    await cloudApi.delete_resources(ids);
  }

  res.json({ message: "Product deleted successfully!" });
};
