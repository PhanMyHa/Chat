import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import img1 from '../../assets/section1.jpg';
import img2 from "../../assets/section2.jpg";


export const HeroSection = () => {
  return (
    <section className="relative pt-10 pb-10  lg:pt-10 lg:pb-2 px-6 overflow-hidden bg-[#FAFAF9]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-125 h-125 bg-pink-200/40 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[0%] w-100 h-100 bg-orange-100/60 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-pink-100 shadow-sm mb-8 text-sm font-medium text-pink-500">
              <Sparkles className="w-4 h-4 fill-pink-500" />
              <span>New Collection 2026</span>
            </div>

            <h1 className="text-4xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
              Vẻ đẹp đến từ sự <br />
              <span className="font-serif italic font-light text-pink-500 text-6xl">
                ngọt ngào & tinh tế
              </span>
            </h1>

            <p className="text-lg text-gray-500 max-w-lg mb-10 leading-relaxed">
              Khám phá phiên bản rạng rỡ nhất của chính bạn với những thiết kế
              thanh lịch, nhẹ nhàng và đầy chất thơ.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gray-900 text-white hover:bg-pink-500 hover:text-white rounded-full h-14 px-8 text-base shadow-xl shadow-pink-200/50 transition-all duration-300"
              >
                <Link to="/products">
                  Mua sắm ngay
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full h-14 px-8 text-base border-gray-200 text-gray-600 hover:bg-white hover:text-pink-500 hover:border-pink-200"
              >
                <Link to="/about">Về chúng mình</Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 20}`}
                      alt="user"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
                <span>Được yêu thích bởi 1000+ cô gái</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-135 border border-pink-400 rounded-full opacity-80 animate-[spin_10s_linear_infinite]" />

            <div className="relative grid grid-cols-2 gap-4">
              <motion.div whileHover={{ y: -10 }} className="mt-12">
                <div className="h-100 w-full rounded-t-[100px] rounded-b-4xl overflow-hidden shadow-2xl shadow-pink-100">
                  <img
                    src={img1}
                    alt="Fashion 1"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>

              <motion.div whileHover={{ y: 10 }} className="-mb-12">
                <div className="h-100 w-full rounded-[100px] overflow-hidden shadow-2xl shadow-orange-100 border-4 border-white">
                  <img
                    src={img2}
                    alt="Fashion 2"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-full shadow-lg animate-bounce">
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
