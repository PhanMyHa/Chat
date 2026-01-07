import { Truck, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Miễn phí vận chuyển cho đơn hàng trên 500k",
    color: "from-blue-100 to-cyan-100",
    iconColor: "text-blue-600",
  },
  {
    icon: ShieldCheck,
    title: "Chính hãng 100%",
    desc: "Cam kết chất lượng, bồi thường x2 nếu giả",
    color: "from-pink-100 to-rose-100",
    iconColor: "text-rose-600",
  },
  {
    icon: Sparkles, // Đổi icon Star thành Sparkles cho điệu đà hơn
    title: "Hỗ trợ 24/7",
    desc: "Đổi trả dễ dàng trong vòng 7 ngày",
    color: "from-amber-100 to-orange-100",
    iconColor: "text-amber-600",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="relative py-2 overflow-hidden bg-zinc-50/50">
      {/* --- Background Decor --- */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              {/* Card Container */}
              <div className="h-full bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50 hover:border-zinc-200">
                
                {/* Icon Area - Playful Rotation */}
                <div className="mb-6 relative w-16 h-16 mx-auto md:mx-0">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} rotate-6 transition-transform group-hover:rotate-12`} />
                  <div className="absolute inset-0 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center -rotate-3 transition-transform group-hover:-rotate-6 shadow-sm">
                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-center md:text-left">
                  <h3 className="font-serif font-bold text-xl text-zinc-900 mb-3 tracking-tight group-hover:text-rose-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};