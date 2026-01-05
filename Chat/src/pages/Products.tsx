import { useEffect, useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { useCartStore } from "@/stores/useCartStore";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export const Products = () => {
  const {
    products,
    categories,
    pagination,
    isLoading,
    fetchProducts,
    fetchCategories,
  } = useProductStore();
  const { addToCart, getCartItemsCount } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const filters: any = { page: currentPage, limit: 12 };
    if (selectedCategory) filters.category = selectedCategory;
    if (searchQuery) filters.search = searchQuery;
    fetchProducts(filters);
  }, [currentPage, selectedCategory, searchQuery, fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleAddToCart = async (productId: string) => {
    // Giả sử chọn size đầu tiên
    const product = products.find((p) => p._id === productId);
    if (product && product.sizes.length > 0) {
      await addToCart({
        productId,
        quantity: 1,
        size: product.sizes[0].size,
        color: product.colors[0],
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sản phẩm</h1>
        <Link to="/cart">
          <Button className="relative">
            <ShoppingCart className="mr-2" />
            Giỏ hàng
            {getCartItemsCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {getCartItemsCount()}
              </span>
            )}
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Tìm kiếm</Button>
        </form>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            onClick={() => {
              setSelectedCategory("");
              setCurrentPage(1);
            }}
          >
            Tất cả
          </Button>
          {categories.map((category) => (
            <Button
              key={category._id}
              variant={
                selectedCategory === category._id ? "default" : "outline"
              }
              onClick={() => {
                setSelectedCategory(category._id);
                setCurrentPage(1);
              }}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product._id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <span className="flex items-center px-4">
                Trang {currentPage} / {pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(pagination.pages, p + 1))
                }
                disabled={currentPage === pagination.pages}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
