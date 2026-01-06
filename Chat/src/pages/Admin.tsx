import { useEffect, useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
import { userService } from "@/services/userService";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCards } from "@/components/admin/StatsCards";
import { TabNavigation } from "@/components/admin/TabNavigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category, Product } from "@/types/product";
import type { OrderStatus } from "@/types/order";
import { toast } from "sonner";
import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

type TabType = "products" | "categories" | "orders" | "customers";

export const AdminDashboard = () => {
  const { products, categories, fetchProducts, fetchCategories } =
    useProductStore();

  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPagination, setOrdersPagination] = useState<any>(null);
  const [ordersPage, setOrdersPage] = useState(1);
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | "">(
    ""
  );

  // Customers state
  const [customers, setCustomers] = useState<any[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersPagination, setCustomersPagination] = useState<any>(null);
  const [customersPage, setCustomersPage] = useState(1);

  // Stats state
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    sizes: [{ size: "S", stock: 0 }],
    colors: [""],
    images: [""],
    isFeatured: false,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    slug: "",
  });

  useEffect(() => {
    fetchProducts({ limit: 100 });
    fetchCategories();
    fetchStats();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "customers") {
      fetchCustomers();
    }
  }, [activeTab, ordersPage, orderStatusFilter, customersPage]);

  const fetchStats = async () => {
    try {
      const [ordersRes, customersRes] = await Promise.all([
        orderService.getAllOrders({ limit: 1 }),
        userService.getAllUsers({ limit: 1 }),
      ]);

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalOrders: ordersRes.pagination?.total || 0,
        totalCustomers: customersRes.pagination?.total || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const filters: any = { page: ordersPage, limit: 10 };
      if (orderStatusFilter) filters.status = orderStatusFilter;

      const response = await orderService.getAllOrders(filters);
      setOrders(response.orders);
      setOrdersPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Lỗi khi tải đơn hàng");
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setCustomersLoading(true);
    try {
      const response = await userService.getAllUsers({
        page: customersPage,
        limit: 20,
        role: "customer",
      });
      setCustomers(response.users);
      setCustomersPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Lỗi khi tải danh sách khách hàng");
    } finally {
      setCustomersLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: OrderStatus
  ) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      fetchOrders();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      await userService.updateUserStatus(userId, !currentStatus);
      toast.success(
        `${!currentStatus ? "Kích hoạt" : "Vô hiệu hóa"} tài khoản thành công`
      );
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    if (editingProduct) {
      setProductForm({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price.toString(),
        discountPrice: editingProduct.discountPrice?.toString() || "",
        category:
          typeof editingProduct.category === "string"
            ? editingProduct.category
            : editingProduct.category._id,
        sizes: editingProduct.sizes,
        colors: editingProduct.colors,
        images: editingProduct.images,
        isFeatured: editingProduct.isFeatured,
      });
      setShowProductForm(true);
    }
  }, [editingProduct]);

  useEffect(() => {
    if (editingCategory) {
      setCategoryForm({
        name: editingCategory.name,
        description: editingCategory.description || "",
        slug: editingCategory.slug,
      });
      setShowCategoryForm(true);
    }
  }, [editingCategory]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...productForm,
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice
          ? Number(productForm.discountPrice)
          : undefined,
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, data);
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await productService.createProduct(data);
        toast.success("Tạo sản phẩm thành công");
      }

      fetchProducts({ limit: 100 });
      fetchStats();
      setShowProductForm(false);
      setEditingProduct(null);
      resetProductForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await productService.updateCategory(editingCategory._id, categoryForm);
        toast.success("Cập nhật danh mục thành công");
      } else {
        await productService.createCategory(categoryForm);
        toast.success("Tạo danh mục thành công");
      }

      fetchCategories();
      fetchStats();
      setShowCategoryForm(false);
      setEditingCategory(null);
      resetCategoryForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await productService.deleteProduct(id);
      toast.success("Xóa sản phẩm thành công");
      fetchProducts({ limit: 100 });
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await productService.deleteCategory(id);
      toast.success("Xóa danh mục thành công");
      fetchCategories();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      category: "",
      sizes: [{ size: "S", stock: 0 }],
      colors: [""],
      images: [""],
      isFeatured: false,
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      description: "",
      slug: "",
    });
  };

  const addSize = () => {
    setProductForm({
      ...productForm,
      sizes: [...productForm.sizes, { size: "", stock: 0 }],
    });
  };

  const updateSize = (index: number, field: string, value: any) => {
    const newSizes = [...productForm.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setProductForm({ ...productForm, sizes: newSizes });
  };

  const removeSize = (index: number) => {
    setProductForm({
      ...productForm,
      sizes: productForm.sizes.filter((_, i) => i !== index),
    });
  };

  const addColor = () => {
    setProductForm({ ...productForm, colors: [...productForm.colors, ""] });
  };

  const updateColor = (index: number, value: string) => {
    const newColors = [...productForm.colors];
    newColors[index] = value;
    setProductForm({ ...productForm, colors: newColors });
  };

  const removeColor = (index: number) => {
    setProductForm({
      ...productForm,
      colors: productForm.colors.filter((_, i) => i !== index),
    });
  };

  const addImage = () => {
    setProductForm({ ...productForm, images: [...productForm.images, ""] });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...productForm.images];
    newImages[index] = value;
    setProductForm({ ...productForm, images: newImages });
  };

  const removeImage = (index: number) => {
    setProductForm({
      ...productForm,
      images: productForm.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <StatsCards
          stats={stats}
          onOrdersClick={() => setActiveTab("orders")}
          onCustomersClick={() => setActiveTab("customers")}
        />

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Categories Section */}
        {activeTab === "categories" && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Danh mục</h2>
              <Button
                onClick={() => {
                  setShowCategoryForm(!showCategoryForm);
                  setEditingCategory(null);
                  resetCategoryForm();
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm danh mục
              </Button>
            </div>

            {showCategoryForm && (
              <Card className="p-6 mb-4">
                <form onSubmit={handleCategorySubmit}>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="catName">Tên danh mục *</Label>
                      <Input
                        id="catName"
                        required
                        value={categoryForm.name}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="catSlug">Slug *</Label>
                      <Input
                        id="catSlug"
                        required
                        value={categoryForm.slug}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            slug: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="catDesc">Mô tả</Label>
                    <textarea
                      id="catDesc"
                      className="w-full border rounded-md p-2"
                      rows={3}
                      value={categoryForm.description}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingCategory ? "Cập nhật" : "Tạo mới"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCategoryForm(false);
                        setEditingCategory(null);
                        resetCategoryForm();
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category._id} className="p-4">
                  <h3 className="font-bold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Sản phẩm</h2>
              <Button
                onClick={() => {
                  setShowProductForm(!showProductForm);
                  setEditingProduct(null);
                  resetProductForm();
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm sản phẩm
              </Button>
            </div>

            {showProductForm && (
              <Card className="p-6 mb-4">
                <form onSubmit={handleProductSubmit}>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="name">Tên sản phẩm *</Label>
                      <Input
                        id="name"
                        required
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Danh mục *</Label>
                      <select
                        id="category"
                        required
                        className="w-full border rounded-md p-2"
                        value={productForm.category}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            category: e.target.value,
                          })
                        }
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="description">Mô tả *</Label>
                    <textarea
                      id="description"
                      required
                      className="w-full border rounded-md p-2"
                      rows={4}
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="price">Giá gốc *</Label>
                      <Input
                        id="price"
                        type="number"
                        required
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            price: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="discountPrice">Giá khuyến mãi</Label>
                      <Input
                        id="discountPrice"
                        type="number"
                        value={productForm.discountPrice}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            discountPrice: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Sizes *</Label>
                      <Button type="button" size="sm" onClick={addSize}>
                        <Plus className="w-4 h-4 mr-1" />
                        Thêm size
                      </Button>
                    </div>
                    {productForm.sizes.map((size, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="Size (S, M, L...)"
                          value={size.size}
                          onChange={(e) =>
                            updateSize(index, "size", e.target.value)
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Tồn kho"
                          value={size.stock}
                          onChange={(e) =>
                            updateSize(index, "stock", Number(e.target.value))
                          }
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeSize(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Colors */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Màu sắc</Label>
                      <Button type="button" size="sm" onClick={addColor}>
                        <Plus className="w-4 h-4 mr-1" />
                        Thêm màu
                      </Button>
                    </div>
                    {productForm.colors.map((color, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="Màu sắc"
                          value={color}
                          onChange={(e) => updateColor(index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeColor(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Images */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Ảnh (URL) *</Label>
                      <Button type="button" size="sm" onClick={addImage}>
                        <Plus className="w-4 h-4 mr-1" />
                        Thêm ảnh
                      </Button>
                    </div>
                    {productForm.images.map((image, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="URL ảnh"
                          value={image}
                          onChange={(e) => updateImage(index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={productForm.isFeatured}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            isFeatured: e.target.checked,
                          })
                        }
                      />
                      <span>Sản phẩm nổi bật</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingProduct ? "Cập nhật" : "Tạo mới"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        resetProductForm();
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product._id} className="overflow-hidden">
                  <img
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </div>
                    <div className="font-semibold text-red-600 mb-3">
                      {(product.discountPrice || product.price).toLocaleString(
                        "vi-VN"
                      )}
                      ₫
                      {product.discountPrice && (
                        <span className="text-gray-400 text-sm line-through ml-2">
                          {product.price.toLocaleString("vi-VN")}₫
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Orders Section */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h2>

            {/* Status Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {[
                { value: "", label: "Tất cả" },
                { value: "pending", label: "Chờ xử lý" },
                { value: "confirmed", label: "Đã xác nhận" },
                { value: "shipping", label: "Đang giao" },
                { value: "delivered", label: "Đã giao" },
                { value: "cancelled", label: "Đã hủy" },
              ].map((status) => (
                <Button
                  key={status.value}
                  variant={
                    orderStatusFilter === status.value ? "default" : "outline"
                  }
                  onClick={() => {
                    setOrderStatusFilter(status.value as OrderStatus | "");
                    setOrdersPage(1);
                  }}
                >
                  {status.label}
                </Button>
              ))}
            </div>

            {ordersLoading ? (
              <div className="text-center py-12">Đang tải...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Không có đơn hàng nào</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {orders.map((order) => (
                    <Card key={order._id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="font-bold text-lg mb-1">
                            Đơn hàng #{order._id.slice(-8).toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-600">
                            Khách hàng: {order.user?.displayName || "N/A"}
                          </div>
                          <div className="text-sm text-gray-600">
                            Ngày đặt:{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "shipping"
                              ? "bg-purple-100 text-purple-800"
                              : order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status === "pending"
                            ? "Chờ xử lý"
                            : order.status === "confirmed"
                            ? "Đã xác nhận"
                            : order.status === "shipping"
                            ? "Đang giao"
                            : order.status === "delivered"
                            ? "Đã giao"
                            : "Đã hủy"}
                        </span>
                      </div>

                      <div className="border-t pt-4 mb-4">
                        <div className="text-sm font-medium mb-2">
                          Sản phẩm:
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item: any) => (
                            <div
                              key={item._id}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.product?.name || "N/A"} x{item.quantity} (
                                {item.size})
                              </span>
                              <span className="font-medium">
                                {item.price.toLocaleString("vi-VN")}₫
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4 mb-4">
                        <div className="text-sm font-medium mb-2">
                          Địa chỉ giao hàng:
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.shippingAddress.fullName} -{" "}
                          {order.shippingAddress.phone}
                          <br />
                          {order.shippingAddress.address},{" "}
                          {order.shippingAddress.district},{" "}
                          {order.shippingAddress.city}
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t pt-4">
                        <div>
                          <span className="text-sm text-gray-600">
                            Tổng cộng:{" "}
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            {order.totalAmount.toLocaleString("vi-VN")}₫
                          </span>
                        </div>

                        {order.status !== "cancelled" &&
                          order.status !== "delivered" && (
                            <div className="flex gap-2">
                              {order.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateOrderStatus(
                                      order._id,
                                      "confirmed"
                                    )
                                  }
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Xác nhận
                                </Button>
                              )}
                              {order.status === "confirmed" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateOrderStatus(
                                      order._id,
                                      "shipping"
                                    )
                                  }
                                >
                                  Đang giao
                                </Button>
                              )}
                              {order.status === "shipping" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateOrderStatus(
                                      order._id,
                                      "delivered"
                                    )
                                  }
                                >
                                  Đã giao
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleUpdateOrderStatus(
                                    order._id,
                                    "cancelled"
                                  )
                                }
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Hủy
                              </Button>
                            </div>
                          )}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {ordersPagination && ordersPagination.pages > 1 && (
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                      disabled={ordersPage === 1}
                    >
                      Trước
                    </Button>
                    <span className="flex items-center px-4">
                      Trang {ordersPage} / {ordersPagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setOrdersPage((p) =>
                          Math.min(ordersPagination.pages, p + 1)
                        )
                      }
                      disabled={ordersPage === ordersPagination.pages}
                    >
                      Sau
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Customers Section */}
        {activeTab === "customers" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Danh sách khách hàng</h2>

            {customersLoading ? (
              <div className="text-center py-12">Đang tải...</div>
            ) : customers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Không có khách hàng nào</p>
              </div>
            ) : (
              <>
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tên
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Username
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số điện thoại
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày đăng ký
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {customers.map((customer) => (
                          <tr key={customer._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-medium">
                                    {customer.displayName
                                      ?.charAt(0)
                                      .toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {customer.displayName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {customer.username}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {customer.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {customer.phone || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  customer.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {customer.isActive ? "Hoạt động" : "Khóa"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(customer.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Button
                                size="sm"
                                variant={
                                  customer.isActive ? "destructive" : "default"
                                }
                                onClick={() =>
                                  handleToggleUserStatus(
                                    customer._id,
                                    customer.isActive
                                  )
                                }
                              >
                                {customer.isActive ? "Khóa" : "Mở khóa"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Pagination */}
                {customersPagination && customersPagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCustomersPage((p) => Math.max(1, p - 1))
                      }
                      disabled={customersPage === 1}
                    >
                      Trước
                    </Button>
                    <span className="flex items-center px-4">
                      Trang {customersPage} / {customersPagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCustomersPage((p) =>
                          Math.min(customersPagination.pages, p + 1)
                        )
                      }
                      disabled={customersPage === customersPagination.pages}
                    >
                      Sau
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
