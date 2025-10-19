import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
} from "flowbite-react";
import { Sale } from "../models/sale";
import { BsEye } from "react-icons/bs";
import { BiPrinter } from "react-icons/bi";
import { SaleDetail } from "./SaleDetail";
import { useStore } from "../store/store";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./invoicePDF";
import { formatCurrency } from "../helpers/formatCurrency";

interface SalesTableProps {
  sales: Sale[];
  showId?: boolean;
  showButtons?: "details" | "both";
}

export const SalesTable = ({
  sales,
  showId = false,
  showButtons = "details",
}: SalesTableProps) => {
  const saleDetailModal = useStore((s) => s.saleDetailModal);
  const setDetailModal = useStore((s) => s.setDetailModal);
  const setSaleDetail = useStore((s) => s.setSaleDetail);

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
          {sales.map((sale, idx) => (
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
                {showButtons === "both" && (
                  <PDFDownloadLink
                    document={<InvoicePDF sale={sale || null} />}
                    fileName={`${sale.id}`}
                  >
                    <Button
                      size="xs"
                      className="cursor-pointer"
                      color={"yellow"}
                    >
                      <BiPrinter size={20} />
                    </Button>
                  </PDFDownloadLink>
                )}
                <Button
                  size="xs"
                  className="cursor-pointer"
                  onClick={() => {
                    setSaleDetail(sale);
                  }}
                >
                  <BsEye size={20} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SaleDetail openModal={saleDetailModal} setOpenModal={setDetailModal} />
    </div>
  );
};
