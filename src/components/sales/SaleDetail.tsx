import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useStore } from "../../store/store";
import { formatCurrency } from "../../helpers/formatCurrency";

interface SaleDetailProps {
  openModal: boolean;
  setOpenModal: () => void;
}

export const SaleDetail = ({ openModal, setOpenModal }: SaleDetailProps) => {
  const saleDetail = useStore((s) => s.saleDetail);

  return (
    <Modal
      dismissible
      size="3xl"
      className="z-50"
      show={openModal}
      onClose={setOpenModal}
    >
      <ModalHeader className="py-4 dark:bg-gray-800 dark:text-gray-100">
        Detalles de venta
      </ModalHeader>
      <ModalBody className="dark:bg-gray-900 dark:text-gray-100 flex justify-center">
        <div className="grid grid-cols-2 gap-4 w-full space-y-1">
          <div className="flex flex-col border-b border-gray-300 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300 capitalize">
              No. factura
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {saleDetail.id}
            </span>
          </div>
          <div className="flex flex-col border-b border-gray-300 space-y-1 dark:border-gray-700">
            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
              Fecha:
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {saleDetail.created_at instanceof Date
                ? saleDetail.created_at.toLocaleDateString()
                : new Date(saleDetail.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="col-span-2 flex flex-col border-b border-gray-300 space-y-1 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">Cliente:</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100 capitalize">
              {saleDetail.customer_name}
            </span>
          </div>
          <div className="col-span-2 flex flex-col gap-2 overflow-x-auto">
            <span className="text-gray-700 dark:text-gray-300">Productos:</span>
            <Table>
              <TableHead className="dark:bg-gray-800">
                <TableRow>
                  <TableHeadCell className="dark:text-gray-100">
                    Producto
                  </TableHeadCell>
                  <TableHeadCell className="dark:text-gray-100">
                    Precio
                  </TableHeadCell>
                  <TableHeadCell className="dark:text-gray-100">
                    Cantidad
                  </TableHeadCell>
                  <TableHeadCell className="dark:text-gray-100">
                    Total
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {saleDetail.sale_products.map((p, idx) => (
                  <TableRow key={idx} className="bg-white dark:bg-gray-800">
                    <TableCell className="whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">
                      {p.product_name}
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      {formatCurrency(p.price)}
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      {p.quantity}
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      {formatCurrency(p.price * p.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="col-span-3 justify-end flex gap-2">
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              Total:
            </h2>
            <span className="font-extrabold text-xl text-gray-900 dark:text-gray-100">
              {formatCurrency(saleDetail.total_pay)}
            </span>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="dark:bg-gray-800 p-3">
        <Button onClick={setOpenModal}>Ok</Button>
      </ModalFooter>
    </Modal>
  );
};
