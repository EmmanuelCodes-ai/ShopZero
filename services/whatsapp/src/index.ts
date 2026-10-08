import crypto from "node:crypto";
import express, { type Request, type Response } from "express";
import { db } from "@shop-zero/database";

const app = express();
const {
  WHATSAPP_VERIFY_TOKEN = "shopzero_whatsapp_token_2026",
  WHATSAPP_APP_SECRET,
  WHATSAPP_ACCESS_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID,
} = process.env;

app.use(
  express.json({
    verify: (req, _, buffer) => {
      (req as Request & { rawBody?: Buffer }).rawBody = buffer;
    },
  })
);

app.get("/webhooks/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post("/webhooks/whatsapp", async (req: Request & { rawBody?: Buffer }, res: Response) => {
  const signature = req.header("x-hub-signature-256");
  if (WHATSAPP_APP_SECRET && signature) {
    const expected = `sha256=${crypto
      .createHmac("sha256", WHATSAPP_APP_SECRET)
      .update(req.rawBody ?? "")
      .digest("hex")}`;
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return res.sendStatus(401);
    }
  }

  res.sendStatus(200); // Acknowledge Meta immediately
  const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return;
  await handleMessage(message);
});

async function handleMessage(message: any) {
  const waId = message.from;
  const messageType = message.type;
  const rawText =
    message.text?.body?.trim() ??
    message.interactive?.button_reply?.id ??
    message.interactive?.list_reply?.id ??
    "";

  // 1. Automatic User Signup by Phone Number
  let user = await db.user.findFirst({
    where: { phone: waId },
    include: { vendor: true },
  });

  let isNewUser = false;
  if (!user) {
    user = await db.user.create({
      data: { phone: waId, role: "CUSTOMER" },
      include: { vendor: true },
    });
    isNewUser = true;
  }

  // 2. Bot Session Tracking
  const session = await db.botSession.upsert({
    where: { waId },
    update: { userId: user.id },
    create: { waId, userId: user.id, state: isNewUser ? { step: "ASK_NAME" } : {} },
  });

  const state = (session.state as Record<string, any>) || {};

  // Ask for Name on First Message
  if (isNewUser || state.step === "ASK_NAME") {
    if (isNewUser) {
      await db.botSession.update({ where: { waId }, data: { state: { step: "ASK_NAME" } } });
      return sendText(
        waId,
        `🛍️ *Welcome to ShopZero Nigeria!*\n\nYour account has been created with this number (+${waId}).\n\nWhat is your *full name*?`
      );
    }

    await db.user.update({ where: { id: user.id }, data: { displayName: rawText } });
    await db.botSession.update({ where: { waId }, data: { state: { step: "MAIN_MENU" } } });
    return sendText(
      waId,
      `Great to meet you, *${rawText}*! 🎉\n\n• Type *DEALS* for flash sales\n• Type any product name to search\n• Type *SELLER* to create your store and post items from WhatsApp!`
    );
  }

  // Main Menu
  if (/^(hi|hello|menu|start|help)$/i.test(rawText)) {
    const isVendor = user.role === "VENDOR" || !!user.vendor;
    const vendorPrompt = isVendor
      ? `\n🏪 *Vendor Commands:*\n• Send a *photo* or type *POST* to add an item\n• Type *MYSTORE* to view your store link`
      : `\n🏪 Type *SELLER* to start selling on ShopZero`;
    return sendText(
      waId,
      `🛍️ *ShopZero Menu*\n\n• Type *DEALS* for discounts\n• Type any item to search${vendorPrompt}\n\nVisit: https://shop-zero-inky.vercel.app`
    );
  }

  // Seller Onboarding
  if (/^(seller|vendor|sell)$/i.test(rawText)) {
    if (user.vendor) {
      return sendText(
        waId,
        `Your store *${user.vendor.name}* is live! 🔗 https://shop-zero-inky.vercel.app/store/${user.vendor.slug}\n\nTo post a product, simply **send a photo** or type:\n*POST: Title | Price | Category | Stock*`
      );
    }
    await db.botSession.update({ where: { waId }, data: { state: { step: "ASK_STORE_NAME" } } });
    return sendText(
      waId,
      `🏪 *Open Your Merchant Store*\n\nWhat is your *Store / Business Name*? (e.g. *Lagos Gadget Hub*)`
    );
  }

  if (state.step === "ASK_STORE_NAME") {
    const storeName = rawText;
    const slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const vendor = await db.vendor.create({
      data: {
        userId: user.id,
        name: storeName,
        slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
        active: true,
      },
    });
    await db.user.update({ where: { id: user.id }, data: { role: "VENDOR", storeName } });
    await db.botSession.update({ where: { waId }, data: { state: { step: "MAIN_MENU" } } });
    return sendText(
      waId,
      `🎉 *Store Created!*\n\n🏪 *Store Name:* ${vendor.name}\n🔗 *Store URL:* https://shop-zero-inky.vercel.app/store/${vendor.slug}\n\nTo add products, simply **send a photo** or type:\n*POST: Product Name | Price | Category | Stock*`
    );
  }

  // Fast Product Posting Format
  if (/^post:\s*/i.test(rawText) || /^add:\s*/i.test(rawText)) {
    const parts = rawText.replace(/^(post|add):\s*/i, "").split("|").map((p: string) => p.trim());
    if (parts.length < 2) {
      return sendText(
        waId,
        `⚠️ Use format: *POST: Title | Price | Category | Stock*\n\nExample:\n*POST: Nike Air Jordan 4 | 65000 | Fashion | 3*`
      );
    }
    const [title, rawPrice, cat, rawStock] = parts;
    const price = parseFloat(rawPrice.replace(/[^0-9.]/g, ""));
    const stock = parseInt(rawStock || "1", 10);
    return await publishProduct(waId, user, title, price, cat || "General", stock);
  }

  // Photo Product Posting
  if (messageType === "image") {
    if (!user.vendor && user.role !== "VENDOR") {
      return sendText(waId, `📸 To post products for sale, register as a vendor first by typing *SELLER*.`);
    }
    await db.botSession.update({
      where: { waId },
      data: { step: "POST_TITLE", pendingProduct: { image: message.image?.id } },
    });
    return sendText(waId, `📸 *Product photo received!*\n\nWhat is the *title/name* of this product?`);
  }

  // View My Store
  if (/^mystore$/i.test(rawText)) {
    if (!user.vendor) return sendText(waId, "Type *SELLER* to create your store first!");
    return sendText(
      waId,
      `🏪 *Your Store:* ${user.vendor.name}\n🔗 https://shop-zero-inky.vercel.app/store/${user.vendor.slug}`
    );
  }

  // Deals Search
  if (/^deals$/i.test(rawText)) {
    return sendText(
      waId,
      `🔥 Browse today's flash sale deals: https://shop-zero-inky.vercel.app/deals`
    );
  }

  // General Search
  const matches = await db.product.findMany({
    where: { status: "ACTIVE", title: { contains: rawText, mode: "insensitive" } },
    include: { variants: { include: { offers: { where: { active: true }, take: 1 } } } },
    take: 3,
  });

  if (!matches.length) {
    return sendText(waId, `I couldn't find "${rawText}". Try searching for another item or visit https://shop-zero-inky.vercel.app`);
  }

  const lines = matches
    .map(
      (p, i) =>
        `${i + 1}. *${p.title}* — ₦${Number(p.variants[0]?.offers[0]?.price ?? 0).toLocaleString()}`
    )
    .join("\n");
  return sendText(waId, `✨ Top matches for "${rawText}":\n\n${lines}`);
}

