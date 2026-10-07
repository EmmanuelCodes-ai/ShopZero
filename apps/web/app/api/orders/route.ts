import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const where: any = {};
    if (userId) where.userId = userId;

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        lines: {
          include: {
            offer: {
              include: {
                variant: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formatted = orders.map((o: any) => {
      const total = Number(o.total);
      return {
        id: o.orderNumber,
        date: new Date(o.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: o.status,
        paymentStatus: o.payment,
        total: `₦${total.toLocaleString()}`,
        totalRaw: total,
        deliveryDate: o.status === "DELIVERED" ? "Delivered" : "2-3 business days",
        courier: "DHL Express",
        trackingCode: `DHL-NG-${o.orderNumber.replace(/[^0-9]/g, "")}`,
        address: "14 Adeola Odeku St, Victoria Island, Lagos",
        paymentMethod: "Card / Transfer",
        items: o.lines.map((l: any) => ({
          title: l.title,
          qty: l.quantity,
          price: `₦${Number(l.unitPrice).toLocaleString()}`,
          img: l.offer.variant.images[0] || "/products/phone.jpg",
        })),
        trackingSteps: [
          { label: "Order Placed", detail: "Your order was received", time: "Confirmed", done: true, active: false },
          { label: "Confirmed", detail: "Seller confirmed order", time: "Ready", done: true, active: false },
          { label: "Shipped", detail: "Package picked up by courier", time: "En route", done: o.status !== "PENDING_PAYMENT", active: o.status === "SHIPPED" },
          { label: "In Transit", detail: "Package en route to Lagos hub", time: "In transit", done: o.status === "SHIPPED" || o.status === "DELIVERED", active: false },
          { label: "Delivered", detail: "Delivered to doorstep", time: o.status === "DELIVERED" ? "Delivered" : "Estimated soon", done: o.status === "DELIVERED", active: o.status === "DELIVERED" },
        ],
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    console.error("Orders API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, cartId, address } = body;

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        lines: {
          include: {
            offer: {
              include: {
                variant: {
                  include: { product: true },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.lines.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    const subtotal = cart.lines.reduce((sum: number, line: any) => {
      return sum + Number(line.offer.price) * line.quantity;
    }, 0);

    const shippingFee = subtotal >= 50000 ? 0 : 3500;
    const total = subtotal + shippingFee;
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        status: "PROCESSING",
        payment: "PAID",
        currency: "NGN",
        subtotal,
        shippingFee,
        total,
        source: "WEB",
        lines: {
          create: cart.lines.map((l: any) => ({
            offerId: l.offerId,
            title: l.offer.variant.product.title,
            sku: l.offer.variant.sku,
            unitPrice: l.offer.price,
            quantity: l.quantity,
          })),
        },
      },
    });

    // Clear cart after checkout
    await prisma.cartLine.deleteMany({ where: { cartId } });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
