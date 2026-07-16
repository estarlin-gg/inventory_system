import {
  ArrowLeftIcon,
  Button,
  HelperText,
  Label,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductCreate, productCreateSchema } from "../../models/product";
import { useStore } from "../../store/store";

import { useProductActions } from "../../actions/product-actions";
import { useSupplierQuery } from "../../queries/useSupplierQuery";

export const ProductForm = () => {
  const { handleCreateProduct, handleUpdateProduct } = useProductActions();
  const selectedProduct = useStore((s) => s.selectedProduct);
  const { suppliersQuery } = useSupplierQuery();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ProductCreate>({
    defaultValues: selectedProduct ?? { cost: 0, supplier_id: null },
    resolver: zodResolver(productCreateSchema),
  });

  const onSubmit = (data: ProductCreate) => {
    const payload = {
      ...data,
      supplier_id: data.supplier_id ?? null,
    };
    if (selectedProduct) {
      handleUpdateProduct(selectedProduct.product_id, payload, () => navigate(-1));
    } else {
      handleCreateProduct(payload, () => navigate(-1));
    }
  };

  const suppliers = suppliersQuery.data ?? [];

  return (
    <section className="w-full">
      <Link to={"../"}>
        <ArrowLeftIcon className="text-3xl" />
      </Link>
      <div className="flex items-center gap-3 mb-4 mt-4 border-b py1">
        <h2 className="text-3xl font-semibold">
          {selectedProduct?.product_id ? "Editar producto" : "Crear Producto"}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid lg:grid-cols-2 gap-4"
      >
        <div>
          <Label className="text-lg">Nombre:</Label>
          <TextInput
            color={errors.product_name ? "failure" : "gray"}
            {...register("product_name")}
          />
          <HelperText>
            {errors.product_name && <span>{errors.product_name.message}</span>}
          </HelperText>
        </div>
        <div>
          <Label className="text-lg">Precio:</Label>
          <TextInput
            type="number"
            color={errors.price ? "failure" : "gray"}
            {...register("price", { valueAsNumber: true })}
          />
          <HelperText>
            {errors.price && <span>{errors.price.message}</span>}
          </HelperText>
        </div>
        <div>
          <Label className="text-lg">Costo:</Label>
          <TextInput
            type="number"
            color={errors.cost ? "failure" : "gray"}
            placeholder="Costo de adquisición"
            {...register("cost", { valueAsNumber: true })}
          />
          <HelperText>
            {errors.cost && <span>{errors.cost.message}</span>}
          </HelperText>
        </div>
        <div>
          <Label className="text-lg">Descuento:</Label>
          <TextInput
            type="number"
            {...register("discount", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label className="text-lg">Proveedor:</Label>
          <Select
            {...register("supplier_id", { valueAsNumber: true })}
          >
            <option value="">Sin proveedor</option>
            {suppliers.map((s) => (
              <option key={s.supplier_id} value={s.supplier_id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label className="text-lg">Stock:</Label>
          <TextInput
            color={errors.stock ? "failure" : "gray"}
            type="number"
            {...register("stock", { valueAsNumber: true })}
          />
          <HelperText>
            {errors.stock && <span>{errors.stock.message}</span>}
          </HelperText>
        </div>
        <div className="lg:col-span-2">
          <Label className="text-lg">Descripción:</Label>
          <Textarea className="h-56" {...register("description")} />
        </div>
        <div>
          <Button type="submit" className="w-full lg:w-2xs">
            {selectedProduct ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </section>
  );
};
