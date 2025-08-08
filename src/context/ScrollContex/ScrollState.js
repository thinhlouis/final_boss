import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import ScrollContext from "./ScrollContex";

const ScrollState = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [modal, setModal] = useState(false);

  const timeRef = useRef(null);

  useEffect(() => {
    let prevScrollpos = window.scrollY;
    const handleScroll = () => {
      let currentScrollPos = window.scrollY;

      if (prevScrollpos > currentScrollPos) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setOpenMenu(false);
      }

      prevScrollpos = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOpenMenu = useCallback(() => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }

    setAnimation((prev) => !prev);

    if (!animation) {
      setOpenMenu((prev) => !prev);
      return;
    }
    timeRef.current = setTimeout(() => {
      setOpenMenu((prev) => !prev);
    }, 1000);
  }, [animation]);

  const contextValue = useMemo(
    () => ({
      isScrolled,
      openMenu,
      setIsScrolled,
      setOpenMenu,
      animation,
      setAnimation,
      handleOpenMenu,
      modal,
      setModal,
    }),
    [
      isScrolled,
      openMenu,
      setIsScrolled,
      setOpenMenu,
      animation,
      setAnimation,
      handleOpenMenu,
      modal,
      setModal,
    ]
  );

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  );
};
export default ScrollState;
