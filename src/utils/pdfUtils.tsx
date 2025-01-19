import { pdf } from "@react-pdf/renderer";
import { InvoicePDF } from "../components/InvoicePDF";
import { v4 as uuidv4 } from "uuid";
import { IOrderItem } from "../model";

export const generateInvoicePDF = async (
  items: IOrderItem[],
  total: number,
  client: string
  
): Promise<File> => {
  const pdfBlob = await pdf(
    <InvoicePDF total={total} items={items} client={client} />
  ).toBlob();

  const fileName = `FACT${uuidv4()}.pdf`;

  return new File([pdfBlob], fileName, { type: "application/pdf" });
};
