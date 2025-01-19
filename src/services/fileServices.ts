import { supabase } from "../supabase/supabase";

export const createUserFolder = async (user_id: string): Promise<void> => {
  try {
    const { data: existingFolders } = await supabase.storage
      .from("Users")
      .list(user_id, { limit: 1 });

    if (existingFolders && existingFolders.length > 0) {
      return;
    }

    const folderPaths = [
      `${user_id}/products/.keep`,
      `${user_id}/invoices/.keep`,
    ];

    const folderPromises = folderPaths.map(async (path) => {
      await supabase.storage
        .from("Users")
        .upload(path, new Blob([""], { type: "text/plain" }), {
          upsert: false,
        });
    });

    await Promise.all(folderPromises);
    console.log(
      `Estructura de carpetas creada correctamente para el usuario ${user_id}`
    );
  } catch (error) {
    console.error(
      "Error al verificar o crear la estructura de carpetas:",
      error
    );
    throw error;
  }
};

export const uploadImage = async (
  user_id: string,
  file: File | null
): Promise<string> => {
  try {
    const filePath = `${user_id}/products/${file?.name}`;
    await supabase.storage.from("Users").upload(filePath, file!, {
      upsert: false,
    });

    const { data } = supabase.storage
      .from(`Users/${user_id}/products`)
      .getPublicUrl(file!.name);
    return data.publicUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const uploadPDF = async (
  user_id: string,
  file: File | null
): Promise<string> => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const filePath = `${user_id}/invoices/${file.name}`;

    await supabase.storage.from("Users").upload(filePath, file, {
      upsert: false,
    });

    const { data } = supabase.storage.from("Users").getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error al guardar la factura:", error);
    throw error;
  }
};
