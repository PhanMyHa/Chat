import Category from "../models/Category.js";

// Lấy tất cả danh mục
export const getCategories = async (req, res) => {
  try {
    const { isActive } = req.query;
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const categories = await Category.find(query).sort("name");

    return res.status(200).json({ categories });
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lấy chi tiết danh mục
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    return res.status(200).json({ category });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết danh mục:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Tạo danh mục mới (Admin)
export const createCategory = async (req, res) => {
  try {
    const { name, description, slug } = req.body;

    const category = new Category({
      name,
      description,
      slug,
    });

    await category.save();

    return res.status(201).json({
      message: "Tạo danh mục thành công",
      category,
    });
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Tên hoặc slug đã tồn tại" });
    }
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Cập nhật danh mục (Admin)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, slug, isActive } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, slug, isActive },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    return res.status(200).json({
      message: "Cập nhật danh mục thành công",
      category,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Tên hoặc slug đã tồn tại" });
    }
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Xóa danh mục (Admin)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    return res.status(200).json({
      message: "Xóa danh mục thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
