import { useState, useEffect, useMemo } from "react";
import { useSessionStorage } from "react-use";
import _ from "lodash";
import themeMap from "../theme/themeConfig";
/* eslint-disable */

function useThemeType(): ["dark" | "light", () => void, boolean] {
  const [lastThemeType, setLastThemeType] = useSessionStorage<"dark" | "light">(
    "lastTheme",
    "light"
  );

  const [themeType, setThemeType] = useState<"dark" | "light">(lastThemeType);
  const [isMobile, setIsMobile] = useState<boolean>(
    document.documentElement.clientWidth <= 768
  );
  const toggleTheme = () => {
    if (themeType === "dark") {
      setThemeType("light");
      setLastThemeType("light");
    } else {
      setThemeType("dark");
      setLastThemeType("dark");
    }
  };
  const onResize = useMemo(
    () =>
      _.throttle(
        () => setIsMobile(document.documentElement.clientWidth <= 768),
        400
      ),
    []
  );
  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);
  useEffect(() => {
    const pallets = themeMap[themeType];
    pallets["@isMobile"] = isMobile;
    (window as any)?.less
      .modifyVars({
        ...pallets,
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }, [themeType, isMobile]);
  return [themeType, toggleTheme, isMobile];
}

export default useThemeType;
