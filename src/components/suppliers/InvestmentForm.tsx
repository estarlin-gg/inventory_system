import { useState, useMemo } from "react";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { useInvestmentQuery } from "../../queries/useInvestmentQuery";
import { useSupplierProductsQuery } from "../../queries/useSupplierQuery";
import { toast } from "react-toastify";
import { InvestmentCreate } from "../../models/investment";

interface InvestmentFormProps {
  supplierId: number;
}

export const InvestmentForm = ({ supplierId }: InvestmentFormProps) => {
  const { supplierProductsQuery } = useSupplierProductsQuery(supplierId);
  const { createInvestmentMutation, investmentsQuery } = useInvestmentQuery(supplierId);

  const supplierProducts = useMemo(() => supplierProductsQuery.data ?? [], [supplierProductsQuery.data]);

  const [productId, setProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitCost, setUnitCost] = useState<number>(0);
  const [note, setNote] = useState("");

  const totalCost = quantity * unitCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || quantity <= 0) return;

    const payload: InvestmentCreate = {
      supplier_id: supplierId,
      product_id: Number(productId),
      quantity,
      unit_cost: unitCost,
      note: note || undefined,
    };

    createInvestmentMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Inversión registrada");
        setQuantity(1);
        setUnitCost(0);
        setNote("");
        investmentsQuery.refetch();
      },
      onError: () => {
        toast.error("Error al registrar inversión");
      },
    });
  };

  if (supplierProducts.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Primero agrega productos a este proveedor para poder registrar inversiones.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div>
        <Label className="text-sm">Producto</Label>
        <Select
          value={productId}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") {
              setProductId("");
              setUnitCost(0);
            } else {
              const pid = Number(val);
              setProductId(pid);
              const prod = supplierProducts.find((p) => p.product_id === pid);
              if (prod) setUnitCost(prod.cost);
            }
          }}
        >
          <option value="">Seleccionar producto</option>
          {supplierProducts.map((p) => (
            <option key={p.product_id} value={p.product_id}>
              {p.product_name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label className="text-sm">Cantidad</Label>
        <TextInput
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>
      <div>
        <Label className="text-sm">Costo unitario (RD$)</Label>
        <TextInput
          type="number"
          min={0}
          step={0.01}
          value={unitCost}
          onChange={(e) => setUnitCost(Number(e.target.value))}
        />
      </div>
      <div className="md:col-span-2">
        <Label className="text-sm">Nota (opcional)</Label>
        <TextInput
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ej: Compra de 14 unidades"
        />
      </div>
      <div className="flex items-end gap-3">
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Total: RD${totalCost.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
        </div>
        <Button
          type="submit"
          color="green"
          size="sm"
          disabled={!productId || quantity <= 0 || createInvestmentMutation.isPending}
        >
          {createInvestmentMutation.isPending ? "Guardando..." : "Registrar"}
        </Button>
      </div>
    </form>
  );
};
