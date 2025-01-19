import { Button } from "./Button";
import { ReactNode } from "react";

interface ModalProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const Modal = ({ title, children, isOpen, onClose }: ModalProps) => {
  return (
    <dialog
      id="my_modal_4"
      className="modal min-h-60   bg-black/40 "
      open={isOpen}
    >
      <div className="modal-box p-2">
        <div className="p-2 border-b-2">
          <Button
            className="btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </Button>

          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <div className="modal-body overflow-hidden">{children}</div>
      </div>
    </dialog>
  );
};

{
  /* <div className="fixed inset-0 bg-black/30 p-4 z-50">
<div className="p-2 border-b-2 flex justify-between items-center">
  <h2>Shopping List</h2>
  <Button onClick={handleModal} className="btn-error btn-circle max-w-12">
    <GrClose size={15} />
  </Button>
</div>
</div> */
}
