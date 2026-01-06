import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
              WEAR <br /> THE <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-zinc-500">
                MOMENT.
              </span>
            </h1>
            <p className="text-xl text-zinc-500 max-w-md mb-8 font-light">
              Khám phá bộ sưu tập tối giản, tinh tế định hình phong cách cá nhân
              của bạn.
            </p>
            <div className="flex gap-4">
              <Button
                asChild
                size="lg"
                className="bg-black text-white hover:bg-zinc-800 rounded-none h-14 px-8 text-lg group"
              >
                <Link to="/products">
                  Mua sắm ngay
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block h-[600px] bg-zinc-100 rounded-sm overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
              alt="Hero Fashion"
              className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
