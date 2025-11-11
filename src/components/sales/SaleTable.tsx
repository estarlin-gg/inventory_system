import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Pagination,
} from "flowbite-react";
import { Sale } from "../../models/sale";
import { BsEye } from "react-icons/bs";
import { SaleDetail } from "./SaleDetail";
import { useStore } from "../../store/store";
import { formatCurrency } from "../../helpers/formatCurrency";
import { useState, useMemo } from "react";
import { InvoiceButton } from "../Invoices/InvoiceButton ";

interface SalesTableProps {
  sales: Sale[] ;
  showId?: boolean;
  showButtons?: "details" | "both";
  pagination?: boolean;
}

export const SalesTable = ({
  sales = [],
  showId = false,
  showButtons = "details",
  pagination,
}: SalesTableProps) => {
  const saleDetailModal = useStore((s) => s.saleDetailModal);
  const setDetailModal = useStore((s) => s.setDetailModal);
  const setSaleDetail = useStore((s) => s.setSaleDetail);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sales.length / itemsPerPage);

  const currentSales = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sales.slice(start, end);
  }, [sales, currentPage]);

  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="overflow-x-auto">
      <Table striped>
        <TableHead>
          <TableRow className="bg-gray-100 dark:bg-gray-900">
            {showId && (
              <TableHeadCell className="dark:text-gray-100">ID</TableHeadCell>
            )}
            <TableHeadCell className="dark:text-gray-100">Fecha</TableHeadCell>
            <TableHeadCell className="dark:text-gray-100">
              Cliente
            </TableHeadCell>
            <TableHeadCell className="dark:text-gray-100">Total</TableHeadCell>
            <TableHeadCell className="dark:text-gray-100">
              <span className="sr-only">Acciones</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>

        <TableBody className="divide-y">
          {currentSales.map((sale, idx) => (
            <TableRow key={idx} className="bg-white dark:bg-gray-800">
              {showId && (
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
                  {sale.id}
                </TableCell>
              )}
              <TableCell className="dark:text-gray-300">
                {sale.created_at instanceof Date
                  ? sale.created_at.toLocaleDateString()
                  : new Date(sale.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="dark:text-gray-300">
                {sale.customer_name}
              </TableCell>
              <TableCell className="dark:text-gray-300">
                {formatCurrency(sale.total_pay)}
              </TableCell>
              <TableCell className="flex gap-2">
                {showButtons === "both" && <InvoiceButton sale={sale} />}
                <Button
                  size="xs"
                  className="cursor-pointer"
                  onClick={() => setSaleDetail(sale)}
                >
                  <BsEye size={20} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showIcons
          />
        </div>
      )}

      <SaleDetail openModal={saleDetailModal} setOpenModal={setDetailModal} />
    </div>
  );
};
