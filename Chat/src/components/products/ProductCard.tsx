import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button"; // Đảm bảo đường dẫn đúng
import { ShoppingBag, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;

  // Tính % giảm giá để hiển thị Badge
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100
      )
    : 0;

  return (
    <div className="group relative flex flex-col gap-3">
      {/* 1. Image Section */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 rounded-sm">
        <Link to={`/products/${product._id}`} className="block w-full h-full">
          {/* Ảnh chính */}
          <img
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />

          {/* Nếu có ảnh thứ 2, hiện ra khi hover (Optional feature) */}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Badges - Sale / New */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {hasDiscount && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
              -{discountPercent}%
            </span>
          )}
          {/* Ví dụ logic hiển thị "New" */}
          {product.totalSold < 10 && (
            <span className="bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
              New
            </span>
          )}
        </div>

        {/* Action Button - Slide Up Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
          <Button
            onClick={(e) => {
              e.preventDefault(); // Tránh click nhầm vào Link ảnh
              onAddToCart?.();
            }}
            className="w-full bg-white text-black hover:bg-black hover:text-white border border-transparent hover:border-black shadow-lg transition-all duration-300 rounded-none h-11 uppercase font-bold text-xs tracking-widest flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm nhanh
          </Button>
        </div>
      </div>

      {/* 2. Info Section */}
      <div className="flex flex-col gap-1">
        <Link to={`/products/${product._id}`} className="group/title">
          <h3 className="font-medium text-sm text-zinc-900 leading-snug uppercase tracking-wide group-hover/title:underline underline-offset-4 decoration-zinc-400 decoration-1 truncate">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-black">
              {displayPrice.toLocaleString("vi-VN")}₫
            </span>
            {hasDiscount && (
              <span className="text-xs text-zinc-400 line-through decoration-zinc-400">
                {product.price.toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>
          {/* Sold count - Minimalist */}
          <span className="text-[10px] text-zinc-400 font-medium">
            {product.totalSold} sold
          </span>
        </div>
      </div>
    </div>
  );
};
