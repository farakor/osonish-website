import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://osonish.uz";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/orders`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/vacancies`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // TODO: Add dynamic pages (orders, vacancies, profiles) from database
  // const orders = await getOrders({ limit: 1000 });
  // const orderPages = orders.map((order) => ({
  //   url: `${baseUrl}/orders/${order.id}`,
  //   lastModified: new Date(order.updatedAt),
  //   changeFrequency: 'daily' as const,
  //   priority: 0.8,
  // }));

  return [...staticPages];
}

