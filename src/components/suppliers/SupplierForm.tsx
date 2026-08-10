import {
  ArrowLeftIcon,
  Button,
  HelperText,
  Label,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SupplierCreate,
  supplierCreateSchema,
} from "../../models/supplier";
import { useSupplierActions } from "../../actions/supplier-actions";
import { useSupplierQuery } from "../../queries/useSupplierQuery";
import { useEffect } from "react";
import { Loading } from "../ui/Loading";

export const SupplierForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { handleCreateSupplier, handleUpdateSupplier } = useSupplierActions();
  const { suppliersQuery } = useSupplierQuery();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<SupplierCreate>({
    resolver: zodResolver(supplierCreateSchema),
  });

  useEffect(() => {
    if (isEdit && suppliersQuery.data) {
      const supplier = suppliersQuery.data.find(
        (s) => s.supplier_id === Number(id)
      );
      if (supplier) {
        reset({
          name: supplier.name,
          phone: supplier.phone ?? "",
          email: supplier.email ?? "",
          address: supplier.address ?? "",
        });
      }
    }
  }, [isEdit, id, suppliersQuery.data, reset]);

  if (isEdit && suppliersQuery.isLoading) return <Loading />;

  const onSubmit = (data: SupplierCreate) => {
    if (isEdit) {
      handleUpdateSupplier(Number(id), data, () => navigate(-1));
    } else {
      handleCreateSupplier(data, () => navigate(-1));
    }
  };

  return (
    <section className="w-full">
      <Link to="../">
        <ArrowLeftIcon className="text-3xl" />
      </Link>
      <div className="flex items-center gap-3 mb-4 mt-4 border-b py-1">
        <h2 className="text-3xl font-semibold">
          {isEdit ? "Editar proveedor" : "Crear proveedor"}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid lg:grid-cols-2 gap-4 mt-4"
      >
        <div>
          <Label className="text-lg">Nombre:</Label>
          <TextInput
            color={errors.name ? "failure" : "gray"}
            placeholder="Nombre del proveedor"
            {...register("name")}
          />
          <HelperText>
            {errors.name && <span>{errors.name.message}</span>}
          </HelperText>
        </div>
        <div>
          <Label className="text-lg">Teléfono:</Label>
          <TextInput
            placeholder="Número de teléfono"
            {...register("phone")}
          />
        </div>
        <div>
          <Label className="text-lg">Email:</Label>
          <TextInput
            type="email"
            color={errors.email ? "failure" : "gray"}
            placeholder="correo@ejemplo.com"
            {...register("email")}
          />
          <HelperText>
            {errors.email && <span>{errors.email.message}</span>}
          </HelperText>
        </div>
        <div className="lg:col-span-2">
          <Label className="text-lg">Dirección:</Label>
          <Textarea
            className="h-32"
            placeholder="Dirección del proveedor"
            {...register("address")}
          />
        </div>
        <div>
          <Button type="submit" className="w-full lg:w-2xs">
            {isEdit ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </section>
  );
};
