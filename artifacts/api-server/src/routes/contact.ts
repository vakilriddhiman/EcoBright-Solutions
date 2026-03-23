import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactsTable } from "@workspace/db/schema";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const body = SubmitContactBody.parse(req.body);
  await db.insert(contactsTable).values({
    name: body.name,
    phone: body.phone,
    message: body.message,
  });
  res.status(201).json({ success: true, message: "Thank you for contacting us! We will get back to you soon." });
});

export default router;
