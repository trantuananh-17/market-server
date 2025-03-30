import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import ProductModel from "src/models/product";
import "dotenv/config";

export const getLatestProducts: RequestHandler = async (req, res) => {
  const { pageNum = `process.env.PAGENUM`, limit = `process.env.PAGELIMIT` } =
    req.query as {
      pageNum: string;
      limit: string;
    };

  const products = await ProductModel.find()
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
    };
  });

  res.json({ products: listing });
};
