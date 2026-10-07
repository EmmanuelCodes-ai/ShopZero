import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: true, items: [] });
    }

    const wishlist = await prisma.wishlist.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                variants: {
                  include: {
                    offers: {
                      where: { active: true },
                      include: { inventory: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      return NextResponse.json({ success: true, items: [] });
    }

    const formatted = wishlist.items.map((item: any) => {
      const p = item.product;
      const variant = p.variants[0];
      const offer = variant?.offers[0];
      const price = offer ? Number(offer.price) : 0;
      const compareAt = offer?.compareAt ? Number(offer.compareAt) : price;
      const discountPct = compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
      const stock = offer?.inventory?.onHand ?? 0;

      return {
        id: item.id,
        productId: p.id,
        title: p.title,
        category: p.category.name,
        price,
        priceStr: `₦${price.toLocaleString()}`,
        wasPrice: compareAt,
        wasStr: `₦${compareAt.toLocaleString()}`,
        discount: discountPct > 0 ? `${discountPct}% OFF` : "",
        rating: "4.8",
        reviews: 140,
        img: variant?.images[0] || "/products/phone.jpg",
        inStock: stock > 0,
        addedDate: new Date(item.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };
    });

    return NextResponse.json({ success: true, items: formatted });
  } catch (error: any) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    let wishlist = await prisma.wishlist.findFirst({ where: { userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }

    await prisma.wishlistItem.upsert({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
      create: {
        wishlistId: wishlist.id,
        productId,
      },
      update: {},
    });

    return NextResponse.json({ success: true, message: "Added to wishlist" });
  } catch (error: any) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      await prisma.wishlistItem.delete({ where: { id } });
    }

    return NextResponse.json({ success: true, message: "Removed from wishlist" });
  } catch (error: any) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
