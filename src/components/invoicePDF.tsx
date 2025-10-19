import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Sale } from "../models/sale";
import { formatCurrency } from "../helpers/formatCurrency";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#000000",
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    color: "#000000",
    fontWeight: "bold",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    color: "#555555",
  },
  value: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000000",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 5,
  },

  table: {
    display: "flex",
    width: "auto",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 4,
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tableCell: {
    fontSize: 10,
    color: "#000000",
  },
  productCol: {
    width: "40%",
  },
  priceCol: {
    width: "20%",
    textAlign: "right",
  },
  quantityCol: {
    width: "20%",
    textAlign: "center",
  },
  totalCol: {
    width: "20%",
    textAlign: "right",
  },

  totalSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
});

interface InvoicePDFProps {
  sale: Sale | null;
}

export default function InvoicePDF({ sale }: InvoicePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Detalles de venta</Text>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>No. Factura:</Text>
              <Text style={styles.value}>{sale?.id ?? "—"}</Text>
            </View>
            <View>
              <Text style={styles.label}>Fecha:</Text>
              <Text style={styles.value}>
                {sale?.created_at && new Date(sale?.created_at).toLocaleDateString("es-DO")}
              </Text>
            </View>
          </View>

          <View>
            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.value}>{sale?.customer_name}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos:</Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.productCol]}>
                Producto
              </Text>
              <Text style={[styles.tableHeaderText, styles.priceCol]}>
                Precio
              </Text>
              <Text style={[styles.tableHeaderText, styles.quantityCol]}>
                Cantidad
              </Text>
              <Text style={[styles.tableHeaderText, styles.totalCol]}>
                Total
              </Text>
            </View>

            {sale?.sale_products.map((product, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.productCol]}>
                  {product.product_name ?? product.product_name ?? "—"}
                </Text>
                <Text style={[styles.tableCell, styles.priceCol]}>
                  {formatCurrency(product.price)}
                </Text>
                <Text style={[styles.tableCell, styles.quantityCol]}>
                  {product.quantity}
                </Text>
                <Text style={[styles.tableCell, styles.totalCol]}>
                  {formatCurrency(product.price * product.quantity)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalText}>
            Total a pagar: {sale?.total_pay && formatCurrency(sale.total_pay)}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
