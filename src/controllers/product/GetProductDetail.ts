import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import ProductModel from "src/models/product";
import { isValidObjectId } from "mongoose";
import { UserDocument } from "src/models/user";

export const GetProductDetail: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendErrorRes(res, "Invalid product id", 422);

  const product = await ProductModel.findById(id).populate<{
    owner: UserDocument;
  }>("owner");

  if (!isValidObjectId(product))
    return sendErrorRes(res, "Product not found", 404);

  res.json({
    product: {
      id: product?._id,
      name: product?.name,
      description: product?.description,
      thumbnail: product?.thumbnail,
      category: product?.category,
      date: product?.purchasingDate,
      price: product?.price,
      images: product?.images?.map(({ url }) => url),
      seller: {
        id: product?.owner._id,
        name: product?.owner.name,
        avatar: product?.owner.avatar?.url,
      },
    },
  });
};
