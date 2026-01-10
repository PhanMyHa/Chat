import User from "../models/User.js";

export const authUser = async (req, res) => {
  try {
    const user = req.user; //middleware
    return res.status(200).json({ user });
  } catch (error) {
    console.error("loi khi goi authUser", error);
    return res.status(500).json({ message: "loi he thong" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const filter = {};

    if (role) {
      filter.role = role;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select("-hashedPassword")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return res.status(200).json({
      users,
      pagination: {
        total,
        pages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("loi khi goi getAllUsers", error);
    return res.status(500).json({ message: "loi he thong" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-hashedPassword");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("loi khi goi getUserById", error);
    return res.status(500).json({ message: "loi he thong" });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive phải là boolean" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select("-hashedPassword");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    return res
      .status(200)
      .json({ user, message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    console.error("loi khi goi updateUserStatus", error);
    return res.status(500).json({ message: "loi he thong" });
  }
};
