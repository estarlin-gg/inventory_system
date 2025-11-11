import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "flowbite-react";
import { BiPrinter } from "react-icons/bi";
import InvoicePDF from "./invoicePDF";
import { Sale } from "../../models/sale";

export const InvoiceButton = ({ sale }: { sale: Sale }) => {
  if (!sale?.id) return null;

  return (
    <PDFDownloadLink
      document={<InvoicePDF sale={sale} />}
      fileName={`Factura_${sale.id}.pdf`}
      key={sale.id}
    >
      {({ loading }) => (
        <Button size="xs" color="yellow" disabled={loading}>
          <BiPrinter size={20} />
        </Button>
      )}
    </PDFDownloadLink>
  );
};
