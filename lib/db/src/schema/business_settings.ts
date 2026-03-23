import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const businessSettingsTable = pgTable("business_settings", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull().default("EcoBright Lights"),
  tagline: text("tagline").notNull().default("Powering Brighter, Smarter, Greener Living"),
  address: text("address").notNull().default("13, 7th Floor, H Latesh Apartment, Near Handloom House, Nanpura, Surat, Gujarat"),
  phone1: text("phone1").notNull().default("9601067777"),
  phone2: text("phone2").notNull().default("9099100070"),
  whatsapp: text("whatsapp").notNull().default("919601067777"),
  email: text("email").notNull().default("info@ecobrightlights.com"),
  logoUrl: text("logo_url").notNull().default("/logo-default.svg"),
  mapEmbed: text("map_embed").notNull().default("https://maps.google.com/maps?q=Handloom+House+Nanpura+Surat+Gujarat&output=embed"),
});

export const insertBusinessSettingsSchema = createInsertSchema(businessSettingsTable).omit({ id: true });
export type InsertBusinessSettings = z.infer<typeof insertBusinessSettingsSchema>;
export type BusinessSettings = typeof businessSettingsTable.$inferSelect;
