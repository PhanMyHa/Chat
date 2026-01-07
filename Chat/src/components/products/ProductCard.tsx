import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100
      )
    : 0;

  return (
    <div
      className="group relative flex flex-col gap-1 w-full max-w-60 mx-auto" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-zinc-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:shadow-pink-100/50">
        <Link
          to={`/products/${product._id}`}
          className="block w-full h-full cursor-pointer"
        >
          <img
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-bold shadow-sm min-w-[24px]">
              -{discountPercent}%
            </span>
          )}
          {product.totalSold < 10 && (
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm text-zinc-800 text-[9px] font-bold shadow-sm border border-white/50">
              NEW
            </span>
          )}
        </div>

        <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-md text-zinc-400 hover:text-rose-500 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100">
          <Heart className="w-3.5 h-3.5" />
        </button>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2 left-2 right-2"
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart?.();
                }}
                size="sm"
                className="w-full bg-white/95 backdrop-blur-md hover:bg-zinc-900 hover:text-white text-zinc-900 border border-white/50 shadow-sm rounded-lg h-8 text-[10px] font-bold uppercase tracking-wide transition-all"
              >
                <ShoppingBag className="w-3 h-3 mr-1.5" />
                Thêm
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-0.5 px-0.5">
        <div className="flex items-center gap-1">
          <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
          <span className="text-[9px] text-zinc-400 font-medium pt-0.5">
            4.9
          </span>
        </div>

        <Link to={`/products/${product._id}`} className="block">
          <h3 className="font-medium text-sm text-zinc-700 leading-tight transition-colors hover:text-rose-500 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-bold text-base text-zinc-900 font-serif">
            {displayPrice.toLocaleString("vi-VN")}
            <span className="text-xs align-top">₫</span>
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-zinc-400 line-through">
              {product.price.toLocaleString("vi-VN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
