import { db } from "@shop-zero/database";

/** Shared by web and WhatsApp. Call immediately before payment/order creation. */
export async function reserveStock(cartId: string, offerId: string, quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Invalid quantity");
  return db.$transaction(async (tx) => {
    const updated = await tx.inventory.updateMany({
      where: { offerId, onHand: { gte: quantity } },
      data: { onHand: { decrement: quantity }, reserved: { increment: quantity } },
    });
    if (updated.count !== 1) throw new Error("OUT_OF_STOCK");
    return tx.stockReservation.create({
      data: { cartId, offerId, quantity, expiresAt: new Date(Date.now() + 15 * 60_000) },
    });
  }, { isolationLevel: "Serializable" });
}
