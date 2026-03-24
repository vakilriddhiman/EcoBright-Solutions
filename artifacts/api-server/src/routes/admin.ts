import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { db } from "@workspace/db";
import { productsTable, businessSettingsTable, reviewsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { objectStorageClient } from "../lib/objectStorage";

const router: IRouter = Router();

// Multer uses memory storage — files are uploaded to GCS, not local disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Helper to map product row to response shape
function mapProduct(p: typeof productsTable.$inferSelect) {
  return {
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
  };
}

// GET /api/admin/settings
router.get("/admin/settings", async (_req, res) => {
  let settings = await db.select().from(businessSettingsTable).limit(1);
  if (settings.length === 0) {
    const [created] = await db.insert(businessSettingsTable).values({}).returning();
    settings = [created];
  }
  res.json(settings[0]);
});

// PUT /api/admin/settings
router.put("/admin/settings", async (req, res) => {
  const { businessName, tagline, address, phone1, phone2, whatsapp, email, logoUrl, mapEmbed } = req.body;
  let existing = await db.select().from(businessSettingsTable).limit(1);
  if (existing.length === 0) {
    const [created] = await db.insert(businessSettingsTable).values({}).returning();
    existing = [created];
  }
  const id = existing[0].id;
  const updateData: Record<string, unknown> = {};
  if (businessName !== undefined) updateData.businessName = businessName;
  if (tagline !== undefined) updateData.tagline = tagline;
  if (address !== undefined) updateData.address = address;
  if (phone1 !== undefined) updateData.phone1 = phone1;
  if (phone2 !== undefined) updateData.phone2 = phone2;
  if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
  if (email !== undefined) updateData.email = email;
  if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
  if (mapEmbed !== undefined) updateData.mapEmbed = mapEmbed;

  const [updated] = await db.update(businessSettingsTable).set(updateData).where(eq(businessSettingsTable.id, id)).returning();
  res.json(updated);
});

// GET /api/admin/products
router.get("/admin/products", async (_req, res) => {
  const products = await db.select().from(productsTable);
  res.json(products.map(mapProduct));
});

// POST /api/admin/products
router.post("/admin/products", async (req, res) => {
  const { name, category, price, originalPrice, description, imageUrl, rating, reviewCount, inStock, badge } = req.body;
  const [product] = await db.insert(productsTable).values({
    name,
    category,
    price: String(price),
    originalPrice: originalPrice ? String(originalPrice) : null,
    description,
    imageUrl,
    rating: String(rating ?? 4.5),
    reviewCount: reviewCount ?? 0,
    inStock: inStock ?? true,
    badge: badge ?? null,
  }).returning();
  res.status(201).json(mapProduct(product));
});

// PUT /api/admin/products/:id
router.put("/admin/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, category, price, originalPrice, description, imageUrl, rating, reviewCount, inStock, badge } = req.body;
  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = name;
  if (category !== undefined) updateData.category = category;
  if (price !== undefined) updateData.price = String(price);
  if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? String(originalPrice) : null;
  if (description !== undefined) updateData.description = description;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
  if (rating !== undefined) updateData.rating = String(rating);
  if (reviewCount !== undefined) updateData.reviewCount = reviewCount;
  if (inStock !== undefined) updateData.inStock = inStock;
  if (badge !== undefined) updateData.badge = badge || null;

  const [updated] = await db.update(productsTable).set(updateData).where(eq(productsTable.id, id)).returning();
  res.json(mapProduct(updated));
});

// DELETE /api/admin/products/:id
router.delete("/admin/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.json({ success: true, message: "Product deleted successfully" });
});

// GET /api/admin/reviews
router.get("/admin/reviews", async (_req, res) => {
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

// DELETE /api/admin/reviews/:id
router.delete("/admin/reviews/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
  res.json({ success: true, message: "Review deleted successfully" });
});

// Helper: get GCS bucket name and prefix from PRIVATE_OBJECT_DIR env var
function getGCSBucket() {
  const dir = process.env.PRIVATE_OBJECT_DIR || "";
  if (!dir) throw new Error("PRIVATE_OBJECT_DIR not set");
  const parts = dir.replace(/^\//, "").split("/");
  const bucketName = parts[0];
  const prefix = parts.slice(1).join("/") || "uploads";
  return { bucket: objectStorageClient.bucket(bucketName), prefix };
}

// POST /api/admin/upload — upload image to GCS (persistent across deployments)
router.post("/admin/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  try {
    const { bucket, prefix } = getGCSBucket();
    const ext = path.extname(req.file.originalname).toLowerCase() || ".jpg";
    const objectId = `${randomUUID()}${ext}`;
    const gcsFile = bucket.file(`${prefix}/uploads/${objectId}`);

    await gcsFile.save(req.file.buffer, {
      contentType: req.file.mimetype,
      metadata: { cacheControl: "public, max-age=31536000" },
    });

    const url = `/api/uploads/${objectId}`;
    res.json({ url, filename: objectId });
  } catch (err) {
    console.error("GCS upload error:", err);
    res.status(500).json({ error: "Upload to cloud storage failed" });
  }
});

// GET /api/uploads/:id — serve image from GCS
router.get("/uploads/:id", async (req, res) => {
  try {
    const { bucket, prefix } = getGCSBucket();
    const gcsFile = bucket.file(`${prefix}/uploads/${req.params.id}`);
    const [exists] = await gcsFile.exists();
    if (!exists) {
      res.status(404).json({ error: "Image not found" });
      return;
    }
    const [metadata] = await gcsFile.getMetadata();
    res.setHeader("Content-Type", (metadata.contentType as string) || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000");
    gcsFile.createReadStream().pipe(res);
  } catch (err) {
    console.error("GCS serve error:", err);
    res.status(500).json({ error: "Failed to serve image" });
  }
});

export default router;
