import { CgAdd } from "react-icons/cg";
import { Button } from "./Button";
import { useAppStore } from "../store/appStore";
import { IProduct } from "../model";
import { useMemo, useState } from "react";
import { Count } from "./Count";

interface ProductItemProps {
  path?: "sales" | "products" | "list";
  product: IProduct;
}

export const ProductItem = ({ path, product }: ProductItemProps) => {
  const addItem = useAppStore((state) => state.addItem);
  const shoppingList = useAppStore((state) => state.shoppingList);
  const handleModal = useAppStore((state) => state.handleModal);
  const deleteItem = useAppStore((state) => state.deleteItem);
  const handleSelectProduct = useAppStore((state) => state.handleSelectProduct);

  const { name, price, image, stocks } = product;

  const [count, setCount] = useState(1);

  const isExist = useMemo(() => {
    return shoppingList.some((p) => p.id === product.id);
  }, [shoppingList, product.id]);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    addItem({ ...product, quantity: newCount });
  };

  const decrement = () => {
    if (count <= 1) {
      deleteItem(product.id);
      return;
    }
    const newCount = count - 1;
    setCount(newCount);
    addItem({ ...product, quantity: newCount });
  };
  return (
    <div className="w-full px-4 p-2 flex justify-between items-center gap-4 border-2">
      <div className="flex gap-4 items-center">
        <div className="avatar bg-gray-600 w-16 h-16 rounded-full object-cover overflow-hidden">
          {image.length > 0 && (
            <img src={image} className="w-24 object-cover" alt={name} />
          )}
        </div>
        <div className="space-y-1">
          <h5 className="block font-medium capitalize">{name}</h5>
          <div className="flex w-full justify-between">
            <span className=" text-gray-500 text-sm text-muted">
              price: ${price}
            </span>
            <span className=" text-gray-500 text-sm text-muted">
              stocks: {stocks}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {path === "sales" && (
          <Button
            disabled={isExist}
            onClick={() => addItem({ ...product, quantity: count })}
            className="btn-primary btn-sm"
          >
            <CgAdd size={20} />
          </Button>
        )}
        {path === "products" && (
          <>
            <Button
              onClick={() => {
                handleSelectProduct(product);
                handleModal();
              }}
              className="bg-green-500 text-white btn-sm"
            >
              Editar
            </Button>
            <Button className="bg-red-500 text-white btn-sm">Eliminar</Button>
          </>
        )}
        {path === "list" && (
          <Count count={count} increment={increment} decrement={decrement} />
        )}
      </div>
    </div>
  );
};
