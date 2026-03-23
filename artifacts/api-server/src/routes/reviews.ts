import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { reviewsTable } from "@workspace/db/schema";
import { CreateReviewBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/reviews", async (_req, res) => {
  const reviews = await db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt));
  res.json(
    reviews.map((r) => ({
      id: r.id,
      customerName: r.customerName,
      rating: r.rating,
      reviewText: r.reviewText,
      createdAt: r.createdAt.toISOString(),
    }))
  );
});

router.post("/reviews", async (req, res) => {
  const body = CreateReviewBody.parse(req.body);
  const [review] = await db
    .insert(reviewsTable)
    .values({
      customerName: body.customerName,
      rating: body.rating,
      reviewText: body.reviewText,
    })
    .returning();
  res.status(201).json({
    id: review.id,
    customerName: review.customerName,
    rating: review.rating,
    reviewText: review.reviewText,
    createdAt: review.createdAt.toISOString(),
  });
});

export default router;
