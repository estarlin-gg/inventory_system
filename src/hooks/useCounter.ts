import { useState } from "react";

export const useCounter = () => {
  const [counter, setCounter] = useState(1);

  const addCount = () => {
    setCounter(counter + 1);
  };

  const minusCount = () => {
    setCounter(counter + 1);
  };
  return {
    counter,
    addCount,
    minusCount,
  };
};
