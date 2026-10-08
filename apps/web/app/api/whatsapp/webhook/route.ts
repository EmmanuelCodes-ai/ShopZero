import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "../../../../lib/prisma";

const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "shopzero_whatsapp_token_2026";
const WHATSAPP_APP_SECRET = process.env.WHATSAPP_APP_SECRET;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

/**
 * Meta Webhook Verification Handshake (GET)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification token mismatch" }, { status: 403 });
}

/**
 * Meta Incoming Webhook Handler (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // Verify HMAC SHA256 signature if secret is provided
    if (WHATSAPP_APP_SECRET) {
      const signature = req.headers.get("x-hub-signature-256");
      const expected = `sha256=${crypto
        .createHmac("sha256", WHATSAPP_APP_SECRET)
        .update(rawBody)
        .digest("hex")}`;

      if (!signature || signature !== expected) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const message = payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return NextResponse.json({ status: "acknowledged_no_message" });
    }

    // Process message
    await handleWhatsAppMessage(message);

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("WhatsApp Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Core WhatsApp Conversational Commerce Engine
 */
async function handleWhatsAppMessage(message: any) {
  const waId = message.from; // Phone number e.g. "2348012345678"
  const messageType = message.type;
  const rawText =
    message.text?.body?.trim() ??
    message.interactive?.button_reply?.id ??
    message.interactive?.list_reply?.id ??
    "";

  // 1. Find or create User by phone number (Instant User Signup)
  let user = await prisma.user.findFirst({
    where: { phone: waId },
  });

  let isNewUser = false;
  if (!user) {
    user = await prisma.user.create({
      data: {
        phone: waId,
        role: "CUSTOMER",
      },
    });
    isNewUser = true;
  }

  // Fetch associated vendor if user has storeName
  let vendor = user.storeName
    ? await prisma.vendor.findFirst({ where: { name: user.storeName } })
    : null;

  // 2. Load or create Bot Session State
  let session = await prisma.botSession.findUnique({
    where: { waId },
  });

  if (!session) {
    session = await prisma.botSession.create({
      data: {
        waId,
        userId: user.id,
        state: isNewUser ? { step: "ASK_NAME" } : {},
      },
    });
  }

  const state = (session.state as Record<string, any>) || {};

  // -------------------------------------------------------------
  // NEW USER ONBOARDING: Ask Name
  // -------------------------------------------------------------
  if (isNewUser || state.step === "ASK_NAME") {
    if (isNewUser) {
      await updateSessionState(waId, { step: "ASK_NAME" });
      return sendWhatsAppText(
        waId,
        `🛍️ *Welcome to ShopZero Nigeria!*\n\nYour account has been automatically created with this phone number (+${waId}).\n\nWhat is your *full name*?`
      );
    }

    // User replied with their name
    const fullName = rawText;
    await prisma.user.update({
      where: { id: user.id },
      data: { displayName: fullName },
    });
    await updateSessionState(waId, { step: "MAIN_MENU" });

    return sendWhatsAppText(
      waId,
      `Awesome to have you, *${fullName}*! 🎉\n\nWhat would you like to do today?\n\n1️⃣ Type *DEALS* to view flash sale discounts\n2️⃣ Type any product name (e.g. *Sneakers*, *iPhone*) to search\n3️⃣ Type *SELLER* to create your store and post products directly from WhatsApp\n\nOr browse our full marketplace at https://shop-zero-inky.vercel.app`
    );
  }

  // -------------------------------------------------------------
  // COMMAND: Reset / Menu
  // -------------------------------------------------------------
  if (/^(menu|start|hi|hello|help)$/i.test(rawText)) {
    await updateSessionState(waId, { step: "MAIN_MENU" });
    const isVendor = user.role === "VENDOR" || !!vendor;
    const vendorMenu = isVendor
      ? `\n🏪 *Vendor Commands:*\n• Send a *photo* or type *POST* to add an item\n• Type *MYSTORE* to view your store link`
      : `\n🏪 Type *SELLER* to start selling on ShopZero`;

    return sendWhatsAppText(
      waId,
      `🛍️ *ShopZero Menu*\n\n• Type *DEALS* for today's discounts\n• Type any product name to search${vendorMenu}\n\nVisit: https://shop-zero-inky.vercel.app`
    );
  }

  // -------------------------------------------------------------
  // VENDOR ONBOARDING: Register store via WhatsApp
  // -------------------------------------------------------------
  if (/^(seller|vendor|sell)$/i.test(rawText)) {
    if (vendor) {
      return sendWhatsAppText(
        waId,
        `You're already registered as a vendor with *${vendor.name}*! 🎉\n\n🔗 *Store Link:* https://shop-zero-inky.vercel.app/store/${vendor.slug}\n\nTo post a new product, simply **send a photo of your item** or type:\n*POST: Product Name | Price | Category | Stock*`
      );
    }

    await updateSessionState(waId, { step: "ASK_STORE_NAME" });
    return sendWhatsAppText(
      waId,
      `🏪 *Open Your Merchant Store on ShopZero*\n\nSell to over 500,000 shoppers across Nigeria with 0% commission for your first 30 days.\n\nWhat is your *Store / Business Name*? (e.g. *Lagos Gadget Hub*)`
    );
  }

  if (state.step === "ASK_STORE_NAME") {
    const storeName = rawText;
    const baseSlug = storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const generatedSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Vendor and update User role & storeName
    const newVendor = await prisma.vendor.create({
      data: {
        name: storeName,
        slug: generatedSlug,
        active: true,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: "VENDOR",
        storeName: storeName,
      },
    });

    await updateSessionState(waId, { step: "MAIN_MENU" });

    return sendWhatsAppText(
      waId,
      `🎉 *Congratulations! Your store is live!*\n\n🏪 *Store Name:* ${newVendor.name}\n🔗 *Store URL:* https://shop-zero-inky.vercel.app/store/${newVendor.slug}\n\n📸 *Post Your First Product Now:*\nSimply **send a photo** of your product, or type:\n*POST: Title | Price | Category | Stock*\n\nExample:\n_POST: Wireless Earbuds | 18500 | Electronics | 5_`
    );
  }

  // -------------------------------------------------------------
  // VENDOR PRODUCT POSTING: Quick One-Line Command
  // Format: POST: Title | Price | Category | Stock
  // -------------------------------------------------------------
  if (/^post:\s*/i.test(rawText) || /^add:\s*/i.test(rawText)) {
    const cleanCmd = rawText.replace(/^(post|add):\s*/i, "").trim();
    const parts = cleanCmd.split("|").map((p: string) => p.trim());

    if (parts.length < 2) {
      return sendWhatsAppText(
        waId,
        `⚠️ *Invalid Format*\n\nPlease use:\n*POST: Title | Price | Category | Stock*\n\nExample:\n*POST: Nike Air Jordan 4 | 65000 | Fashion | 3*`
      );
    }

    const title = parts[0];
    const price = parseFloat(parts[1].replace(/[^0-9.]/g, ""));
    const categoryName = parts[2] || "General";
    const stock = parseInt(parts[3] || "1", 10);

    if (isNaN(price) || price <= 0) {
      return sendWhatsAppText(waId, "⚠️ Please provide a valid price (e.g. 45000).");
    }

    return await createAndPublishProduct(waId, user, vendor, {
      title,
      price,
      categoryName,
      stock,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    });
  }

  // -------------------------------------------------------------
  // VENDOR PRODUCT POSTING: Photo Received Flow
  // -------------------------------------------------------------
  if (messageType === "image") {
    const isVendor = user.role === "VENDOR" || !!vendor;
    if (!isVendor) {
      return sendWhatsAppText(
        waId,
        `📸 Nice photo! To post products on ShopZero, register as a seller first by typing *SELLER*.`
      );
    }

    // Save image ID / media state
    const imageId = message.image?.id;
    await updateSessionState(waId, {
      step: "POST_PRODUCT_TITLE",
      pendingProduct: {
        imageId,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      },
    });

    return sendWhatsAppText(
      waId,
      `📸 *Product photo received!*\n\nWhat is the *title/name* of this product?`
    );
  }

  // Multi-step product posting state machine
  if (state.step === "POST_PRODUCT_TITLE") {
    const title = rawText;
    const pending = state.pendingProduct || {};
    pending.title = title;

    await updateSessionState(waId, {
      step: "POST_PRODUCT_PRICE",
      pendingProduct: pending,
    });

    return sendWhatsAppText(
      waId,
      `Great! What is the *price in Naira (₦)* for *"${title}"*?\n(e.g. 25000)`
    );
  }

  if (state.step === "POST_PRODUCT_PRICE") {
    const price = parseFloat(rawText.replace(/[^0-9.]/g, ""));
    if (isNaN(price) || price <= 0) {
      return sendWhatsAppText(waId, "⚠️ Please enter a valid number for the price (e.g. 35000).");
    }

    const pending = state.pendingProduct || {};
    pending.price = price;

    await updateSessionState(waId, {
      step: "POST_PRODUCT_CATEGORY",
      pendingProduct: pending,
    });

    return sendWhatsAppText(
      waId,
      `Price set to *₦${price.toLocaleString()}*.\n\nWhich *category* does this belong to?\n1️⃣ Phones & Tablets\n2️⃣ Electronics & Audio\n3️⃣ Fashion & Apparel\n4️⃣ Home & Living\n5️⃣ Groceries\n\n(Reply with the number or category name)`
    );
  }

  if (state.step === "POST_PRODUCT_CATEGORY") {
    const catMap: Record<string, string> = {
      "1": "Phones & Tablets",
      "2": "Electronics & Audio",
      "3": "Fashion & Apparel",
      "4": "Home & Living",
      "5": "Groceries",
    };
    const categoryName = catMap[rawText] || rawText || "General";
    const pending = state.pendingProduct || {};
    pending.categoryName = categoryName;

    await updateSessionState(waId, {
      step: "POST_PRODUCT_STOCK",
      pendingProduct: pending,
    });

    return sendWhatsAppText(
      waId,
      `Category: *${categoryName}*.\n\nLastly, how many units do you have in *stock*? (e.g. 5)`
    );
  }

  if (state.step === "POST_PRODUCT_STOCK") {
    const stock = parseInt(rawText.replace(/[^0-9]/g, "") || "1", 10);
    const pending = state.pendingProduct || {};
    pending.stock = stock;

    await updateSessionState(waId, { step: "MAIN_MENU", pendingProduct: null });

    return await createAndPublishProduct(waId, user, vendor, pending);
  }

  // -------------------------------------------------------------
  // VENDOR STORE LINK: MYSTORE
  // -------------------------------------------------------------
  if (/^mystore$/i.test(rawText)) {
    if (!vendor) {
      return sendWhatsAppText(waId, "You haven't set up a store yet. Type *SELLER* to create one!");
    }
    return sendWhatsAppText(
      waId,
      `🏪 *Your Store:* ${vendor.name}\n🔗 *Link:* https://shop-zero-inky.vercel.app/store/${vendor.slug}\n\nShare this link on your WhatsApp status and Instagram to receive direct orders!`
    );
  }

  // -------------------------------------------------------------
  // BUYER FLOW: Search or Deals
  // -------------------------------------------------------------
  if (/^deals$/i.test(rawText)) {
    const deals = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      take: 4,
      include: {
        variants: {
          include: {
            offers: { where: { active: true }, take: 1 },
          },
        },
      },
    });

    if (!deals.length) {
      return sendWhatsAppText(
        waId,
        "🔥 Check out today's top flash deals directly on our site: https://shop-zero-inky.vercel.app/deals"
      );
    }

    const lines = deals.map((p, i) => {
      const price = p.variants[0]?.offers[0]?.price
        ? `₦${Number(p.variants[0].offers[0].price).toLocaleString()}`
        : "Price on request";
      return `${i + 1}️⃣ *${p.title}* — ${price}`;
    });

    return sendWhatsAppText(
      waId,
      `🔥 *Today's Top Deals on ShopZero:*\n\n${lines.join("\n")}\n\n🔗 View all: https://shop-zero-inky.vercel.app/deals`
    );
  }

  // General Product Search
  const matches = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      title: { contains: rawText, mode: "insensitive" },
    },
    take: 3,
    include: {
      variants: {
        include: {
          offers: { where: { active: true }, take: 1 },
        },
      },
    },
  });

  if (!matches.length) {
    return sendWhatsAppText(
      waId,
      `🔍 Couldn't find "${rawText}".\n\nTry searching by brand or category (e.g. *Samsung*, *Sneakers*, *Headphones*), or visit https://shop-zero-inky.vercel.app`
    );
  }

  const lines = matches.map((p, i) => {
    const price = p.variants[0]?.offers[0]?.price
      ? `₦${Number(p.variants[0].offers[0].price).toLocaleString()}`
      : "₦0";
    return `${i + 1}️⃣ *${p.title}* — ${price}\n🔗 https://shop-zero-inky.vercel.app/c/product`;
  });

  return sendWhatsAppText(
    waId,
    `✨ *Here's what I found for "${rawText}":*\n\n${lines.join("\n\n")}`
  );
}

