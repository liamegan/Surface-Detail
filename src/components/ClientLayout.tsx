"use client";
import { ReactNode, useEffect /*, useState */ } from "react";
import { useWheel } from "./MouseContextProvider";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { wheelData } = useWheel();
  // const [vh, setVh] = useState(0);

  // useEffect(() => {
  //   function resizeListener() {
  //     const vh = window.innerHeight * 0.01;
  //     setVh(vh);
  //   }
  //   resizeListener();
  //   window.addEventListener("resize", resizeListener);
  //   return () => window.removeEventListener("resize", resizeListener);
  // }, []);

  useEffect(() => {
    if (wheelData && wheelData.deltaY !== 0) {
      const scrollAmount = wheelData.deltaY * 3;
      window.scrollBy({
        left: scrollAmount,
      });
    }
  }, [wheelData]);

  return (
    <>
      {/*<div style={{ ['--vh' as string]: `${vh}px` }} className=\"body\">*/}

      {children}
      {/*</div>*/}
    </>
  );
}
