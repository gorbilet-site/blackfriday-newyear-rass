import { forwardRef, type AnchorHTMLAttributes } from "react";
import { toHash } from "./router";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; prefetch?: boolean };

/** Замена next/link: обычная ссылка с хэш-адресом */
const Link = forwardRef<HTMLAnchorElement, Props>(function Link({ href, prefetch: _p, ...rest }, ref) {
  void _p;
  return <a ref={ref} href={toHash(href)} {...rest} />;
});
export default Link;
