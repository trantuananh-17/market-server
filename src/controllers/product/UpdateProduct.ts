import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import { UploadApiResponse } from "cloudinary";
import ProductModel from "src/models/product";
import { isValidObjectId } from "mongoose";
import cloudUploader from "src/cloud";

const upLoadImage = (filePath: string): Promise<UploadApiResponse> => {
  return cloudUploader.upload(filePath, {
    width: 1280,
    height: 720,
    crop: "fill",
  });
};

export const updateProduct: RequestHandler = async (req, res) => {
  const { name, price, category, description, purchasingDate, thumbnail } =
    req.body;
  const productId = req.params.id;

  if (!isValidObjectId(productId))
    return sendErrorRes(res, "Invalid product id!", 422);

  const product = await ProductModel.findOneAndUpdate(
    {
      _id: productId,
      owner: req.user.id,
    },
    { name, price, category, description, purchasingDate, thumbnail }
  );

  if (!product) return sendErrorRes(res, "Product not found!", 404);

  if (typeof thumbnail === "string") product.thumbnail = thumbnail;

  const oldImages = product.images?.length || 0;
  if (oldImages >= 5) {
    return sendErrorRes(res, "Product already has 5 images", 422);
  }

  const { images } = req.files;
  const isMultipleImages = Array.isArray(images);

  if (isMultipleImages) {
    if (oldImages + images.length > 5)
      return sendErrorRes(res, "Images files can not be more than 5!", 422);
  }

  let invalidFileType = false;

  if (isMultipleImages) {
    for (let img of images) {
      if (!img.mimetype?.startsWith("image")) {
        invalidFileType = true;
        break;
      }
    }
  } else {
    if (images) {
      if (!images.mimetype?.startsWith("image")) {
        invalidFileType = true;
      }
    }
  }

  if (invalidFileType)
    return sendErrorRes(
      res,
      "Invalid file type, file must be image type!",
      422
    );

  // FILE UPLOAD
  if (isMultipleImages) {
    const uploadPromise = images.map((file) => upLoadImage(file.filepath));
    const uploadResult = await Promise.all(uploadPromise);

    const newImages = (product.images = uploadResult.map(
      ({ secure_url, public_id }) => {
        return { url: secure_url, id: public_id };
      }
    ));

    if (product.images) product.images.push(...newImages);
    else product.images = newImages;
  } else {
    if (images) {
      const { secure_url, public_id } = await upLoadImage(images.filepath);

      if (product.images)
        product.images.push({ url: secure_url, id: public_id });
      else product.images = [{ url: secure_url, id: public_id }];
    }
  }

  await product.save();
  res.status(201).json({ message: "Product updated successfully!" });
};
