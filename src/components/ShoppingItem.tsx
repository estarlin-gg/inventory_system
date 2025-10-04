import { Button } from "flowbite-react";
import { SalesProduct } from "../models/sale";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import { useStore } from "../store/store";

interface ShoppingItemProps {
  product: SalesProduct;
}
export const ShoppingItem = ({ product }: ShoppingItemProps) => {
  const removeProduct = useStore((state) => state.removeProduct);
  const decreaseQuantity = useStore((s) => s.decreaseQuantity);
  const addToShop = useStore((state) => state.addShoppinList);

  return (
    <div className="flex justify-between shadow-xs items-center gap-3 py-3 px-2 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex flex-col gap-2">
        <h2 className="capitalize font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
          {product.product_name}
        </h2>
        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
          ${product.final_price.toFixed(2)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Button
          onClick={() => removeProduct(product.product_id)}
          color="red"
          outline
          size="xs"
        >
          <BiTrash size={15} />
        </Button>

        <div className="flex items-center gap-1">
          <Button
            onClick={() => {
              decreaseQuantity(product.product_id);
            }}
            color="alternative"
            size="xs"
          >
            <BiMinus />
          </Button>

          <span className="text-sm font-medium w-8 text-center dark:text-gray-100">
            {product.quantity}
          </span>

          <Button
            onClick={() => {
              addToShop({ ...product });
            }}
            color="alternative"
            size="xs"
          >
            <BiPlus />
          </Button>
        </div>
      </div>
    </div>
  );
};
