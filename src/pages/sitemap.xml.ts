import type { APIRoute } from "astro";
import { site } from "../data/site";

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export const GET: APIRoute = () => {
  const urls = site.indexing === "indexable"
    ? site.pages
        .filter((page) => page.indexableWhenLaunched)
        .map((page) => `  <url><loc>${escapeXml(new URL(page.path, site.origin).href)}</loc></url>`)
        .join("\n")
    : "";

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    ""
  ].filter((line) => line !== "").join("\n");

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
};
