import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

interface FeaturedProductsProps {
  products: Product[];
}

export const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 70, damping: 20 },
    },
  };

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-70 pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-125 bg-pink-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white/50 backdrop-blur-sm text-xs font-bold tracking-widest text-zinc-500 uppercase mb-4"
          >
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            Best Sellers
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight"
          >
            Sản phẩm{" "}
            <span className="font-serif italic font-light text-pink-500">
              nổi bật
            </span>
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 200 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-linear-to-r from-transparent via-pink-400 to-transparent mt-3 rounded-full"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10"
        >
          {products.map((product) => (
            <motion.div key={product._id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 flex justify-center">
          <Link to="/products">
            <ButtonCustom />
          </Link>
        </div>
      </div>
    </section>
  );
};

const ButtonCustom = () => {
  return (
    <div className="group relative cursor-pointer">
      <div className="absolute -inset-1 rounded-full bg-linear-to-r from-pink-400 to-orange-300 opacity-70 blur transition group-hover:opacity-100 duration-500" />
      <div className="relative flex items-center gap-2 px-8 py-4 bg-white rounded-full leading-none text-zinc-900 font-bold tracking-wide border border-zinc-100 shadow-sm transition-transform duration-200 active:scale-95">
        <Sparkles className="w-4 h-4 text-pink-500" />
        XEM TẤT CẢ SẢN PHẨM
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
