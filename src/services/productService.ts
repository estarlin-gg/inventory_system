import { supabase } from "../supabase/supabase";
import { IOrderItem, IProduct } from "../model";
import Swal from "sweetalert2";

export const getProducts = async (user_id: string): Promise<IProduct[]> => {
  if (!user_id) return [];

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      throw error;
    }

    return data?.map((product) => ({
      id: product.id,
      user_id: product.user_id,
      name: product.name,
      price: product.price,
      stocks: product.stocks,
      description: product.description,
      image: product.image,
    })) as IProduct[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const createProduct = async (product: Omit<IProduct, "user_id">) => {
  try {
    const { error } = await supabase.from("products").insert(product);

    if (error) {
      throw error;
    }

    console.log("Producto creado:");
  } catch (error) {
    console.log("Error al crear el producto:", error);
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      throw error;
    }

    console.log("Producto eliminado:", data);
  } catch (error) {
    console.log("Error al eliminar el producto:", error);
  }
};

export const updateProduct = async (product: Partial<IProduct>) => {
  try {
    await supabase.from("products").update(product).eq("id", product.id);
    Swal.fire({
      title: "Success!",
      text: "The product has been updated successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStocks = async (shoppingList: IOrderItem[]) => {
  try {
    const updates = shoppingList.map(async (item) => {
      const { data: product } = await supabase
        .from("products")
        .select("stocks")
        .eq("id", item.id)
        .single();

      console.log(product);
      if (!product) throw new Error("producto raro no hay");
      const newStock = product.stocks - item.quantity;

      await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", item.id);

      return updateProduct({
        id: item.id,
        stocks: newStock,
      });
    });

    await Promise.all(updates);
    console.log("Stocks actualizados correctamente");
  } catch (error) {
    console.error(error);
  }
};
