/** URL publique du site (APP_URL dans .env) : liens absolus du partage social, du sitemap et de robots.txt. */
export const siteUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
