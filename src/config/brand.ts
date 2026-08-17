/**
 * Ideal Dry Fruit — Brand & Contact Configuration
 * Single source of truth for all operational contact parameters.
 */
export const BRAND = {
  name: "Ideal Dry Fruit",
  tagline: "Premium Quality | 100% Natural",
  city: "Lahore, Pakistan",
  established: 1998,

  /**
   * Color palette extracted directly from the official Ideal Dry Fruit logo.
   *   bg       = Deep black background  (#0D0D0D)
   *   gold     = Primary metallic gold  (#C9A84C)
   *   goldHi   = Bright highlight gold  (#F0C040)
   *   border   = Antique gold frame     (#B8922B)
   *   cream    = Off-white text         (#F5ECD7)
   *   dark     = Rich near-black text   (#1A1A1A)
   */
  colors: {
    bg: "#0D0D0D",
    surface: "#181818",
    surfaceLight: "#222222",
    gold: "#C9A84C",
    goldHi: "#F0C040",
    goldBorder: "#B8922B",
    cream: "#F5ECD7",
    darkText: "#1A1A1A",
  },

  contact: {
    rawNumber: "+923013060173",
    formattedNumber: "0301-3060173",
    /** WhatsApp Click-to-Chat base URL — append encoded message as ?text=... */
    whatsappBase: "https://wa.me/923013060173",
  },

  shipping: {
    freeThreshold: 3000,    // Rs.
    standardCost: 200,       // Rs.
  },
} as const;
