import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Lấy giỏ hàng của user
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price discountPrice images sizes colors isActive",
    });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }

    return res.status(200).json({ cart });
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, size, color } = req.body;

    // Kiểm tra sản phẩm
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Kiểm tra size và stock
    const sizeInfo = product.sizes.find((s) => s.size === size);
    if (!sizeInfo) {
      return res.status(400).json({ message: "Size không hợp lệ" });
    }

    if (sizeInfo.stock < quantity) {
      return res.status(400).json({ message: "Không đủ hàng trong kho" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      // Cập nhật số lượng
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (sizeInfo.stock < newQuantity) {
        return res.status(400).json({ message: "Không đủ hàng trong kho" });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Thêm mới
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
      });
    }

    await cart.save();
    await cart.populate({
      path: "items.product",
      select: "name price discountPrice images sizes colors isActive",
    });

    return res.status(200).json({
      message: "Thêm vào giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    }

    // Kiểm tra stock
    const product = await Product.findById(item.product);
    const sizeInfo = product.sizes.find((s) => s.size === item.size);

    if (sizeInfo.stock < quantity) {
      return res.status(400).json({ message: "Không đủ hàng trong kho" });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate({
      path: "items.product",
      select: "name price discountPrice images sizes colors isActive",
    });

    return res.status(200).json({
      message: "Cập nhật giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();
    await cart.populate({
      path: "items.product",
      select: "name price discountPrice images sizes colors isActive",
    });

    return res.status(200).json({
      message: "Xóa sản phẩm khỏi giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      message: "Xóa giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
