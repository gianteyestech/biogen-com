"use client";

import React, { createContext, useContext } from "react";
import type { CMSPaymentMethod } from "@/lib/cms-types";

const PaymentMethodsContext = createContext<CMSPaymentMethod[]>([]);

export function PaymentMethodsProvider({
  paymentMethods,
  children,
}: {
  paymentMethods: CMSPaymentMethod[];
  children: React.ReactNode;
}) {
  return (
    <PaymentMethodsContext.Provider value={paymentMethods}>
      {children}
    </PaymentMethodsContext.Provider>
  );
}

export function usePaymentMethods(): CMSPaymentMethod[] {
  return useContext(PaymentMethodsContext);
}
