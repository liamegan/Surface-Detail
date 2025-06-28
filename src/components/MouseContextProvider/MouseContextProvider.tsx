"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface WheelData {
  deltaX: number;
  deltaY: number;
  deltaZ: number;
  deltaMode: number;
}

interface WheelContextType {
  wheelData: WheelData | null;
  isScrolling: boolean;
  scrollDirection: "up" | "down" | "left" | "right" | null;
}

const WheelContext = createContext<WheelContextType | undefined>(undefined);

export const useWheel = () => {
  const context = useContext(WheelContext);
  if (context === undefined) {
    throw new Error("useWheel must be used within a WheelContextProvider");
  }
  return context;
};

interface WheelContextProviderProps {
  children: ReactNode;
}

export const WheelContextProvider: React.FC<WheelContextProviderProps> = ({
  children,
}) => {
  const [wheelData, setWheelData] = useState<WheelData | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<
    "up" | "down" | "left" | "right" | null
  >(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const newWheelData: WheelData = {
        deltaX: event.deltaX,
        deltaY: event.deltaY,
        deltaZ: event.deltaZ,
        deltaMode: event.deltaMode,
      };

      setWheelData(newWheelData);
      setIsScrolling(true);

      // Determine scroll direction
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        setScrollDirection(event.deltaY > 0 ? "down" : "up");
      } else {
        setScrollDirection(event.deltaX > 0 ? "right" : "left");
      }

      // Clear existing timeout
      clearTimeout(timeoutId);

      // Set a timeout to mark scrolling as stopped after 150ms of no wheel events
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
        setScrollDirection(null);
      }, 150);
    };

    // Add event listener with passive: false to allow preventDefault
    window.addEventListener("wheel", handleWheel, { passive: false });

    // Cleanup
    return () => {
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(timeoutId);
    };
  }, []);

  const value: WheelContextType = {
    wheelData,
    isScrolling,
    scrollDirection,
  };

  return (
    <WheelContext.Provider value={value}>{children}</WheelContext.Provider>
  );
};
