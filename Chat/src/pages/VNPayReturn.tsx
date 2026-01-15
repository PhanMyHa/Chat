import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { orderService } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const queryString = searchParams.toString();
        const result = await orderService.verifyVNPayPayment(queryString);

        if (result.success) {
          setStatus("success");
          setMessage(result.message || "Thanh toán thành công!");
          setOrderId(result.order?._id || "");
        } else {
          setStatus("error");
          setMessage(result.message || "Thanh toán thất bại!");
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Có lỗi xảy ra!");
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-rose-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-600">Đang xác nhận thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center">
          {status === "success" ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-3">
                Thanh toán thành công!
              </h2>
              <p className="text-zinc-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate(`/orders/${orderId}`)}
                  className="w-full bg-zinc-900 hover:bg-rose-500"
                >
                  Xem đơn hàng
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  Về trang chủ
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-3">
                Thanh toán thất bại!
              </h2>
              <p className="text-zinc-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/cart")}
                  className="w-full bg-zinc-900 hover:bg-rose-500"
                >
                  Thử lại
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  Về trang chủ
                </Button>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
};
