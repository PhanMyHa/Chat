import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { createVNPayUrl, verifyVNPaySignature } from "../libs/vnpay.js";

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

// Tạo đơn hàng với VNPay
export const createOrderWithVNPay = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, note } = req.body;

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      "127.0.0.1";

    if (ipAddr === "::1" || ipAddr === "::ffff:127.0.0.1") {
      ipAddr = "127.0.0.1";
    }

 
    if (ipAddr.includes(",")) {
      ipAddr = ipAddr.split(",")[0].trim();
    }

    if (ipAddr.startsWith("::ffff:")) {
      ipAddr = ipAddr.replace("::ffff:", "");
    }

    // Lấy giỏ hàng
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product || !product.isActive) {
        return res.status(400).json({
          message: `Sản phẩm ${item.product.name} không còn khả dụng`,
        });
      }

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
    }

  
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: "vnpay",
      paymentStatus: "pending",
      status: "pending",
      note,
    });

    await order.save();


    const orderInfo = `Thanh toan don hang ${order._id}`;

    console.log("Creating VNPay payment:", {
      orderId: order._id.toString(),
      amount: totalAmount,
      ipAddr: ipAddr,
      orderInfo: orderInfo,
    });

    const paymentUrl = createVNPayUrl(
      order._id.toString(),
      totalAmount,
      orderInfo,
      ipAddr
    );

    console.log("VNPay URL created:", paymentUrl);

    return res.status(200).json({
      message: "Tạo đơn hàng thành công",
      order,
      paymentUrl,
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng VNPay:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const vnpayReturn = async (req, res) => {
  try {
    let vnpParams = req.query;

    // Xác thực chữ ký
    const isValidSignature = verifyVNPaySignature(vnpParams);

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: "Chữ ký không hợp lệ",
      });
    }

    const orderId = vnpParams["vnp_TxnRef"];
    const responseCode = vnpParams["vnp_ResponseCode"];

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // 00: Giao dịch thành công
    if (responseCode === "00") {
      // Cập nhật trạng thái đơn hàng
      order.paymentStatus = "paid";
      order.status = "confirmed";
      await order.save();

      // Trừ tồn kho
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          const sizeInfo = product.sizes.find((s) => s.size === item.size);
          if (sizeInfo) {
            sizeInfo.stock -= item.quantity;
            product.totalSold += item.quantity;
            await product.save();
          }
        }
      }

      const cart = await Cart.findOne({ user: order.user });
      if (cart) {
        cart.items = [];
        await cart.save();
      }

      return res.status(200).json({
        success: true,
        message: "Thanh toán thành công",
        order,
      });
    } else {
      // Thanh toán thất bại, hủy đơn hàng
      order.status = "cancelled";
      order.paymentStatus = "pending";
      await order.save();

      return res.status(400).json({
        success: false,
        message: "Thanh toán thất bại",
        responseCode,
      });
    }
  } catch (error) {
    console.error("Lỗi khi xử lý callback VNPay:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
    });
  }
};


export const vnpayIPN = async (req, res) => {
  try {
    let vnpParams = req.query;
    const isValidSignature = verifyVNPaySignature(vnpParams);

    if (!isValidSignature) {
      return res
        .status(200)
        .json({ RspCode: "97", Message: "Invalid signature" });
    }

    const orderId = vnpParams["vnp_TxnRef"];
    const responseCode = vnpParams["vnp_ResponseCode"];

    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(200)
        .json({ RspCode: "01", Message: "Order not found" });
    }

    if (order.paymentStatus === "paid") {
      return res
        .status(200)
        .json({ RspCode: "02", Message: "Order already confirmed" });
    }

    if (responseCode === "00") {
      order.paymentStatus = "paid";
      order.status = "confirmed";
      await order.save();

      return res.status(200).json({ RspCode: "00", Message: "Success" });
    } else {
      order.status = "cancelled";
      await order.save();

      return res.status(200).json({ RspCode: "00", Message: "Success" });
    }
  } catch (error) {
    console.error("Lỗi khi xử lý IPN VNPay:", error);
    return res.status(200).json({ RspCode: "99", Message: "Unknown error" });
  }
};
