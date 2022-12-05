import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export default function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {
  const { asPath } = useRouter();
  const path = "/" + asPath.split("/", 2)[1];

  const className = path === rest.href ? activeClassName : "";

  return (
    <Link legacyBehavior {...rest}>
      {cloneElement(children, { className })}
    </Link>
  );
}
