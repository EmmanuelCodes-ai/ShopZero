import { PrismaClient, UserRole, ProductStatus } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Shop Zero database...");

  // 1. Clean existing records in correct order
  await db.review.deleteMany();
  await db.wishlistItem.deleteMany();
  await db.wishlist.deleteMany();
  await db.orderLine.deleteMany();
  await db.order.deleteMany();
  await db.cartLine.deleteMany();
  await db.cart.deleteMany();
  await db.inventory.deleteMany();
  await db.offer.deleteMany();
  await db.productVariant.deleteMany();
  await db.product.deleteMany();
  await db.brand.deleteMany();
  await db.category.deleteMany();
  await db.address.deleteMany();
  await db.botSession.deleteMany();
  await db.vendor.deleteMany();
  await db.user.deleteMany();

  // 2. Create Users (Demo Buyer & Demo Seller)
  const buyer = await db.user.create({
    data: {
      email: "buyer@shopzero.ng",
      phone: "+2348012345678",
      displayName: "Tunde Bakare",
      role: UserRole.CUSTOMER,
      addresses: {
        create: {
          label: "Home",
          line1: "14 Adeola Odeku St, Victoria Island",
          city: "Lagos",
          state: "Lagos",
          country: "NG",
        },
      },
    },
  });

  const seller = await db.user.create({
    data: {
      email: "seller@shopzero.ng",
      phone: "+2348098765432",
      displayName: "Aura Electronics",
      storeName: "Aura Official Store",
      role: UserRole.VENDOR,
    },
  });

  // 3. Create Vendors
  const vendorAura = await db.vendor.create({
    data: {
      name: "Aura Official Store",
      slug: "aura-official",
    },
  });

  const vendorGeneral = await db.vendor.create({
    data: {
      name: "Shop Zero Verified Store",
      slug: "shopzero-verified",
    },
  });

  // 4. Create Categories
  const categoriesData = [
    { name: "Phones & Tablets", slug: "phones-tablets" },
    { name: "Electronics & Audio", slug: "electronics" },
    { name: "Fashion & Footwear", slug: "fashion" },
    { name: "Home & Kitchen Appliances", slug: "home-living" },
    { name: "Groceries & Supermarket", slug: "groceries" },
    { name: "Beauty & Personal Care", slug: "beauty-personal-care" },
  ];

  const catMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await db.category.create({ data: cat });
    catMap[cat.slug] = created.id;
  }

  // 5. Create Brands
  const brandsData = ["Zenith", "Aura", "Oraimo", "Lumina", "Dell", "AeroFry", "Velociti", "Lumineux", "Stride", "Le Voyage", "Golden Penny", "Nestlé", "Ariel", "Kings", "Versace", "CeraVe", "OGX"];
  const brandMap: Record<string, string> = {};
  for (const b of brandsData) {
    const created = await db.brand.create({
      data: { name: b, slug: b.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
    });
    brandMap[b] = created.id;
  }

  // 6. Products Catalog
  const products = [
    // Phones & Tablets
    {
      title: "Zenith Pro 5G Smartphone 256GB / 8GB RAM",
      slug: "zenith-pro-5g-smartphone",
      desc: "Supercharged 5G smartphone with 120Hz AMOLED display, 5000mAh all-day battery, and 64MP OIS camera.",
      catSlug: "phones-tablets",
      brand: "Zenith",
      price: 185000,
      compareAt: 220000,
      stock: 50,
      sku: "ZEN-PRO-5G",
      img: "/products/phone.jpg",
      subcat: "Smartphones (5G & 4G)",
    },
    {
      title: "Wireless Noise-Cancelling Bluetooth Earbuds Pro",
      slug: "wireless-noise-cancelling-earbuds",
      desc: "Active noise cancellation, 32-hour total battery life with fast wireless charging case.",
      catSlug: "phones-tablets",
      brand: "Aura",
      price: 24500,
      compareAt: 35000,
      stock: 80,
      sku: "AUR-EAR-PRO",
      img: "/products/headphones.jpg",
      subcat: "Fast Chargers & Cables",
    },
    {
      title: "Fast-Charging 30,000mAh Ultra Slim Power Bank",
      slug: "fast-charging-30000mah-power-bank",
      desc: "Heavy-duty 30,000mAh battery with 22.5W fast charging and multi-device support.",
      catSlug: "phones-tablets",
      brand: "Oraimo",
      price: 18900,
      compareAt: 25000,
      stock: 120,
      sku: "ORA-PB-30K",
      img: "/products/phone.jpg",
      subcat: "Power Banks & Batteries",
    },

    // Electronics
    {
      title: "Smart LED TV 43-inch Full HD HDR with Voice Remote",
      slug: "smart-led-tv-43-inch",
      desc: "Vibrant Full HD HDR display with built-in Netflix, Prime Video, YouTube, and Google Assistant voice remote.",
      catSlug: "electronics",
      brand: "Lumina",
      price: 235000,
      compareAt: 280000,
      stock: 25,
      sku: "LUM-TV-43",
      img: "/products/tv.jpg",
      subcat: "Smart LED Televisions",
    },
    {
      title: "Wireless Noise-Cancelling Over-Ear Studio Headphones",
      slug: "wireless-noise-cancelling-studio-headphones",
      desc: "Studio-grade sound with 40mm drivers, active noise cancellation, and 40-hour wireless playtime.",
      catSlug: "electronics",
      brand: "Aura",
      price: 48900,
      compareAt: 65000,
      stock: 45,
      sku: "AUR-HP-STUDIO",
      img: "/products/headphones.jpg",
      subcat: "Bluetooth Soundbars & Audio",
    },
    {
      title: "Dell Inspiron 15 Laptop Intel Core i5, 16GB RAM 512GB SSD",
      slug: "dell-inspiron-15-laptop",
      desc: "Power through productivity with Intel Core i5 12th Gen, 16GB DDR4 RAM, and 512GB NVMe SSD.",
      catSlug: "electronics",
      brand: "Dell",
      price: 420000,
      compareAt: 510000,
      stock: 15,
      sku: "DEL-INSP-15",
      img: "/products/tv.jpg",
      subcat: "Laptops & Computing",
    },

    // Home & Living
    {
      title: "Everyday Air Fryer 5L Digital Touchscreen with 8 Presets",
      slug: "everyday-air-fryer-5l-digital",
      desc: "Cook delicious, healthy meals with 85% less oil. Digital touchscreen with 8 presets and non-stick basket.",
      catSlug: "home-living",
      brand: "AeroFry",
      price: 59500,
      compareAt: 72000,
      stock: 35,
      sku: "AER-AF-5L",
      img: "/products/airfryer.jpg",
      subcat: "Air Fryers & Microwaves",
    },
    {
      title: "Velociti High-Speed Kitchen Blender 1500W Ice Crusher",
      slug: "velociti-high-speed-kitchen-blender",
      desc: "1500W commercial-grade motor with 6 stainless steel blades for instant smoothie blending and ice crushing.",
      catSlug: "home-living",
      brand: "Velociti",
      price: 41500,
      compareAt: 55000,
      stock: 60,
      sku: "VEL-BLD-1500",
      img: "/products/blender.jpg",
      subcat: "Blenders & Food Processors",
    },
    {
      title: "Lumineux 2.5KVA Pure Sine Wave Inverter with Battery",
      slug: "lumineux-2-5kva-pure-sine-inverter",
      desc: "Reliable clean solar and grid backup power with intelligent battery protection and silent operation.",
      catSlug: "home-living",
      brand: "Lumineux",
      price: 145000,
      compareAt: 178000,
      stock: 10,
      sku: "LUM-INV-25",
      img: "/products/airfryer.jpg",
      subcat: "Inverters & Solar",
    },

    // Fashion
    {
      title: "Men's Classic Lightweight Running Sneakers (White & Orange)",
      slug: "mens-classic-running-sneakers",
      desc: "Breathable mesh upper with cushioned EVA shock-absorbing sole for ultimate athletic and casual comfort.",
      catSlug: "fashion",
      brand: "Stride",
      price: 32990,
      compareAt: 45000,
      stock: 75,
      sku: "STR-SNK-ORANGE",
      img: "/products/sneakers.jpg",
      subcat: "Sneakers & Casual Shoes",
    },
    {
      title: "Le Voyage Premium Italian Leather Handbag (Caramel Tan)",
      slug: "le-voyage-premium-leather-handbag",
      desc: "Handcrafted genuine Italian leather with dual zip compartments and adjustable luxury shoulder strap.",
      catSlug: "fashion",
      brand: "Le Voyage",
      price: 28750,
      compareAt: 39000,
      stock: 40,
      sku: "LEV-BAG-TAN",
      img: "/products/bag.jpg",
      subcat: "Handbags & Backpacks",
    },

    // Groceries
    {
      title: "Golden Penny Semovita 10kg Bag — Premium Quality",
      slug: "golden-penny-semovita-10kg",
      desc: "Enriched with Vitamin A and iron for healthy family meals. Fluffy and lump-free texture.",
      catSlug: "groceries",
      brand: "Golden Penny",
      price: 8500,
      compareAt: 11000,
      stock: 200,
      sku: "GP-SEMO-10KG",
      img: "/products/airfryer.jpg",
      subcat: "Food Cupboard",
    },
    {
      title: "Milo Energy Drink Chocolate Powder 1kg Tin",
      slug: "milo-energy-drink-chocolate-1kg",
      desc: "Nourishing malt chocolate drink packed with essential vitamins B2, B3, B6, B12, and calcium.",
      catSlug: "groceries",
      brand: "Nestlé",
      price: 5200,
      compareAt: 6800,
      stock: 300,
      sku: "NES-MILO-1KG",
      img: "/products/blender.jpg",
      subcat: "Beverages & Drinks",
    },
    {
      title: "Ariel Matic Detergent Powder 5kg — Front & Top Load",
      slug: "ariel-matic-detergent-powder-5kg",
      desc: "Tough stain removal in 1 wash with fresh floral scent and fabric brightening technology.",
      catSlug: "groceries",
      brand: "Ariel",
      price: 7900,
      compareAt: 10500,
      stock: 150,
      sku: "ARI-DET-5KG",
      img: "/products/airfryer.jpg",
      subcat: "Cleaning Supplies",
    },
    {
      title: "Kings Groundnut Oil 5 Litres — Pure & Refined",
      slug: "kings-groundnut-oil-5l",
      desc: "Cholesterol-free, 100% pure vegetable oil enriched with Vitamin A for crisp frying and cooking.",
      catSlug: "groceries",
      brand: "Kings",
      price: 12000,
      compareAt: 15500,
      stock: 100,
      sku: "KNG-OIL-5L",
      img: "/products/airfryer.jpg",
      subcat: "Cooking Oils",
    },

    // Beauty & Personal Care
    {
      title: "Versace Eros Pour Homme Eau de Parfum 100ml",
      slug: "versace-eros-eau-de-parfum-100ml",
      desc: "Luminous, vibrant and sensual masculine fragrance with mint leaves, lemon zest, and green apple notes.",
      catSlug: "beauty-personal-care",
      brand: "Versace",
      price: 55000,
      compareAt: 72000,
      stock: 30,
      sku: "VER-EROS-100ML",
      img: "/products/sneakers.jpg",
      subcat: "Perfumes & Colognes",
    },
    {
      title: "CeraVe Moisturizing Cream 340g — Dry to Very Dry Skin",
      slug: "cerave-moisturizing-cream-340g",
      desc: "Developed with dermatologists. Formulated with 3 essential ceramides and hyaluronic acid to restore the protective skin barrier.",
      catSlug: "beauty-personal-care",
      brand: "CeraVe",
      price: 18500,
      compareAt: 24000,
      stock: 90,
      sku: "CER-MOIST-340G",
      img: "/products/bag.jpg",
      subcat: "Skincare",
    },
    {
      title: "OGX Biotin & Collagen Shampoo 385ml — Thick & Full",
      slug: "ogx-biotin-collagen-shampoo-385ml",
      desc: "Infused with Pro-Vitamin B7 Biotin and Collagen to add fullness and volume to thin, flat hair.",
      catSlug: "beauty-personal-care",
      brand: "OGX",
      price: 8200,
      compareAt: 11000,
      stock: 65,
      sku: "OGX-BIOTIN-385ML",
      img: "/products/bag.jpg",
      subcat: "Hair Care",
    },
  ];

  for (const item of products) {
    const product = await db.product.create({
      data: {
        title: item.title,
        slug: item.slug,
        description: item.desc,
        status: ProductStatus.ACTIVE,
        categoryId: catMap[item.catSlug],
        brandId: brandMap[item.brand] || null,
        attributes: { subCategory: item.subcat, rating: "4.7", reviews: 142 },
        variants: {
          create: {
            sku: item.sku,
            name: "Standard",
            images: [item.img],
            offers: {
              create: {
                vendorId: vendorAura.id,
                price: item.price,
                compareAt: item.compareAt,
                active: true,
                inventory: {
                  create: {
                    onHand: item.stock,
                    reserved: 0,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // 7. Seed Initial Order for demo buyer
  const order = await db.order.create({
    data: {
      orderNumber: "ORD-948201",
      userId: buyer.id,
      status: "SHIPPED",
      payment: "PAID",
      currency: "NGN",
      subtotal: 48900,
      shippingFee: 0,
      total: 48900,
      source: "WEB",
    },
  });

  console.log("✅ Database successfully seeded with full Shop Zero catalog!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
