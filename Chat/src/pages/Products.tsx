import { useEffect, useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { useCartStore } from "@/stores/useCartStore";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

  // Logic giữ nguyên
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

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-black selection:text-white pt-24 pb-20">
      {/* Header Section */}
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-zinc-100">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-2 text-zinc-500 text-sm font-medium uppercase tracking-wider"
            >
              <Link to="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-black">Collection</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tighter uppercase"
            >
              All Products
            </motion.h1>
          </div>

          <Link to="/cart">
            <Button
              variant="outline"
              className="relative h-12 px-6 border-zinc-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-none group"
            >
              <ShoppingBag className="mr-2 w-4 h-4" />
              <span className="uppercase tracking-wide font-bold text-xs">
                Giỏ hàng của bạn
              </span>
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white group-hover:bg-white group-hover:text-black w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-full transition-colors border-2 border-white">
                  {getCartItemsCount()}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Controls Section (Search & Filter) */}
      <div className="container mx-auto px-6 mb-12 sticky top-20 z-30 bg-white/90 backdrop-blur-sm py-4 -mx-6 md:mx-auto md:px-6">
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
          {/* Categories - Horizontal Scroll */}
          <div className="w-full lg:w-2/3 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedCategory("");
                  setCurrentPage(1);
                }}
                className={`rounded-full px-6 transition-all duration-300 border ${
                  selectedCategory === ""
                    ? "bg-black text-white border-black"
                    : "bg-transparent text-zinc-500 border-zinc-200 hover:border-black hover:text-black"
                }`}
              >
                Tất cả
              </Button>
              {categories.map((category) => (
                <Button
                  key={category._id}
                  variant="ghost"
                  onClick={() => {
                    setSelectedCategory(category._id);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full px-6 transition-all duration-300 border ${
                    selectedCategory === category._id
                      ? "bg-black text-white border-black"
                      : "bg-transparent text-zinc-500 border-zinc-200 hover:border-black hover:text-black"
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Bar - Minimalist Underline */}
          <form
            onSubmit={handleSearch}
            className="w-full lg:w-1/3 relative group"
          >
            <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="TÌM KIẾM SẢN PHẨM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-colors placeholder:text-zinc-300 text-sm font-medium uppercase tracking-wide"
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-black rounded-full animate-spin"></div>
            <p className="text-zinc-400 text-sm animate-pulse">
              LOADING COLLECTION...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Key changes to force re-render animation when page/category changes */}
            <motion.div
              key={currentPage + selectedCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 mb-16"
            >
              {products.length > 0 ? (
                products.map((product) => (
                  <motion.div key={product._id} variants={cardVariants}>
                    <ProductCard
                      product={product}
                      onAddToCart={() => handleAddToCart(product._id)}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center border border-dashed border-zinc-200 rounded-sm">
                  <p className="text-zinc-500">Không tìm thấy sản phẩm nào.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination - Minimalist */}
        {!isLoading && pagination && pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-8 border-t border-zinc-100">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-zinc-200 hover:border-black hover:bg-black hover:text-white transition-all disabled:opacity-30"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2 px-4">
              <span className="font-bold text-lg">{currentPage}</span>
              <span className="text-zinc-300 text-lg">/</span>
              <span className="text-zinc-500 text-lg">{pagination.pages}</span>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-zinc-200 hover:border-black hover:bg-black hover:text-white transition-all disabled:opacity-30"
              onClick={() =>
                setCurrentPage((p) => Math.min(pagination.pages, p + 1))
              }
              disabled={currentPage === pagination.pages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
