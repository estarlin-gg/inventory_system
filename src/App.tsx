import { Route, Routes, Navigate } from "react-router-dom";
import { AuthGuard } from "./guards/AuthGuard";
import { Dashboard } from "./pages/Dashboard";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { MainLayout } from "./layouts/MainLayout";
import { SalesPage } from "./pages/SalesPage";
import { ProductsPage } from "./pages/ProductsPage";
import { InvoicePage } from "./pages/InvoicePage";

function App() {
  return (
    <Routes>
      <Route
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        <Route path="/home" index element={<Dashboard />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/invoices" element={<InvoicePage />}>
          {" "}
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default App;