async function publishProduct(
  waId: string,
  user: any,
  title: string,
  price: number,
  categoryName: string,
  stock: number
) {
  let vendor = user.vendor;
  if (!vendor) {
    vendor = await db.vendor.create({
      data: {
        userId: user.id,
        name: user.displayName ? `${user.displayName}'s Store` : "Merchant Store",
        slug: `store-${Math.floor(10000 + Math.random() * 90000)}`,
        active: true,
      },
    });
  }

  const catSlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const category = await db.category.upsert({
    where: { slug: catSlug || "general" },
    update: {},
    create: { name: categoryName, slug: catSlug || "general" },
  });

  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.floor(100 + Math.random() * 900)}`;
  const product = await db.product.create({
    data: {
      title,
      slug,
      status: "ACTIVE",
      categoryId: category.id,
      variants: {
        create: {
          sku: `SKU-${Date.now().toString(36).toUpperCase()}`,
          name: "Standard",
          images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"],
          offers: {
            create: {
              vendorId: vendor.id,
              price,
              currency: "NGN",
              active: true,
              inventory: { create: { onHand: stock || 1 } },
            },
          },
        },
      },
    },
  });

  return sendText(
    waId,
    `🚀 *PRODUCT PUBLISHED!*\n\n📦 *Title:* ${product.title}\n💰 *Price:* ₦${price.toLocaleString()}\n📂 *Category:* ${categoryName}\n📊 *Stock:* ${stock}\n\n🔗 *Live Store:* https://shop-zero-inky.vercel.app/store/${vendor.slug}`
  );
}

async function sendText(to: string, body: string) {
  if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
    console.log(`[WhatsApp Bot Simulation] To: ${to}\n${body}`);
    return;
  }
  await fetch(`https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body } }),
  });
}

app.listen(process.env.PORT ?? 4000, () => console.log("WhatsApp webhook listening on :4000"));
