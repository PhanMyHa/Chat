import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";

dotenv.config();

const categories = [
  {
    name: "Áo thun",
    slug: "ao-thun",
    description: "Áo thun nam nữ chất lượng cao",
    isActive: true,
  },
  {
    name: "Áo sơ mi",
    slug: "ao-so-mi",
    description: "Áo sơ mi công sở, dạo phố",
    isActive: true,
  },
  {
    name: "Quần jean",
    slug: "quan-jean",
    description: "Quần jean nam nữ thời trang",
    isActive: true,
  },
  {
    name: "Quần kaki",
    slug: "quan-kaki",
    description: "Quần kaki lịch sự, thoải mái",
    isActive: true,
  },
  {
    name: "Áo khoác",
    slug: "ao-khoac",
    description: "Áo khoác mùa đông ấm áp",
    isActive: true,
  },
  {
    name: "Váy đầm",
    slug: "vay-dam",
    description: "Váy đầm nữ duyên dáng",
    isActive: true,
  },
];

const createProducts = (categoryId, categoryName) => {
  const products = [];

  if (categoryName === "Áo thun") {
    products.push(
      {
        name: "Áo thun basic trắng",
        description:
          "Áo thun cotton 100% cao cấp, form chuẩn, thoáng mát. Chất liệu mềm mại, thấm hút mồ hôi tốt. Phù hợp mặc hàng ngày.",
        price: 150000,
        discountPrice: 120000,
        category: categoryId,
        sizes: [
          { size: "S", stock: 20 },
          { size: "M", stock: 30 },
          { size: "L", stock: 25 },
          { size: "XL", stock: 15 },
        ],
        colors: ["Trắng", "Đen", "Xám"],
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
        ],
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Áo thun polo nam",
        description:
          "Áo thun polo phối màu trẻ trung, năng động. Thiết kế cổ bẻ lịch sự, phù hợp đi làm và dạo phố.",
        price: 250000,
        discountPrice: 200000,
        category: categoryId,
        sizes: [
          { size: "M", stock: 25 },
          { size: "L", stock: 30 },
          { size: "XL", stock: 20 },
        ],
        colors: ["Xanh navy", "Đỏ", "Đen"],
        images: [
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500",
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
        ],
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Áo thun oversize streetwear",
        description:
          "Áo thun oversize phong cách streetwear hiện đại. Form rộng thoải mái, in hình độc đáo.",
        price: 180000,
        category: categoryId,
        sizes: [
          { size: "M", stock: 15 },
          { size: "L", stock: 20 },
          { size: "XL", stock: 15 },
        ],
        colors: ["Đen", "Trắng", "Be"],
        images: [
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500",
          "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=500",
        ],
        isActive: true,
        isFeatured: false,
      }
    );
  }

  if (categoryName === "Áo sơ mi") {
    products.push(
      {
        name: "Áo sơ mi công sở trắng",
        description:
          "Áo sơ mi nam trắng công sở cao cấp. Chất vải mềm mại, không nhăn. Thiết kế lịch sự, chuyên nghiệp.",
        price: 350000,
        discountPrice: 280000,
        category: categoryId,
        sizes: [
          { size: "M", stock: 20 },
          { size: "L", stock: 25 },
          { size: "XL", stock: 15 },
        ],
        colors: ["Trắng", "Xanh nhạt", "Hồng nhạt"],
        images: [
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
          "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500",
        ],
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Áo sơ mi kẻ sọc casual",
        description:
          "Áo sơ mi kẻ sọc phong cách casual. Dễ phối đồ, phù hợp đi chơi và đi làm.",
        price: 320000,
        category: categoryId,
        sizes: [
          { size: "M", stock: 18 },
          { size: "L", stock: 22 },
          { size: "XL", stock: 12 },
        ],
        colors: ["Xanh kẻ", "Đỏ kẻ", "Xám kẻ"],
        images: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
          "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500",
        ],
        isActive: true,
        isFeatured: false,
      }
    );
  }

  if (categoryName === "Quần jean") {
    products.push(
      {
        name: "Quần jean slim fit nam",
        description:
          "Quần jean nam form slim fit ôm vừa phải. Chất vải jean cao cấp, bền đẹp. Màu xanh đậm truyền thống.",
        price: 450000,
        discountPrice: 380000,
        category: categoryId,
        sizes: [
          { size: "29", stock: 15 },
          { size: "30", stock: 20 },
          { size: "31", stock: 18 },
          { size: "32", stock: 15 },
        ],
        colors: ["Xanh đậm", "Xanh nhạt", "Đen"],
        images: [
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500",
        ],
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Quần jean nữ skinny",
        description:
          "Quần jean nữ skinnyôm dáng, tôn lên đường cong. Co giãn tốt, thoải mái vận động.",
        price: 420000,
        discountPrice: 350000,
        category: categoryId,
        sizes: [
          { size: "26", stock: 18 },
          { size: "27", stock: 22 },
          { size: "28", stock: 20 },
          { size: "29", stock: 15 },
        ],
        colors: ["Xanh nhạt", "Đen", "Xanh rách"],
        images: [
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
          "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500",
        ],
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Quần jean baggy unisex",
        description:
          "Quần jean baggy form rộng phong cách unisex. Thoải mái, cá tính, thích hợp cho cả nam và nữ.",
        price: 480000,
        category: categoryId,
        sizes: [
          { size: "28", stock: 12 },
          { size: "29", stock: 15 },
          { size: "30", stock: 18 },
          { size: "31", stock: 15 },
        ],
        colors: ["Xanh đậm", "Đen", "Xám"],
        images: [
          "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500",
          "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500",
        ],
        isActive: true,
        isFeatured: false,
      }
    );
  }

  if (categoryName === "Quần kaki") {
    products.push(
      {
        name: "Quần kaki công sở nam",
        description:
          "Quần kaki nam công sở form chuẩn. Chất vải kaki mềm mại, không nhăn. Phù hợp đi làm văn phòng.",
        price: 380000,
        discountPrice: 320000,
        category: categoryId,
        sizes: [
          { size: "29", stock: 15 },
          { size: "30", stock: 20 },
          { size: "31", stock: 18 },
          { size: "32", stock: 12 },
        ],
        colors: ["Be", "Xám", "Đen"],
        images: [
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500",
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
        ],
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Quần kaki jogger",
        description:
          "Quần kaki jogger thể thao, năng động. Bo gấu hiện đại, thoải mái vận động.",
        price: 350000,
        category: categoryId,
        sizes: [
          { size: "M", stock: 18 },
          { size: "L", stock: 22 },
          { size: "XL", stock: 15 },
        ],
        colors: ["Đen", "Rêu", "Xám"],
        images: [
          "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500",
          "https://images.unsplash.com/photo-1555274175-6cbf6f3b137b?w=500",
        ],
        isActive: true,
        isFeatured: false,
      }
    );
  }

  if (categoryName === "Áo khoác") {
    products.push(
      {
        name: "Áo khoác hoodie basic",
        description:
          "Áo khoác hoodie nỉ ngoại basic. Chất nỉ ngoại dày dặn, ấm áp. Có mũ trùm đầu tiện dụng.",
        price: 450000,
        discountPrice: 380000,
        category: categoryId,
        sizes: [
          { size: "M", stock: 20 },
          { size: "L", stock: 25 },
          { size: "XL", stock: 18 },
        ],
        colors: ["Đen", "Xám", "Xanh navy"],
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
          "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500",
        ],
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Áo khoác bomber jacket",
        description:
          "Áo khoác bomber jacket phong cách thể thao. Thiết kế trẻ trung, năng động.",
        price: 550000,
        discountPrice: 480000,
        category: categoryId,
        sizes: [
          { size: "M", stock: 15 },
          { size: "L", stock: 20 },
          { size: "XL", stock: 15 },
        ],
        colors: ["Đen", "Rêu", "Xanh đậm"],
        images: [
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
        ],
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Áo khoác dù chống nước",
        description:
          "Áo khoác dù chống nước, chống gió. Nhẹ, gọn, dễ gấp. Thích hợp đi du lịch.",
        price: 380000,
        category: categoryId,
        sizes: [
          { size: "M", stock: 18 },
          { size: "L", stock: 22 },
          { size: "XL", stock: 16 },
        ],
        colors: ["Đen", "Xanh navy", "Đỏ"],
        images: [
          "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500",
          "https://images.unsplash.com/photo-1591213246506-f47d21b27310?w=500",
        ],
        isActive: true,
        isFeatured: false,
      }
    );
  }

  if (categoryName === "Váy đầm") {
    products.push(
      {
        name: "Váy đầm hoa nhí nữ tính",
        description:
          "Váy đầm hoa nhí duyên dáng, nữ tính. Chất vải mềm mại, thoáng mát. Phù hợp dạo phố, đi chơi.",
        price: 320000,
        discountPrice: 280000,
        category: categoryId,
        sizes: [
          { size: "S", stock: 20 },
          { size: "M", stock: 25 },
          { size: "L", stock: 18 },
        ],
        colors: ["Hồng hoa", "Xanh hoa", "Trắng hoa"],
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
          "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500",
        ],
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Đầm công sở thanh lịch",
        description:
          "Đầm công sở form A thanh lịch, sang trọng. Thiết kế đơn giản nhưng tinh tế.",
        price: 450000,
        discountPrice: 390000,
        category: categoryId,
        sizes: [
          { size: "S", stock: 15 },
          { size: "M", stock: 20 },
          { size: "L", stock: 15 },
        ],
        colors: ["Đen", "Xanh navy", "Xám"],
        images: [
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
          "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500",
        ],
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Váy dài maxi dạo phố",
        description:
          "Váy dài maxi phong cách bohemian. Thoải mái, mát mẻ, thích hợp mùa hè.",
        price: 380000,
        category: categoryId,
        sizes: [
          { size: "S", stock: 12 },
          { size: "M", stock: 18 },
          { size: "L", stock: 15 },
        ],
        colors: ["Đỏ", "Xanh lá", "Cam"],
        images: [
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500",
        ],
        isActive: true,
        isFeatured: false,
      }
    );
  }

  return products;
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Xóa dữ liệu cũ
    console.log("Đang xóa dữ liệu cũ...");
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Tạo categories
    console.log("Đang tạo categories...");
    const createdCategories = await Category.insertMany(categories);
    console.log(`✓ Đã tạo ${createdCategories.length} categories`);

    // Tạo products cho mỗi category
    console.log("Đang tạo products...");
    let totalProducts = 0;
    for (const category of createdCategories) {
      const products = createProducts(category._id, category.name);
      if (products.length > 0) {
        await Product.insertMany(products);
        totalProducts += products.length;
        console.log(
          `✓ Đã tạo ${products.length} products cho ${category.name}`
        );
      }
    }
    console.log(`✓ Tổng cộng đã tạo ${totalProducts} products`);

    // Tạo admin user
    console.log("Đang tạo admin user...");
    const adminExists = await User.findOne({ email: "admin@shop.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      await User.create({
        username: "admin",
        email: "admin@shop.com",
        displayName: "Administrator",
        hashedPassword,
        role: "admin",
        isActive: true,
      });
      console.log("✓ Đã tạo admin user");
      console.log("  Email: admin@shop.com");
      console.log("  Password: Admin@123");
    } else {
      console.log("✓ Admin user đã tồn tại");
    }

    // Tạo customer user
    console.log("Đang tạo customer user...");
    const customerExists = await User.findOne({ email: "customer@shop.com" });
    if (!customerExists) {
      const hashedPassword = await bcrypt.hash("Customer@123", 10);
      await User.create({
        username: "customer",
        email: "customer@shop.com",
        displayName: "Khách hàng test",
        hashedPassword,
        role: "customer",
        isActive: true,
      });
      console.log("✓ Đã tạo customer user");
      console.log("  Email: customer@shop.com");
      console.log("  Password: Customer@123");
    } else {
      console.log("✓ Customer user đã tồn tại");
    }

    console.log("\n🎉 Seed database thành công!");
    console.log("\nThông tin đăng nhập:");
    console.log("Admin:");
    console.log("  - Email: admin@shop.com");
    console.log("  - Password: Admin@123");
    console.log("\nCustomer:");
    console.log("  - Email: customer@shop.com");
    console.log("  - Password: Customer@123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed database:", error);
    process.exit(1);
  }
};

seedDatabase();
