import { useSyncExternalStore } from "react";

/**
 * Маршрутизация однофайловой версии через хэш.
 * #/goroda/kazan это страница, #kuda это якорь на главной.
 */
export type Route = { path: string; anchor: string | null };

export function parse(hash: string): Route {
  if (hash.startsWith("#/")) {
    const [path, anchor] = hash.slice(1).split("#");
    return { path: path.replace(/\/+$/, "") || "/", anchor: anchor || null };
  }
  return { path: "/", anchor: hash.slice(1) || null };
}

/** Ссылка сайта в хэш: "/goroda/kazan" → "#/goroda/kazan", "/#kuda" → "#kuda" */
export function toHash(href: string) {
  if (/^(https?:|mailto:|tel:)/.test(href) || href.startsWith("#")) return href;
  const [path, anchor] = href.split("#");
  const clean = path.replace(/\/+$/, "") || "/";
  if (clean === "/") return anchor ? `#${anchor}` : "#/";
  return `#${clean}${anchor ? `#${anchor}` : ""}`;
}

const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

export function useHash() {
  return useSyncExternalStore(subscribe, () => location.hash, () => "");
}
