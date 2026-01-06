import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Tạo đơn hàng
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod, note } = req.body;

    // Lấy giỏ hàng
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    // Kiểm tra và tính tổng tiền
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product || !product.isActive) {
        return res.status(400).json({
          message: `Sản phẩm ${item.product.name} không còn khả dụng`,
        });
      }

      // Kiểm tra tồn kho
      const sizeInfo = product.sizes.find((s) => s.size === item.size);
      if (!sizeInfo || sizeInfo.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${product.name} size ${item.size} không đủ số lượng`,
        });
      }

      const price = product.discountPrice || product.price;
      totalAmount += price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: price,
      });

      // Trừ tồn kho
      sizeInfo.stock -= item.quantity;
      product.totalSold += item.quantity;
      await product.save();
    }

    // Tạo đơn hàng
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      note,
    });

    await order.save();

    // Xóa giỏ hàng
    cart.items = [];
    await cart.save();

    await order.populate("items.product", "name images");

    return res.status(201).json({
      message: "Đặt hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lấy danh sách đơn hàng của user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: userId };

    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("items.product", "name images")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    return res.status(200).json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(id)
      .populate("items.product", "name images price discountPrice")
      .populate("user", "displayName email phone");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra quyền truy cập
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xem đơn hàng này" });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Hủy đơn hàng
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (order.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền hủy đơn hàng này" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Chỉ có thể hủy đơn hàng đang chờ xử lý" });
    }

    order.status = "cancelled";
    await order.save();

    // Hoàn lại tồn kho
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        const sizeInfo = product.sizes.find((s) => s.size === item.size);
        if (sizeInfo) {
          sizeInfo.stock += item.quantity;
          product.totalSold -= item.quantity;
          await product.save();
        }
      }
    }

    return res.status(200).json({
      message: "Hủy đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Lỗi khi hủy đơn hàng:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lấy tất cả đơn hàng (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "displayName email phone")
        .populate("items.product", "name images")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    return res.status(200).json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng (admin):", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (status) {
      order.status = status;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    return res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
