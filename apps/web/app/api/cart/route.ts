import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { channel: "WEB" },
      include: {
        lines: {
          include: {
            offer: {
              include: {
                variant: {
                  include: {
                    product: {
                      include: { category: true },
                    },
                  },
                },
                vendor: true,
                inventory: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId || null,
          channel: "WEB",
        },
        include: {
          lines: {
            include: {
              offer: {
                include: {
                  variant: {
                    include: {
                      product: {
                        include: { category: true },
                      },
                    },
                  },
                  vendor: true,
                  inventory: true,
                },
              },
            },
          },
        },
      });
    }

    const items = cart.lines.map((line: any) => {
      const price = Number(line.offer.price);
      const compareAt = line.offer.compareAt ? Number(line.offer.compareAt) : price;
      const discountPct = compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
      const stock = line.offer.inventory?.onHand ?? 0;

      return {
        id: line.id,
        lineId: line.id,
        offerId: line.offerId,
        productId: line.offer.variant.product.id,
        title: line.offer.variant.product.title,
        category: line.offer.variant.product.category.name,
        price,
        priceStr: `₦${price.toLocaleString()}`,
        wasPrice: compareAt,
        wasStr: `₦${compareAt.toLocaleString()}`,
        img: line.offer.variant.images[0] || "/products/phone.jpg",
        qty: line.quantity,
        inStock: stock >= line.quantity,
        stockAvailable: stock,
        discount: discountPct > 0 ? `${discountPct}% OFF` : "",
        seller: line.offer.vendor.name,
      };
    });

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);

    return NextResponse.json({
      success: true,
      cartId: cart.id,
      items,
      subtotal,
      itemCount: items.reduce((sum: number, i: any) => sum + i.qty, 0),
    });
  } catch (error: any) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId, offerId, quantity = 1 } = body;

    let targetOfferId = offerId;

    if (!targetOfferId && productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          variants: {
            include: {
              offers: {
                where: { active: true },
              },
            },
          },
        },
      });
      targetOfferId = product?.variants[0]?.offers[0]?.id;
    }

    if (!targetOfferId) {
      return NextResponse.json(
        { success: false, error: "No active offer found for this product" },
        { status: 400 }
      );
    }

    // Get or create cart
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { channel: "WEB" },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId || null,
          channel: "WEB",
        },
      });
    }

    // Upsert line item
    const existingLine = await prisma.cartLine.findUnique({
      where: {
        cartId_offerId: {
          cartId: cart.id,
          offerId: targetOfferId,
        },
      },
    });

    if (existingLine) {
      await prisma.cartLine.update({
        where: { id: existingLine.id },
        data: { quantity: existingLine.quantity + quantity },
      });
    } else {
      await prisma.cartLine.create({
        data: {
          cartId: cart.id,
          offerId: targetOfferId,
          quantity,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Added to cart" });
  } catch (error: any) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { lineId, quantity } = body;

    if (!lineId || typeof quantity !== "number") {
      return NextResponse.json({ success: false, error: "Invalid parameters" }, { status: 400 });
    }

    if (quantity <= 0) {
      await prisma.cartLine.delete({ where: { id: lineId } });
    } else {
      await prisma.cartLine.update({
        where: { id: lineId },
        data: { quantity },
      });
    }

    return NextResponse.json({ success: true, message: "Cart updated" });
  } catch (error: any) {
    console.error("Cart PATCH error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lineId = searchParams.get("lineId");
    const cartId = searchParams.get("cartId");

    if (lineId) {
      await prisma.cartLine.delete({ where: { id: lineId } });
    } else if (cartId) {
      await prisma.cartLine.deleteMany({ where: { cartId } });
    }

    return NextResponse.json({ success: true, message: "Item removed" });
  } catch (error: any) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
