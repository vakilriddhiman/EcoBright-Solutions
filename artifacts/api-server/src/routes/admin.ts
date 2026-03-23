import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { productsTable, businessSettingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// Setup multer for file uploads
const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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

// POST /api/admin/upload
router.post("/admin/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const url = `/api/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

export default router;
