import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db/schema";
import { GetProductsQueryParams } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/products", async (req, res) => {
  const query = GetProductsQueryParams.parse(req.query);
  let products;
  if (query.category) {
    products = await db.select().from(productsTable).where(eq(productsTable.category, query.category));
  } else {
    products = await db.select().from(productsTable);
  }
  res.json(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
      description: p.description,
      imageUrl: p.imageUrl,
      rating: Number(p.rating),
      reviewCount: p.reviewCount,
      inStock: p.inStock,
      badge: p.badge ?? undefined,
    }))
  );
});

export default router;
