import { parse, useHash } from "./router";

export function usePathname() {
  return parse(useHash()).path;
}
export function notFound(): never {
  throw new Error("not found");
}
