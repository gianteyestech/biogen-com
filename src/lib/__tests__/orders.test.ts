import { describe, it, expect } from "vitest";

describe("Order Security & Price Recalculation Unit Tests", () => {
  const sampleProducts = [
    {
      id: "almonds-giri-250g",
      name: "American Almonds Giri",
      prices: { "250g": 1200, "500g": 2300, "1kg": 4400 },
    },
    {
      id: "irani-muzafati-dates",
      name: "Irani Mazafati Dates",
      prices: { "250g": 650, "500g": 1250, "1kg": 2400 },
    },
  ];

  function recalculateOrderTotal(
    clientItems: Array<{ id: string; weight: string; quantity: number; price?: number }>,
    products: typeof sampleProducts
  ) {
    let total = 0;
    const validatedItems = [];

    for (const item of clientItems) {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        throw new Error(`Product "${item.id}" is no longer available.`);
      }

      const unitPrice = product.prices[item.weight as keyof typeof product.prices];
      if (unitPrice === undefined) {
        throw new Error(`Invalid weight option "${item.weight}" for product "${product.name}".`);
      }

      const quantity = Math.max(1, item.quantity);
      const subtotal = unitPrice * quantity;
      total += subtotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        weight: item.weight,
        quantity,
        price: unitPrice,
      });
    }

    return { total, validatedItems };
  }

  it("recalculates correct total ignoring spoofed client price (Rs 1.00 attempt)", () => {
    const maliciousClientPayload = [
      { id: "almonds-giri-250g", weight: "250g", quantity: 2, price: 1 }, // Attempts 2x almonds for Rs 1
    ];

    const result = recalculateOrderTotal(maliciousClientPayload, sampleProducts);
    expect(result.total).toBe(2400); // 1200 * 2 = 2400
    expect(result.validatedItems[0].price).toBe(1200);
  });

  it("throws error for non-existent product", () => {
    const invalidPayload = [
      { id: "hacked-product-xyz", weight: "250g", quantity: 1, price: 50 },
    ];

    expect(() => recalculateOrderTotal(invalidPayload, sampleProducts)).toThrow(
      'Product "hacked-product-xyz" is no longer available.'
    );
  });

  it("throws error for invalid weight choice", () => {
    const invalidWeightPayload = [
      { id: "irani-muzafati-dates", weight: "10kg", quantity: 1, price: 650 },
    ];

    expect(() => recalculateOrderTotal(invalidWeightPayload, sampleProducts)).toThrow(
      'Invalid weight option "10kg" for product "Irani Mazafati Dates".'
    );
  });

  it("enforces minimum 1 quantity even if client passes negative or 0", () => {
    const zeroQtyPayload = [
      { id: "irani-muzafati-dates", weight: "500g", quantity: 0, price: 1250 },
    ];

    const result = recalculateOrderTotal(zeroQtyPayload, sampleProducts);
    expect(result.total).toBe(1250); // 1250 * 1 = 1250
    expect(result.validatedItems[0].quantity).toBe(1);
  });
});

describe("Admin Authentication Secret Tests", () => {
  function getAdminSecret(envValue?: string) {
    if (!envValue) {
      throw new Error("SECURITY FATAL: ADMIN_SESSION_SECRET environment variable is missing.");
    }
    return envValue;
  }

  it("returns secret when environment variable is present", () => {
    expect(getAdminSecret("production_secret_key_9988")).toBe("production_secret_key_9988");
  });

  it("throws security error when secret environment variable is missing", () => {
    expect(() => getAdminSecret(undefined)).toThrow("SECURITY FATAL: ADMIN_SESSION_SECRET");
  });
});
