import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import ProductModel from "src/models/product";
import { isValidObjectId } from "mongoose";
import cloudUploader, { cloudApi } from "src/config/cloud";

export const deleteProductImage: RequestHandler = async (req, res) => {
  const { productId, imageId } = req.params;

  if (!isValidObjectId(productId))
    return sendErrorRes(res, "Invalid product id!", 422);

  //MoongoDb pull operator
  const product = await ProductModel.findOneAndUpdate(
    { _id: productId, owner: req.user.id },
    {
      $pull: {
        images: { id: imageId },
      },
    },
    { new: true }
  );

  if (!product) return sendErrorRes(res, "Product not found!", 404);

  if (product.thumbnail?.includes(imageId)) {
    const images = product.images;

    if (images) product.thumbnail = images[0].url;
    else product.thumbnail = "";

    await product.save();
  }
  // Removing from cloudinary
  await cloudUploader.destroy(imageId);

  res.json({ message: "Image remove successfully!" });
};
