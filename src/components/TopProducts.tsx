export const TopProducts = () => {
  return (
    <div className=" card space-y-4 bg-white rounded-2xl p-4">
      <div className="card-title">
        <h2>Top Products</h2>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {/* <img src="" className="avatar" /> */}
          <div className="avatar bg-gray-600 p- w-10 h-10 rounded-full"></div>
          <div className="">
            <h2 className="block font-medium text-sm">Producto</h2>
            <span className="block text-gray-400 text-sm text-muted">
              count ex 120
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <img src="" className="avatar" /> */}
          <div className="avatar bg-gray-600 p- w-10 h-10 rounded-full"></div>
          <div className="">
            <h2 className="block font-medium text-sm">Producto</h2>
            <span className="block text-gray-400 text-sm text-muted">
              count ex 120
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <img src="" className="avatar" /> */}
          <div className="avatar bg-gray-600 p- w-10 h-10 rounded-full"></div>
          <div className="">
            <h2 className="block font-medium text-sm">Producto</h2>
            <span className="block text-gray-400 text-sm text-muted">
              count ex 120
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
