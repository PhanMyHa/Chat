import { useState, useEffect } from "react";
import { userService } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Unlock, User } from "lucide-react";

export const CustomersTab = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers({
        page,
        limit: 20,
        role: "customer",
      });
      setCustomers(response.users);
      setPagination(response.pagination);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await userService.updateUserStatus(userId, !currentStatus);
      toast.success(
        `${!currentStatus ? "Kích hoạt" : "Vô hiệu hóa"} tài khoản thành công`
      );
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Danh sách khách hàng</h2>

      {loading ? (
        <div className="text-center py-20">Đang tải...</div>
      ) : customers.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Chưa có khách hàng nào.
        </div>
      ) : (
        <Card className="overflow-hidden border-zinc-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 border-b text-zinc-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Liên hệ</th>
                  <th className="px-6 py-4">Ngày đăng ký</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900">
                            {customer.displayName}
                          </div>
                          <div className="text-zinc-500 text-xs">
                            @{customer.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{customer.email}</span>
                        <span className="text-zinc-500 text-xs">
                          {customer.phone || "---"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {new Date(customer.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {customer.isActive ? "Hoạt động" : "Bị khóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant={customer.isActive ? "destructive" : "default"}
                        onClick={() =>
                          handleToggleStatus(customer._id, customer.isActive)
                        }
                      >
                        {customer.isActive ? (
                          <Lock className="w-3 h-3 mr-1" />
                        ) : (
                          <Unlock className="w-3 h-3 mr-1" />
                        )}
                        {customer.isActive ? "Khóa" : "Mở"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Trước
          </Button>
          <span className="flex items-center px-4 text-sm font-medium">
            Trang {page} / {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
};
