const facturaData = {
  numero: "F-001",
  fecha: "2023-07-01",
  cliente: {
    nombre: "Juan Pérez",
    direccion: "Calle Principal 123, Ciudad",
    email: "juan@example.com",
  },
  items: [
    {
      id: 1,
      descripcion: "Producto A",
      cantidad: 2,
      precioUnitario: 50,
      total: 100,
    },
    {
      id: 2,
      descripcion: "Servicio B",
      cantidad: 1,
      precioUnitario: 75,
      total: 75,
    },
    {
      id: 3,
      descripcion: "Producto C",
      cantidad: 3,
      precioUnitario: 25,
      total: 75,
    },
  ],
  subtotal: 250,
  impuestos: 25,
  total: 275,
};

export const Invoice = () => {
  return (
    <div className="overflow-y-auto h-[90vh]">
      <div className="bg-white shadow-md rounded-lg w-full max-w-3xl">
        <div id="factura" className="p-6">
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-center">Factura</h1>
            <p className="font-semibold mt-4">
              Factura No: {facturaData.numero}
            </p>
            <p>Fecha: {facturaData.fecha}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Cliente:</h3>
            <p>{facturaData.cliente.nombre}</p>
            <p>{facturaData.cliente.direccion}</p>
            <p>{facturaData.cliente.email}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border px-4 py-2">Descripción</th>
                  <th className="border px-4 py-2 text-right">Cantidad</th>
                  <th className="border px-4 py-2 text-right">
                    Precio Unitario
                  </th>
                  <th className="border px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {facturaData.items.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">{item.descripcion}</td>
                    <td className="border px-4 py-2 text-right">
                      {item.cantidad}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      ${item.precioUnitario.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      ${item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right">
            <p>Subtotal: ${facturaData.subtotal.toFixed(2)}</p>
            <p>Impuestos: ${facturaData.impuestos.toFixed(2)}</p>
            <p className="font-semibold text-lg">
              Total: ${facturaData.total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
