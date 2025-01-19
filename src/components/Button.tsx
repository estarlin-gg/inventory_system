import { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  label?: string;
};

export const Button = ({
  children,
  label,
  className,
  onClick,
  ...rest
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`btn capitalize ${className}`}
      {...rest}
    >
      {label}
      {children}
    </button>
  );
};
