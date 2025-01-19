import { BiMinus, BiPlus } from "react-icons/bi";

interface CountProps {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const Count = ({ count, increment, decrement }: CountProps) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={decrement}
        className="w-8 h-8 flex items-center justify-center text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
        // disabled={count <= 1}
      >
        <BiMinus size={16} />
      </button>
      <span className="w-8 text-center font-medium text-gray-900">{count}</span>
      <button
        onClick={increment}
        className="w-8 h-8 flex items-center justify-center text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <BiPlus size={16} />
      </button>
    </div>
  );
};
