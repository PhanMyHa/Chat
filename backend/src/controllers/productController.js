import Product from "../models/Product.js";
import Category from "../models/Category.js";

// Lấy danh sách sản phẩm với phân trang và lọc
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sort = "-createdAt",
      isFeatured,
    } = req.query;

    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (isFeatured === "true") {
      query.isFeatured = true;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lấy chi tiết sản phẩm
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      "category",
      "name slug"
    );

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Tạo sản phẩm mới (Admin)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      sizes,
      colors,
      images,
      isFeatured,
    } = req.body;

    // Kiểm tra category có tồn tại không
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      category,
      sizes,
      colors,
      images,
      isFeatured,
    });

    await product.save();

    return res.status(201).json({
      message: "Tạo sản phẩm thành công",
      product,
    });
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Cập nhật sản phẩm (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      sizes,
      colors,
      images,
      isActive,
      isFeatured,
    } = req.body;

    // Kiểm tra category nếu có thay đổi
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        discountPrice,
        category,
        sizes,
        colors,
        images,
        isActive,
        isFeatured,
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      product,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Xóa sản phẩm (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    return res.status(200).json({
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lấy danh sách sản phẩm cho admin (bao gồm cả inactive)
export const getProductsAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      isActive,
      sort = "-createdAt",
    } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm admin:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
