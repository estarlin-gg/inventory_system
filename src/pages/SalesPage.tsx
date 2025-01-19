import { Input } from "../components/Input";
import { ShoppingList } from "../components/ShoppingList";
import { Button } from "../components/Button";
import { useAppStore } from "../store/appStore";
import { CiViewList } from "react-icons/ci";
import { ProductList } from "../components/ProductList";
import { Modal } from "../components/Modal";


export const SalesPage = () => {
  const modal = useAppStore((state) => state.modal);
  const handleModal = useAppStore((state) => state.handleModal);

  return (
    <div className="space-y-4 ">
     
      <div>
        <Input
          type="text"
          placeholder="Search for a product"
          className="lg:max-w-sm input-bordered"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2  ">
        <div className="h-full  ">
          <ProductList
            path="sales"
            classes="h-[calc(100vh-180px)] lg:h-[calc(100vh-170px)] overflow-y-auto"
          />
        </div>
        <div className="hidden lg:block">
          <ShoppingList />
        </div>
      </div>

      {modal && (
        <Modal
          title="Shopping List"
          children={<ShoppingList />}
          onClose={handleModal}
          isOpen={modal}
        />
      )}

      <Button
        className="btn-circle btn-sm w-14 h-14 fixed bottom-8 right-6 btn-primary lg:hidden"
        onClick={handleModal}
      >
        <CiViewList size={25} />
      </Button>

    </div>
  );
};
