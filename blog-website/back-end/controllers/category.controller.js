//add
//show
//edit
//delete

import { errorBody } from "../helpers/errorBody.js";
import Category from "../models/category.model.js";

export const addCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;

    const existingCategory = await Category.find({ name: name });

    const category = new Category({ name, slug });
    await category.save();

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const editCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;

    const { categoryId } = req.params;
    const category = await Category.findByIdAndUpdate(
      categoryId,
      {
        name,
        slug,
      },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const showCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);

    if (!category) {
      next(errorBody(404, "Data Not Found"));
    }

    return res.status(200).json({
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findByIdAndDelete(categoryId);

    return res.status(201).json({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const showAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean().exec();

    return res.status(200).json({
      categories,
    });
  } catch (error) {}
};
