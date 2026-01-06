export const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập tài nguyên này" });
    }

    next();
  } catch (error) {
    console.error("Lỗi khi kiểm tra quyền admin:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const requireCustomer = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    if (!req.user.isActive) {
      return res
        .status(403)
        .json({ message: "Tài khoản của bạn đã bị vô hiệu hóa" });
    }

    next();
  } catch (error) {
    console.error("Lỗi khi kiểm tra customer:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
