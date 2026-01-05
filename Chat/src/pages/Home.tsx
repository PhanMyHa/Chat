import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "@/stores/useProductStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User, LogOut as LogOutIcon } from "lucide-react";

const Home = () => {
  const { products, fetchProducts } = useProductStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProducts({ isFeatured: true, limit: 8 });
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              ShopQuanAo
            </Link>

            <nav className="flex items-center gap-4">
              <Link to="/products">
                <Button variant="ghost">Sản phẩm</Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost">
                  <ShoppingBag className="mr-2 w-4 h-4" />
                  Giỏ hàng
                </Button>
              </Link>
              <Link to="/orders">
                <Button variant="ghost">Đơn hàng</Button>
              </Link>

              {user && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    <User className="inline w-4 h-4 mr-1" />
                    {user.displayName}
                  </span>
                  <Button variant="ghost" size="sm" >
                    <LogOutIcon className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Chào mừng đến ShopQuanAo</h1>
          <p className="text-xl mb-8">
            Khám phá bộ sưu tập thời trang mới nhất
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Link to="/products">Mua sắm ngay</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Sản phẩm nổi bật</h2>
          <Button asChild variant="outline">
            <Link to="/products">Xem tất cả →</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Miễn phí vận chuyển</h3>
              <p className="text-gray-600">Cho đơn hàng trên 500.000đ</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Đảm bảo chất lượng</h3>
              <p className="text-gray-600">100% sản phẩm chính hãng</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Đổi trả dễ dàng</h3>
              <p className="text-gray-600">Trong vòng 7 ngày</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 ShopQuanAo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
