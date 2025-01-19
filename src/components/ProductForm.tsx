import { useForm } from "react-hook-form";
import { useAppStore } from "../store/appStore";
import { Input } from "./Input";
import { Modal } from "./Modal";
import { IProduct } from "../model";
import { Button } from "./Button";
import { useAuth } from "../hooks/useAuth";

export const ProductForm = () => {
  const modal = useAppStore((state) => state.modal);
  const handleModal = useAppStore((state) => state.handleModal);
  const handleFile = useAppStore((state) => state.handleFile);
  const selectedProduct = useAppStore((state) => state.selectedProduct);
  const createProduct = useAppStore((state) => state.createProduct);
  const updateProduct = useAppStore((state) => state.updateProduct);

  const { credentials } = useAuth();
  const hasSelectedProduct = !!Object.keys(selectedProduct).length;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProduct>({
    defaultValues: hasSelectedProduct
      ? selectedProduct
      : { name: "", price: 0, stocks: 0, description: "", image: "" },
  });

  const OnSubmit = (data: IProduct) => {
    if (Object.keys(selectedProduct).length > 0) {
      updateProduct(data);
      handleModal();
      return;
    }
    createProduct(data, credentials!.id);
    handleModal();
  };
  return (
    <Modal
      title={hasSelectedProduct ? "Edit" : "Create"}
      onClose={handleModal}
      isOpen={modal}
    >
      <form
        onSubmit={handleSubmit(OnSubmit)}
        className="flex flex-col w-full p-2 gap-3"
      >
        <div className="space-y-2 w-full">
          <label htmlFor="">Name</label>
          <Input
            type="text"
            defaultValue={hasSelectedProduct ? selectedProduct.name : ""}
            className="border-2 input-bordered"
            {...register("name", {
              required: "el nomnbre del producto es obligatorio",
            })}
          />
          {errors.name && <p className="text-error">{errors.name.message}</p>}
        </div>
        <div className="space-y-2 w-full">
          <label htmlFor="">Price</label>
          <Input
            type="number"
            className="border-2 input-bordered"
            {...register("price", {
              required: "el precio es obligatorio",
              min: {
                value: 1,
                message: "el valor tiene que ser mayor a 0",
              },
            })}
          />
          {errors.price && <p className="text-error">{errors.price.message}</p>}
        </div>
        <div className="space-y-2 w-full">
          <label htmlFor="">Amount</label>
          <Input
            type="number"
            className="border-2 input-bordered"
            {...register("stocks", {
              required: "la cantidad es obligatoria",
            })}
          />
          {errors.stocks && (
            <p className="text-error">{errors.stocks.message}</p>
          )}
        </div>
        <div className="space-y-2 w-full">
          <label htmlFor="">Description</label>
          <textarea
            className="textarea w-full textarea-bordered"
            placeholder="description"
            {...register("description", {
              required: false,
            })}
          ></textarea>
        </div>
        <div className="space-y-2 w-full">
          {hasSelectedProduct && (
            <img src={selectedProduct.image} className="w-40" />
          )}
          <label htmlFor="">File</label>
          <Input
            type="file"
            onChange={handleFile}
            className="file-input input-bordered"
          />
        </div>
        <div className="">
          <Button
            label={selectedProduct.name ? "editar" : "crear"}
            className="w-full btn-primary"
          />
        </div>
      </form>
    </Modal>
  );
};
