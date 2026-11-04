import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CityView } from "@/components/city-view";
import Home from "@/app/page";
import About from "@/app/o-proekte/page";
import Contacts from "@/app/kontakty/page";
import NotFound from "@/app/not-found";
import { getCity } from "@/data/cities";
import { site } from "@/lib/site";
import { parse, useHash } from "./router";

function resolve(path: string) {
  if (path === "/") return { el: <Home />, title: `${site.name}. ${site.tagline} | Горбилет` };
  if (path === "/o-proekte") return { el: <About />, title: `О проекте | ${site.name}` };
  if (path === "/kontakty") return { el: <Contacts />, title: `Контакты | ${site.name}` };
  const m = path.match(/^\/goroda\/([\w-]+)$/);
  const city = m ? getCity(m[1]) : undefined;
  if (city && city.kind === "list")
    return { el: <CityView key={city.slug} city={city} />, title: `Новый год ${city.inName} | ${site.name}` };
  return { el: <NotFound />, title: `Страница не найдена | ${site.name}` };
}

function App() {
  const { path, anchor } = parse(useHash());
  const { el, title } = resolve(path);

  useEffect(() => {
    document.title = title;
  }, [title]);

  // при смене страницы наверх, при якоре к нужному блоку
  useEffect(() => {
    if (!anchor) {
      window.scrollTo({ top: 0 });
      return;
    }
    const t = setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" }), 60);
    return () => clearTimeout(t);
  }, [path, anchor]);

  return (
    <>
      <Header />
      <main id="main" className="flex-1" key={path}>
        {el}
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
