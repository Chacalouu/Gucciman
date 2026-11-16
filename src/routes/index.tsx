import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import appHtml from "../../public/gucciman.html?raw";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  useEffect(() => {
    let cancel = false;
    const timer = window.setTimeout(() => {
      if (cancel) return;
      const existing = document.getElementById("gucci-root");
      const stamp = "live4-" + String(appHtml.length);
      if (existing && existing.getAttribute("data-stamp") === stamp) return;
      if (existing) {
        window.location.reload();
        return;
      }
      mountGucciman(appHtml);
      const host = document.getElementById("gucci-root");
      if (host) host.setAttribute("data-stamp", stamp);
    }, 0);
    return () => {
      cancel = true;
      window.clearTimeout(timer);
    };
  }, [appHtml]);

  return (
    <div className="boot-screen">
      <p className="boot-mark">GUCCIMAN</p>
      <p className="boot-sub">Matchs · Favoris · Classement</p>
    </div>
  );
}

function mountGucciman(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const style = doc.querySelector("style");
  if (style && !document.getElementById("gucci-css")) {
    const el = document.createElement("style");
    el.id = "gucci-css";
    el.textContent = (style.textContent || "") + "\n#gucci-root{position:fixed;inset:0;z-index:1;background:#000;height:100dvh;}#gucci-root>#app{height:100%;}";
    document.head.appendChild(el);
  }
  const app = doc.getElementById("app");
  const host = document.createElement("div");
  host.id = "gucci-root";
  if (app) host.appendChild(document.importNode(app, true));
  document.body.appendChild(host);
  const code = [...doc.querySelectorAll("script")].map((s) => s.textContent || "").join("\n");
  const script = document.createElement("script");
  script.textContent = code;
  document.body.appendChild(script);
}
