# Website Bán Quần Áo

Website thương mại điện tử bán quần áo hoàn chỉnh với đầy đủ chức năng CRUD, phân trang, phân quyền.

## Tính năng

### Backend (Node.js + Express + MongoDB)

#### Đã hoàn thành:

- ✅ Authentication (đăng ký, đăng nhập, đăng xuất)
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục (CRUD)
- ✅ Giỏ hàng
- ✅ Đơn hàng
- ✅ Phân quyền (Customer/Admin)
- ✅ Phân trang
- ✅ Tìm kiếm & Lọc sản phẩm

#### Models:

- **User**: Người dùng với role (customer/admin)
- **Product**: Sản phẩm với size, màu sắc, giá, tồn kho
- **Category**: Danh mục sản phẩm
- **Cart**: Giỏ hàng
- **Order**: Đơn hàng với trạng thái

#### API Endpoints:

**Authentication:**

- POST `/api/auth/signup` - Đăng ký
- POST `/api/auth/signin` - Đăng nhập
- POST `/api/auth/logout` - Đăng xuất

**Products (Public):**

- GET `/api/products` - Lấy danh sách sản phẩm (có phân trang, lọc)
- GET `/api/products/:id` - Chi tiết sản phẩm

**Products (Admin):**

- GET `/api/products/admin/all` - Lấy tất cả sản phẩm (bao gồm inactive)
- POST `/api/products` - Tạo sản phẩm mới
- PUT `/api/products/:id` - Cập nhật sản phẩm
- DELETE `/api/products/:id` - Xóa sản phẩm

**Categories:**

- GET `/api/categories` - Lấy danh sách danh mục
- GET `/api/categories/:id` - Chi tiết danh mục
- POST `/api/categories` - Tạo danh mục (Admin)
- PUT `/api/categories/:id` - Cập nhật danh mục (Admin)
- DELETE `/api/categories/:id` - Xóa danh mục (Admin)

**Cart:**

- GET `/api/cart` - Lấy giỏ hàng
- POST `/api/cart` - Thêm vào giỏ hàng
- PUT `/api/cart/:itemId` - Cập nhật số lượng
- DELETE `/api/cart/:itemId` - Xóa sản phẩm
- DELETE `/api/cart` - Xóa toàn bộ giỏ hàng

**Orders:**

- POST `/api/orders` - Tạo đơn hàng
- GET `/api/orders/my-orders` - Đơn hàng của user
- GET `/api/orders/:id` - Chi tiết đơn hàng
- PUT `/api/orders/:id/cancel` - Hủy đơn hàng
- GET `/api/orders/admin/all` - Tất cả đơn hàng (Admin)
- PUT `/api/orders/:id/status` - Cập nhật trạng thái (Admin)

### Frontend (React + TypeScript + Vite)

#### Pages:

- **Home**: Trang chủ với sản phẩm nổi bật
- **Products**: Danh sách sản phẩm với tìm kiếm, lọc, phân trang
- **ProductDetail**: Chi tiết sản phẩm
- **Cart**: Giỏ hàng
- **Checkout**: Thanh toán
- **Orders**: Quản lý đơn hàng
- **SignIn/SignUp**: Đăng nhập/Đăng ký

#### Stores (Zustand):

- **useAuthStore**: Quản lý authentication
- **useProductStore**: Quản lý sản phẩm
- **useCartStore**: Quản lý giỏ hàng

## Cài đặt

### Backend:

```bash
cd backend
npm install
```

Tạo file `.env`:

```
MONGODB_URI=mongodb://localhost:27017/shopquanao
PORT=5001
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_here
```

Chạy server:

```bash
npm run dev
```

### Frontend:

```bash
cd Chat
npm install lucide-react
npm run dev
```

## Cách sử dụng

### Tạo tài khoản Admin:

Sau khi đăng ký tài khoản, vào MongoDB và cập nhật field `role` của user thành `"admin"`:

```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } });
```

### Thêm dữ liệu mẫu:

#### Tạo Categories:

```javascript
POST /api/categories
{
  "name": "Áo thun",
  "slug": "ao-thun",
  "description": "Áo thun nam nữ"
}
```

#### Tạo Products:

```javascript
POST /api/products
{
  "name": "Áo thun basic",
  "description": "Áo thun cotton 100%",
  "price": 200000,
  "discountPrice": 150000,
  "category": "category_id",
  "sizes": [
    { "size": "S", "stock": 10 },
    { "size": "M", "stock": 15 },
    { "size": "L", "stock": 20 }
  ],
  "colors": ["Đen", "Trắng", "Xám"],
  "images": ["image_url_1", "image_url_2"],
  "isFeatured": true
}
```

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── controllers/     # Controllers xử lý logic
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middlewares/     # Middleware (auth, role)
│   └── libs/            # Database connection
│
Chat/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Pages
│   ├── services/        # API services
│   ├── stores/          # Zustand stores
│   └── types/           # TypeScript types
```

## Tính năng nổi bật

- ✅ **Phân quyền**: Admin có thể quản lý sản phẩm, danh mục, đơn hàng
- ✅ **Phân trang**: Tất cả danh sách đều có phân trang
- ✅ **Tìm kiếm**: Tìm kiếm full-text trên tên và mô tả sản phẩm
- ✅ **Lọc**: Lọc theo danh mục, giá, trạng thái
- ✅ **Giỏ hàng**: Thêm, sửa, xóa sản phẩm
- ✅ **Đơn hàng**: Tạo đơn, theo dõi trạng thái, hủy đơn
- ✅ **Responsive**: Giao diện responsive trên mọi thiết bị

## Todo (Có thể mở rộng)

- [ ] Upload ảnh sản phẩm (Cloudinary/AWS S3)
- [ ] Dashboard Admin
- [ ] Thống kê doanh thu
- [ ] Review & Rating sản phẩm
- [ ] Wishlist
- [ ] Email notifications
- [ ] Payment gateway integration (VNPay, MoMo)

## License

MIT
