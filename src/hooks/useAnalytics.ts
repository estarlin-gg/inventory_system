import { isSameDay } from "date-fns";
import { useStore } from "../store/store";

export const useAnalytics = () => {
  const sales = useStore((s) => s.sales);

  const today = new Date();

  const salesOfTheDay = sales.filter((sale) =>
    isSameDay(sale.created_at, today)
  );

  const incomeOfDay = salesOfTheDay.reduce((acc, s) => acc + s.total_pay, 0);

  const totalStock = salesOfTheDay.reduce((acc, s) => {
    const subtotal = s.sale_products.reduce((sum, p) => sum + p.quantity, 0);
    return acc + subtotal;
  }, 0);

  const analyticsOfTheDay = {
    salesOfTheDay,
    incomeOfDay,
    totalStock,
  };

  return { analyticsOfTheDay };
};
