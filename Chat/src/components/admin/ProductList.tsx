import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductList = ({
  products,
  onEdit,
  onDelete,
}: ProductListProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Chưa có sản phẩm nào.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card
          key={product._id}
          className="h-90 overflow-hidden hover:shadow-md transition-shadow flex flex-col text-sm"
        >
          <div className="relative h-35 bg-gray-100">
            <img
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-3 flex flex-col flex-1">
            <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>

            <div className="text-xs text-gray-500 mb-2 line-clamp-2 min-h-8">
              {product.description}
            </div>

            <div className="font-semibold text-rose-600 mb-3">
              {(product.discountPrice || product.price).toLocaleString("vi-VN")}
              ₫
              {product.discountPrice && (
                <span className="text-gray-400 text-xs line-through ml-2">
                  {product.price.toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>

            <div className="flex gap-2 mt-auto">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onEdit(product)}
              >
                <Edit className="w-3 h-3 mr-1" /> Sửa
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                onClick={() => onDelete(product._id)}
              >
                <Trash2 className="w-3 h-3 mr-1" /> Xóa
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
