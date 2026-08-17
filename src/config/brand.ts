/**
 * Biogen Pharma — Brand & Contact Configuration
 * Single source of truth for all operational contact parameters.
 */
export const BRAND = {
  name: "Biogen Pharma",
  tagline: "Enhancing Lives Through Quality Healthcare & Medical Supplies",
  city: "The Gambia & Sierra Leone",
  established: 2018,

  /**
   * Color palette tailored for Biogen Pharma healthcare & clinical excellence.
   */
  colors: {
    bg: "#0A0F1D",
    surface: "#111827",
    surfaceLight: "#1F2937",
    primary: "#0072CE",
    primaryLight: "#00A3E0",
    accent: "#70BA28",
    accentHi: "#86D634",
    border: "#1E293B",
    cream: "#F8FAFC",
    darkText: "#0F172A",
    gold: "#0072CE",
    goldHi: "#70BA28",
    goldBorder: "#005EA6",
  },

  contact: {
    rawNumber: "+23275011616",
    formattedNumber: "+232 75 011616",
    email: "contact@biogenpharma.site",
    altEmail: "info.biogen@gianteyetech.com",
    addressHead: "C8WF+ CWC New Jeshwang, WestField, The Gambia",
    addressBranch: "20 Garrison Street, Free Town, Sierra Leone",
    /** WhatsApp Click-to-Chat base URL — append encoded message as ?text=... */
    whatsappBase: "https://wa.me/23275011616",
  },

  shipping: {
    freeThreshold: 500,
    standardCost: 50,
  },
} as const;
