import { Badge, Button, Card } from "flowbite-react";
import { FaCartArrowDown, FaEdit, FaEraser, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useStore } from "../../store/store";

import { SalesProduct } from "../../models/sale";
import { Product } from "../../models/product";
import { useProductActions } from "../../actions/product-actions";

interface ProductCardProps {
  product: Product | SalesProduct;
  type: "sale" | "edit";
}

export const ProductCard = ({ product, type }: ProductCardProps) => {
  const addShopList = useStore((s) => s.addShoppinList);
  const setSelectedProduct = useStore((s) => s.setSelectedProduct);
  const { handleDeleteProduct } = useProductActions();
  const navigate = useNavigate();

  return (
    <Card
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                 text-gray-900 dark:text-gray-100 transition-colors duration-300"
    >
      <div className="flex justify-between items-center gap-2">
        <h5 className="text-lg font-bold tracking-tight">
          {product.product_name}
        </h5>
        {(product.discount ?? 0) > 0 && (
          <Badge color="green" size="sm">-{product.discount}%</Badge>
        )}
      </div>

      {product.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {product.description}
        </p>
      )}

      <div className="flex items-baseline gap-2">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          RD$
          {product.final_price.toLocaleString("es-DO", {
            minimumFractionDigits: 2,
          })}
        </p>
        {(product.discount ?? 0) > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
            RD$
            {product.price.toLocaleString("es-DO", {
              minimumFractionDigits: 2,
            })}
          </p>
        )}
      </div>

      <p
        className={`text-sm ${
          product.stock > 0
            ? "text-gray-500 dark:text-gray-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        Disponibles: {product.stock}
      </p>

      {type === "sale" ? (
        <div className="flex gap-4 mt-auto">
          <Button
            color="green"
            className="w-full"
            disabled={product.stock <= 0}
            onClick={() => {
              addShopList({ ...product, quantity: 1 });
            }}
          >
            <FaCartArrowDown size={20} className="mr-2" />
            {product.stock <= 0 ? "Sin stock" : "Agregar"}
          </Button>
          <Button color="blue" className="w-full">
            <FaEye size={20} className="mr-2" />
            Ver
          </Button>
        </div>
      ) : (
        <div className="flex gap-4 mt-auto">
          <Button
            onClick={() => {
              setSelectedProduct(product);
              navigate(`${product.product_id}`);
            }}
            color="yellow"
            className="w-full"
          >
            <FaEdit size={20} className="mr-2" />
            Editar
          </Button>
          <Button
            onClick={() => {
              Swal.fire({
                title: "Estas seguro de borrar este producto?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Si!",
                denyButtonText: `No`,
              }).then((result) => {
                if (result.isConfirmed) {
                  handleDeleteProduct(product.product_id);
                }
              });
            }}
            color="red"
            className="w-full"
          >
            <FaEraser size={20} className="mr-2" />
            Eliminar
          </Button>
        </div>
      )}
    </Card>
  );
};
