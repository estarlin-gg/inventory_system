import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { IOrderItem } from "../model";

type InvoicePdfProps = {
  client: string;
  items: IOrderItem[];
  total: number;
};

const styles = StyleSheet.create({
  page: {
    width: 612,
    height: 102,
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    textAlign: "right",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    marginVertical: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid black",
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 10,
    color: "gray",
  },
});

export const InvoicePDF = ({ client, items, total }: InvoicePdfProps) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Text>Anvil Co</Text>
        <Text>123 Main Street</Text>
        <Text>San Francisco CA, 94103</Text>
        <Text>hello@useanvil.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>{client}</Text>
        <Text>Invoice Date: May 24th, 2024</Text>
        <Text>Invoice No: 12345</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 1 }]}>COUNT</Text>
          <Text style={[styles.cell, { flex: 3 }]}>NOMBRE</Text>
          <Text style={[styles.cell, { flex: 1 }]}>PRECIO</Text>
          <Text style={[styles.cell, { flex: 1 }]}>SUBTOTAL</Text>
        </View>
        {items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.cell, { flex: 1 }]}>{item.quantity}</Text>
            <Text style={[styles.cell, { flex: 3 }]}>{item.name}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>
              ${item.price.toFixed(2)}
            </Text>
            <Text style={[styles.cell, { flex: 1 }]}>
              ${(item.quantity * item.price).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text>Total: {total}</Text>
        <Text>Due By: May 30th, 2024</Text>
      </View>
    </Page>
  </Document>
);
