import Link, { LinkProps } from "next/link";
import { forwardRef, AnchorHTMLAttributes } from "react";
import clsx from "clsx";

type NoStyleLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    className?: string;
  };

export const NoStyleLink = (
  ({ children, className, ...props }: NoStyleLinkProps) => {
    return (
      <Link
        {...props}
        className={clsx("text-inherit no-underline", className)}
      >
        {children}
      </Link>
    );
  }
);
