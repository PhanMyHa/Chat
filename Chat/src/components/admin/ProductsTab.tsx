import { useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { productService } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { ProductList } from "../admin/ProductList";
import { ProductForm } from "../admin/ProductForm";
import type { Product } from "@/types/product";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const ProductsTab = ({ refreshStats }: { refreshStats: () => void }) => {
  const { products, fetchProducts } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await productService.deleteProduct(id);
      toast.success("Xóa sản phẩm thành công");
      fetchProducts({ limit: 100 });
      refreshStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    fetchProducts({ limit: 100 });
    refreshStats();
    handleFormClose();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-zinc-800">Quản lý sản phẩm</h2>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-zinc-900 text-white hover:bg-zinc-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm sản phẩm
          </Button>
        )}
      </div>

      {showForm ? (
        <ProductForm
          initialData={editingProduct}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      ) : (
        <ProductList
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
