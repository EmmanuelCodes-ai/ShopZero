import crypto from "node:crypto";
import express, { type Request, type Response } from "express";
import { db } from "@shop-zero/database";

const app = express();
const { WHATSAPP_VERIFY_TOKEN, WHATSAPP_APP_SECRET, WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;
app.use(express.json({ verify: (req, _, buffer) => { (req as Request & { rawBody?: Buffer }).rawBody = buffer; } }));

app.get("/webhooks/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"], token = req.query["hub.verify_token"], challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) return res.status(200).send(challenge);
  return res.sendStatus(403);
});

app.post("/webhooks/whatsapp", async (req: Request & { rawBody?: Buffer }, res: Response) => {
  const signature = req.header("x-hub-signature-256");
  const expected = `sha256=${crypto.createHmac("sha256", WHATSAPP_APP_SECRET ?? "").update(req.rawBody ?? "").digest("hex")}`;
  if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return res.sendStatus(401);
  res.sendStatus(200); // acknowledge Meta first; process asynchronously in production via a queue
  const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return;
  await handleMessage(message);
});

async function handleMessage(message: { from: string; type: string; text?: { body: string }; interactive?: { button_reply?: { id: string; title: string }; list_reply?: { id: string; title: string } } }) {
  const waId = message.from;
  const text = message.text?.body?.trim() ?? message.interactive?.button_reply?.id ?? message.interactive?.list_reply?.id ?? "";
  const customer = await db.user.upsert({ where: { phone: waId }, update: {}, create: { phone: waId } });
  await db.botSession.upsert({ where: { waId }, update: { userId: customer.id }, create: { waId, userId: customer.id } });
  if (/^(hi|hello|menu|start)$/i.test(text)) return sendText(waId, "Welcome to Shop Zero! Reply with what you need (e.g. 'wireless headphones') or type DEALS.");
  if (/^deals$/i.test(text)) return sendText(waId, "Today's flash deals are loading. Reply with a product name to search.");
  const matches = await db.product.findMany({ where: { status: "ACTIVE", title: { contains: text, mode: "insensitive" } }, include: { variants: { include: { offers: { where: { active: true }, take: 1 } } }, take: 3 } });
  if (!matches.length) return sendText(waId, "I couldn't find that yet. Try a brand, category, or a simpler search term.");
  const lines = matches.map((p, i) => `${i + 1}. ${p.title} — ${p.variants[0]?.offers[0]?.price ?? "Price unavailable"}`).join("\n");
  return sendText(waId, `Here are the best matches:\n${lines}\n\nReply with the number to add it to your cart.`);
}

async function sendText(to: string, body: string) {
  await fetch(`https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, { method: "POST", headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body } }) });
}

app.listen(process.env.PORT ?? 4000, () => console.log("WhatsApp webhook listening on :4000"));
