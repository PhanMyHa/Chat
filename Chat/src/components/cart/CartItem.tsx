import type { CartItem as CartItemType } from "@/types/cart";
import { Button } from "../ui/button";
import { Minus, Plus, X } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const price = item.product.discountPrice || item.product.price;
  const total = price * item.quantity;

  return (
    <div className="flex gap-4 py-4 border-b">
      <img
        src={item.product.images[0] || "/placeholder.jpg"}
        alt={item.product.name}
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-semibold mb-1">{item.product.name}</h3>
        <div className="text-sm text-gray-600 mb-2">
          <span>Size: {item.size}</span>
          {item.color && <span className="ml-3">Màu: {item.color}</span>}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center">{item.quantity}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-right">
            <div className="font-bold text-red-600">
              {total.toLocaleString("vi-VN")}₫
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(item._id)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
