import categories from "src/utils/category";
import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import ProductModel from "src/models/product";

export const getListings: RequestHandler = async (req, res) => {
  const { pageNum = `process.env.PAGENUM`, limit = `process.env.PAGELIMIT` } =
    req.query as {
      pageNum: string;
      limit: string;
    };

  const products = await ProductModel.find({ owner: req.user.id })
    .sort("-createdAt")
    .skip((+pageNum - 1) * +limit)
    .limit(+limit);

  const listing = products.map((product) => {
    return {
      id: product._id,
      name: product.name,
      thumbnail: product.thumbnail,
      category: product.category,
      price: product.price,
      image: product.images?.map((img) => img.url),
      date: product.purchasingDate,
      description: product.description,
      seller: {
        id: req.user.id,
        name: req.user.name,
        avatar: req.user.avatar,
      },
    };
  });

  res.json({ products: listing });
};
