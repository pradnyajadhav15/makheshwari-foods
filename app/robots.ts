export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/checkout", "/cart"] }],
    sitemap: "https://makheshwarifoods.com/sitemap.xml",
  };
}