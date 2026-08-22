import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const isIndexableHtmlPage = (page) => {
  const url = new URL(page);
  const pathname = url.pathname.replace(/\/$/, "") || "/";
  return url.origin === "https://seo-ai-agent.de"
    && pathname !== "/404"
    && !/\.(?:json|txt|xml)$/i.test(pathname);
};

export default defineConfig({
  site: "https://seo-ai-agent.de/",
  output: "static",
  trailingSlash: "ignore",
  integrations: [
    sitemap({
      filter: isIndexableHtmlPage,
      serialize: (item) => {
        const url = new URL(item.url);
        if (url.pathname !== "/" && url.pathname.endsWith("/")) {
          url.pathname = url.pathname.slice(0, -1);
        }
        return { ...item, url: url.href };
      },
      namespaces: { news: false, xhtml: false, image: false, video: false },
    }),
  ],
});


