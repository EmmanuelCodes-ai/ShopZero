import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");
    const subCategory = searchParams.get("subCategory");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sort") || "featured";

    const where: any = {
      status: "ACTIVE",
    };

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        variants: {
          include: {
            offers: {
              where: { active: true },
              include: {
                inventory: true,
                vendor: true,
              },
            },
          },
        },
        reviews: true,
      },
    });

    // Format products for frontend consumption
    const formatted = products.map((p: any) => {
      const variant = p.variants[0];
      const offer = variant?.offers[0];
      const price = offer ? Number(offer.price) : 0;
      const compareAt = offer?.compareAt ? Number(offer.compareAt) : price;
      const discountPct = compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
      const stock = offer?.inventory?.onHand ?? 0;
      const attrs = (p.attributes as Record<string, any>) || {};

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        category: p.category.slug,
        categoryName: p.category.name,
        subCategory: attrs.subCategory || "General",
        brand: p.brand?.name || "Generic",
        price,
        wasPrice: compareAt,
        priceStr: `₦${price.toLocaleString()}`,
        wasStr: `₦${compareAt.toLocaleString()}`,
        discount: discountPct > 0 ? `${discountPct}%` : "",
        rating: attrs.rating || "4.7",
        reviews: attrs.reviews || p.reviews.length || 100,
        img: variant?.images[0] || "/products/phone.jpg",
        inStock: stock > 0,
        offerId: offer?.id,
      };
    });

    let result = formatted;

    if (subCategory && subCategory !== "All") {
      result = result.filter((p: any) => p.subCategory === subCategory);
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) {
        result = result.filter((p: any) => p.price <= max);
      }
    }

    if (sortBy === "price-low") {
      result.sort((a: any, b: any) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a: any, b: any) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a: any, b: any) => parseFloat(b.rating) - parseFloat(a.rating));
    }

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    });
  } catch (error: any) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
