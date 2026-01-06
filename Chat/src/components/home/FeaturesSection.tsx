import { Truck, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          <motion.div
            whileHover={{ y: -5 }}
            className="text-center px-4 pt-8 md:pt-0"
          >
            <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 uppercase tracking-wide">
              Free Shipping
            </h3>
            <p className="text-zinc-400 text-sm">
              Miễn phí vận chuyển cho đơn hàng trên 500k
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="text-center px-4 pt-8 md:pt-0"
          >
            <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 uppercase tracking-wide">
              Chính hãng 100%
            </h3>
            <p className="text-zinc-400 text-sm">
              Cam kết chất lượng, bồi thường x2 nếu giả
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="text-center px-4 pt-8 md:pt-0"
          >
            <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 uppercase tracking-wide">
              Hỗ trợ 24/7
            </h3>
            <p className="text-zinc-400 text-sm">
              Đổi trả dễ dàng trong vòng 7 ngày
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
