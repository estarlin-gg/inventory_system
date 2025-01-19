import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { ProductForm } from "../components/ProductForm";
import { ProductList } from "../components/ProductList";
import { useAppStore } from "../store/appStore";

export const ProductsPage = () => {
  const handleModal = useAppStore((state) => state.handleModal);
  const modal = useAppStore((state) => state.modal);

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex lg:justify-end gap-4 w-full">
          <Input
            type="text"
            placeholder="Search for a product"
            className="lg:max-w-sm input-bordered"
          />
          <Button
            className="bg-green-400 text-white"
            label="create product"
            onClick={handleModal}
          />
        </div>

        <ProductList
          path="products"
          classes="h-[calc(100vh-180px)] lg:h-[calc(100vh-150px)] overflow-y-auto"
        />
      </div>

      {modal && <ProductForm />}
    </>
  );
};
