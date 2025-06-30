"use client";

import { useWheel } from "./MouseContextProvider";
import { ReactNode, useEffect } from "react";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { wheelData } = useWheel();

  useEffect(() => {
    if (wheelData && wheelData.deltaY !== 0) {
      const scrollAmount = wheelData.deltaY * 3;
      window.scrollBy({
        left: scrollAmount,
      });
    }
  }, [wheelData]);

  return <body>{children}</body>;
}
