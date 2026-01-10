import { useEffect, useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { useCartStore } from "@/stores/useCartStore";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { HomeHeader } from "@/components/home/HomeHeader"; 
import { HomeFooter } from "@/components/home/HomeFooter"; 
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LayoutGrid,
  ListFilter,
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
  const { addToCart } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const filters: any = { page: currentPage, limit: 12 }; // Limit 15 để lưới 5 cột đẹp hơn (3x5 hoặc 5x3)
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

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 font-sans selection:bg-rose-200 selection:text-rose-900">
      <HomeHeader />

      <div className="fixed inset-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] opacity-60 pointer-events-none z-0" />
      <div className="fixed top-20 right-0 w-125 h-125 bg-rose-100/40 rounded-full blur-[100px] pointer-events-none z-0" />

      <main className="relative z-10 pt-10 pb-20">
        <div className="container mx-auto px-6 mb-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm text-xs font-medium text-zinc-500"
            >
              <Link to="/" className="hover:text-rose-500 transition-colors">
                Home
              </Link>
              <span className="text-zinc-300">/</span>
              <span className="text-zinc-900">Collection</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900"
            >
              Explore{" "}
              <span className="font-serif italic font-light text-rose-500">
                Collection
              </span>
            </motion.h1>

            <p className="max-w-md text-zinc-500 text-sm md:text-base">
              Khám phá những thiết kế mới nhất, mang đậm phong cách cá nhân và
              sự tinh tế trong từng đường kim mũi chỉ.
            </p>
          </div>
        </div>

        <div className="sticky top-20 z-40 container mx-auto px-6 mb-10">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg shadow-zinc-200/50 rounded-2xl p-2 md:p-3 flex flex-col md:flex-row gap-4 justify-between items-center transition-all">
            <div className="w-full md:w-auto overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("");
                    setCurrentPage(1);
                  }}
                  className={`rounded-xl px-4 font-medium transition-all ${
                    selectedCategory === ""
                      ? "bg-zinc-900 text-white shadow-md hover:bg-zinc-800 hover:text-white"
                      : "bg-transparent text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Tất cả
                </Button>
                <div className="w-px h-6 bg-zinc-200 mx-1" />
                {categories.map((category) => (
                  <Button
                    key={category._id}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category._id);
                      setCurrentPage(1);
                    }}
                    className={`rounded-xl px-4 transition-all whitespace-nowrap ${
                      selectedCategory === category._id
                        ? "bg-rose-500 text-white shadow-md shadow-rose-200 hover:bg-rose-600 hover:text-white"
                        : "bg-transparent text-zinc-500 hover:bg-rose-50 hover:text-rose-600"
                    }`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSearch}
              className="relative w-full md:w-75 group"
            >
              <div
                className={`flex items-center px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                  isSearchFocused
                    ? "bg-white border-rose-500 ring-2 ring-rose-100 shadow-sm"
                    : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <Search
                  className={`w-4 h-4 mr-3 transition-colors ${
                    isSearchFocused ? "text-rose-500" : "text-zinc-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-400 text-zinc-800"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="container mx-auto px-6 min-h-100">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
                </div>
              </div>
              <p className="text-zinc-400 text-xs font-medium tracking-widest uppercase animate-pulse">
                Đang tải sản phẩm...
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage + selectedCategory + searchQuery} 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12"
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
                  <div className="col-span-full py-20 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
                      <ListFilter className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">
                      Không tìm thấy sản phẩm
                    </h3>
                    <p className="text-zinc-500 mt-2">
                      Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm nhé.
                    </p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSelectedCategory("");
                        setSearchQuery("");
                      }}
                      className="mt-4 text-rose-500 hover:text-rose-600"
                    >
                      Xóa bộ lọc
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {!isLoading && pagination && pagination.pages > 1 && (
            <div className="mt-20 flex justify-center">
              <div className="bg-white border border-zinc-200 shadow-sm rounded-full p-1.5 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-9 h-9 hover:bg-zinc-100 text-zinc-600 disabled:opacity-30"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="px-4 text-sm font-medium">
                  <span className="text-zinc-900">{currentPage}</span>
                  <span className="text-zinc-300 mx-2">/</span>
                  <span className="text-zinc-500">{pagination.pages}</span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-9 h-9 hover:bg-zinc-100 text-zinc-600 disabled:opacity-30"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={currentPage === pagination.pages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <HomeFooter />
    </div>
  );
};
