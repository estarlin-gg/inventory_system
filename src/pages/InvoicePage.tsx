import { useEffect } from "react";
import { useAppStore } from "../store/appStore";
import { useAuth } from "../hooks/useAuth";

export const InvoicePage = () => {
  const { credentials } = useAuth();
  const getInvoices = useAppStore((state) => state.getInvoices);
  useEffect(() => {
    if (credentials?.id) {
      getInvoices(credentials.id);
    }
  }, [credentials?.id, getInvoices]);

  return <div>InvoicePage</div>;
};
