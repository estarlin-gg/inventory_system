import { Button } from "./Button";
import { useAppStore } from "../store/appStore";
import { ProductItem } from "./ProductItem";

export const ShoppingList = () => {
  const shoppingList = useAppStore((state) => state.shoppingList);
  const payShoppingList = useAppStore((state) => state.payShoppingList);

  const totalPay = shoppingList.reduce(
    (a, i) => a + i.price * (i.quantity || 1),
    0
  );

  const handlePay = async () => {
    try {
      await payShoppingList();
      console.log("Pago procesado correctamente");
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    }
  };

  return (
    <div className="rounded-lg min-h-[525px] flex flex-col overflow-x-hidden">
      <div className="overflow-y-auto h-[430px] flex flex-col gap-2 px-2 py-1">
        {shoppingList.map((p) => (
          <ProductItem key={p.id} path="list" product={p} />
        ))}
      </div>
      <div className="space-y-2 p-2 border border-t mt-auto">
        <h3>Total pay: {totalPay}</h3>
        <Button
          onClick={handlePay}
          label="Pagar"
          className="btn-primary btn-md w-full"
        />
      </div>
    </div>
  );
};
