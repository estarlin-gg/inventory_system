import {
  Button,
  Drawer,
  DrawerHeader,
  DrawerItems,
  TextInput,
} from "flowbite-react";
import { useStore } from "../../store/store";
import { ShoppingItem } from "./ShoppingItem";
import { useMemo } from "react";
import { BsListUl } from "react-icons/bs";
import { formatCurrency } from "../../helpers/formatCurrency";

import { useSaleActions } from "../../actions/sale-actions";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

export const ShoopList = ({ open, onClose }: DrawerProps) => {
  const shoppingList = useStore((state) => state.shoppingList);
  const saleDetail = useStore((state) => state.saleDetail);
  const handleCustomer = useStore((state) => state.handleCustomer);
  const { handleCreateSale } = useSaleActions();

  const totalPay = useMemo(
    () => shoppingList.reduce((acc, t) => acc + t.final_price, 0),
    [shoppingList]
  );

  return (
    <Drawer
      className="w-sm md:w-md lg:w-xl h-[100dvh] flex flex-col
             bg-white dark:bg-gray-900
             text-gray-900 dark:text-gray-100
             transition-colors duration-300"
      open={open}
      onClose={onClose}
      position="right"
    >
      <DrawerHeader
        title="Lista de productos"
        titleIcon={BsListUl}
        className="border-b border-gray-200 dark:border-gray-700"
      />

      <TextInput
        onChange={(e) => handleCustomer(e.target.value)}
        placeholder="Nombre de cliente"
        className="my-2 "
      />

      <DrawerItems className="h-[76%]">
        <div className="grid gap-3">
          {shoppingList.length > 0 ? (
            shoppingList.map((p) => (
              <ShoppingItem key={p.product_id} product={p} />
            ))
          ) : (
            <span className="text-lg text-center mt-52 text-gray-400 dark:text-gray-500">
              Lista de compras vacía
            </span>
          )}
        </div>
      </DrawerItems>

      <div className="w-full mt-auto px-2 py-2 px1 border-t border-gray-300 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl">Total a pagar</h2>
          <span className="text-2xl font-medium">
            {formatCurrency(totalPay)}
          </span>
        </div>
        <div className="mt-3">
          <Button
            size="lg"
            className="w-full"
            onClick={() => handleCreateSale(saleDetail)}
          >
            Pagar
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