/**
 * Creates and publishes a product to the vendor's store
 */
async function createAndPublishProduct(
  waId: string,
  user: any,
  existingVendor: any,
  data: {
    title: string;
    price: number;
    categoryName: string;
    stock: number;
    imageUrl?: string;
  }
) {
  let vendor = existingVendor;
  if (!vendor) {
    const storeName = user.displayName ? `${user.displayName}'s Store` : "Merchant Store";
    const slug = `store-${Math.floor(10000 + Math.random() * 90000)}`;
    vendor = await prisma.vendor.create({
      data: {
        name: storeName,
        slug,
        active: true,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: "VENDOR",
        storeName: storeName,
      },
    });
  }

  // Ensure category exists
  const catSlug = data.categoryName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const category = await prisma.category.upsert({
    where: { slug: catSlug || "general" },
    update: {},
    create: {
      name: data.categoryName,
      slug: catSlug || "general",
    },
  });

  const productSlug = `${data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}-${Math.floor(100 + Math.random() * 900)}`;

  // Create Product, Variant, Offer, and Inventory
  const product = await prisma.product.create({
    data: {
      title: data.title,
      slug: productSlug,
      description: `Authentic ${data.title} sold by verified merchant ${vendor.name} on ShopZero.`,
      status: "ACTIVE",
      categoryId: category.id,
      variants: {
        create: {
          sku: `SKU-${Date.now().toString(36).toUpperCase()}`,
          name: "Standard",
          images: [data.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"],
          offers: {
            create: {
              vendorId: vendor.id,
              price: data.price,
              currency: "NGN",
              active: true,
              inventory: {
                create: {
                  onHand: data.stock || 1,
                },
              },
            },
          },
        },
      },
    },
  });

  const storeUrl = `https://shop-zero-inky.vercel.app/store/${vendor.slug}`;

  return sendWhatsAppText(
    waId,
    `🚀 *PRODUCT PUBLISHED TO YOUR STORE!*\n\n📦 *Title:* ${product.title}\n💰 *Price:* ₦${data.price.toLocaleString()}\n📂 *Category:* ${data.categoryName}\n📊 *Stock:* ${data.stock} unit(s)\n\n🔗 *Live Store Link:*\n${storeUrl}\n\nSend another photo to add your next product!`
  );
}

/**
 * Updates Bot Session State
 */
async function updateSessionState(waId: string, newState: Record<string, any>) {
  try {
    await prisma.botSession.upsert({
      where: { waId },
      update: { state: newState },
      create: { waId, state: newState },
    });
  } catch (err) {
    console.error("Failed to update bot session state:", err);
  }
}

/**
 * Sends a message back to WhatsApp via Meta Cloud API
 */
async function sendWhatsAppText(to: string, body: string) {
  if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
    console.log(`[WhatsApp Bot Simulation] to: ${to}\nMessage:\n${body}`);
    return;
  }

  try {
    await fetch(
      `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body },
        }),
      }
    );
  } catch (err) {
    console.error("Failed to send WhatsApp message:", err);
  }
}
