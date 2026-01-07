import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

export const HomeFooter = () => {
  

  return (
    <footer className="mt-10 relative bg-zinc-950 text-zinc-300 pt-20 pb-10 overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03]">
        <span className="text-[20vw] font-black leading-none text-white whitespace-nowrap select-none">
          SHOPQUANAO
        </span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <Link
                to="/"
                className="text-2xl font-bold text-white tracking-tighter uppercase mb-4 block"
              >
                ShopQuanAo<span className="text-rose-500">.</span>
              </Link>
              <p className="text-zinc-400 leading-relaxed text-sm max-w-sm">
                Chúng tôi tin rằng thời trang không chỉ là vẻ bề ngoài, mà là
                cách bạn kể câu chuyện của chính mình. Thiết kế tinh tế, chất
                liệu cao cấp, dành riêng cho bạn.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
                <span>Đà Nẵng</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-rose-500 shrink-0" />
                <span>0123456789</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-rose-500 shrink-0" />
                <span>@shopquanao.com</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">
              Cửa hàng
            </h4>
            <ul className="space-y-4 text-sm">
              {["Sản phẩm mới", "Bán chạy nhất", "Phụ kiện", "Giảm giá"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/products"
                      className="hover:text-rose-500 hover:pl-2 transition-all duration-300 block"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">
              Hỗ trợ
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                "Theo dõi đơn hàng",
                "Chính sách đổi trả",
                "Hướng dẫn chọn size",
                "Câu hỏi thường gặp",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="hover:text-rose-500 hover:pl-2 transition-all duration-300 block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};
