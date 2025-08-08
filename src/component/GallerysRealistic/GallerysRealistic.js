import "./GallerysRealistic.css";
import pictureAPI from "../../apis/pictureAPI";
import ScrollContext from "../../context/ScrollContex/ScrollContex";
import PaginationControls from "../PaginationControls/PaginationControls";

import React from "react";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  memo,
} from "react";
import {
  RiZoomInFill,
  RiZoomOutFill,
  RiCloseLargeFill,
  RiResetLeftFill,
  RiArrowLeftFill,
  RiArrowRightFill,
} from "react-icons/ri";
import Swal from "sweetalert2";

const KEY = process.env.REACT_APP_API_KEY;

const GallerysRealistic = memo(() => {
  const [allPictures, setAllPictures] = useState({});
  const [pictures, setPictures] = useState([]);
  const [defaultPage, setDefaultPage] = useState(1);
  const [totalsPage, setTotalsPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [maxPagesToShow, setMaxPagesToShow] = useState(5);
  const [goPage, setGoPage] = useState(1);
  const [currentIndexImage, setCurrentIndexImage] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [checkedMagnifier, setChekedMagnifier] = useState(false);
  const [checkedZoomBox, setChekedZoomBox] = useState(false);
  const [glass, setGlass] = useState(false);
  const [slideshow, setSlideshow] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [current, setCurrent] = useState({ x: 0, y: 0 });
  const [initial, setInitial] = useState({ x: 0, y: 0 });

  const { setModal } = useContext(ScrollContext);

  const imgRef = useRef(null);
  const inputRef = useRef(null);
  const listImageRef = useRef([]);
  const divRef = useRef(null);
  const intervalRef = useRef(null);
  const initialDistance = useRef(null);
  const glassRef = useRef(null);

  const containerRef = useRef(null);
  const isDraggingScroll = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const limit = 50;

  // Fetch pictures
  useEffect(() => {
    const fetchPictures = async () => {
      if (allPictures[defaultPage]) {
        setPictures(allPictures[defaultPage]);
        return;
      }

      setLoading(true);
      try {
        const response = await pictureAPI.pictures(KEY, defaultPage, limit);
        const {
          currentPage,
          totalPages,
          totalItems,
          pictures: fetchedPictures,
        } = response.data;

        setAllPictures((prev) => ({
          ...prev,
          [currentPage]: fetchedPictures,
        }));

        setPictures(fetchedPictures);

        if (defaultPage === 1) {
          setActiveImage(0);
          setCurrentIndexImage(0);
        }

        setTotalsPage(totalPages);
        setTotalItems(totalItems);
      } catch (error) {
        console.error(
          "Error fetching pictures:",
          error?.response?.data?.message || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPictures();
  }, [defaultPage, allPictures]);

  // Magnifier effect
  useEffect(() => {
    const img = imgRef.current;
    const glass = glassRef.current;

    if (!openModal || !img || !glass || !checkedMagnifier) return;

    let zoom = 2;
    const bw = 3;

    const updateGlassBackground = () => {
      glass.style.backgroundImage = `url('${img.src}')`;
      glass.style.backgroundRepeat = "no-repeat";
      glass.style.backgroundSize = `${img.width * zoom}px ${
        img.height * zoom
      }px`;
    };

    const moveMagnifier = (e) => {
      e.preventDefault();
      const pos = getCursorPos(e);
      let x = pos.x;
      let y = pos.y;

      const w = glass.offsetWidth / 2;
      const h = glass.offsetHeight / 2;

      // Boundary checks
      if (x > img.width - w / zoom) x = img.width - w / zoom;
      if (x < w / zoom) x = w / zoom;
      if (y > img.height - h / zoom) y = img.height - h / zoom;
      if (y < h / zoom) y = h / zoom;

      glass.style.left = `${x - w}px`;
      glass.style.top = `${y - h}px`;
      glass.style.backgroundPosition = `-${x * zoom - w + bw}px -${
        y * zoom - h + bw
      }px`;
    };

    const getCursorPos = (e) => {
      const touch = e.touches ? e.touches[0] : e;
      const rect = img.getBoundingClientRect();

      return {
        x: touch.pageX - rect.left - window.pageXOffset,
        y: touch.pageY - rect.top - window.pageYOffset,
      };
    };

    // Initialize background
    updateGlassBackground();

    // Add event listeners
    const events = ["mousemove", "touchmove"];
    events.forEach((event) => {
      glass.addEventListener(event, moveMagnifier, { passive: false });
      img.addEventListener(event, moveMagnifier, { passive: false });
    });

    return () => {
      events.forEach((event) => {
        glass?.removeEventListener(event, moveMagnifier);
        img?.removeEventListener(event, moveMagnifier);
      });
    };
  }, [openModal, currentIndexImage, checkedMagnifier]);

  // Update refs when pictures change
  useEffect(() => {
    listImageRef.current = pictures.map(
      (_, i) => listImageRef.current[i] || React.createRef()
    );
  }, [pictures]);

  // Modal close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (divRef.current && !divRef.current.contains(e.target)) {
        setOpenModal(false);
      }
    };

    if (openModal) {
      document.addEventListener("click", handleClickOutside, true);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [openModal]);

  // Update scroll context
  useEffect(() => {
    setModal(openModal);
  }, [openModal, setModal]);

  // Scroll to active image
  useEffect(() => {
    if (listImageRef.current[activeImage]?.current) {
      listImageRef.current[activeImage].current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeImage]);

  // Image dragging and zooming
  const applyTransform = useCallback(
    (newScale = scale, newX = current.x, newY = current.y) => {
      if (imgRef.current) {
        imgRef.current.style.transform = `scale(${newScale}) translate(${newX}px, ${newY}px)`;
      }
    },
    [current.x, current.y, scale]
  );
  const startDragging = useCallback(
    (e) => {
      if (checkedZoomBox || scale === 1) return;

      e.preventDefault();
      setIsDragging(true);
      const clientX =
        e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const clientY =
        e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
      setInitial({ x: clientX - current.x, y: clientY - current.y });
    },
    [checkedZoomBox, current.x, current.y, scale]
  );

  const drag = useCallback(
    (e) => {
      if (checkedZoomBox || !isDragging || scale === 1) return;

      e.preventDefault();
      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
      const newX = clientX - initial.x;
      const newY = clientY - initial.y;
      setCurrent({ x: newX, y: newY });
      applyTransform(scale, newX, newY);
    },
    [applyTransform, initial.x, initial.y, isDragging, scale, checkedZoomBox]
  );

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();

      setScale((prev) => {
        let newScale;
        if (e.deltaY > 0) {
          newScale = Math.max(1, prev - 0.1);
        } else {
          newScale = Math.min(3, prev + 0.1);
        }

        if (newScale === 1) {
          setCurrent({ x: 0, y: 0 });
          applyTransform(1, 0, 0);
        } else {
          applyTransform(newScale);
        }
        return newScale;
      });
    },
    [applyTransform]
  );

  useEffect(() => {
    const img = imgRef.current;
    if (!img || !openModal) return;

    const handleMouseDown = (e) => startDragging(e);
    const handleMouseMove = (e) => drag(e);
    const handleMouseUp = () => stopDragging();
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialDistance.current = Math.hypot(dx, dy);
      } else {
        startDragging(e);
      }
    };
    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && initialDistance.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const newDistance = Math.hypot(dx, dy);
        const scaleDiff = (newDistance - initialDistance.current) / 300;

        setScale((prev) => {
          const newScale = Math.max(1, Math.min(3, prev + scaleDiff));
          applyTransform(newScale);
          return newScale;
        });

        initialDistance.current = newDistance;
      } else {
        drag(e);
      }
    };
    const handleTouchEnd = () => {
      initialDistance.current = null;
      stopDragging();
    };

    // Add event listeners
    img.addEventListener("mousedown", handleMouseDown);
    img.addEventListener("mousemove", handleMouseMove);
    img.addEventListener("mouseup", handleMouseUp);
    img.addEventListener("mouseleave", handleMouseUp);
    img.addEventListener("wheel", handleWheel, { passive: false });
    img.addEventListener("touchstart", handleTouchStart, { passive: false });
    img.addEventListener("touchmove", handleTouchMove, { passive: false });
    img.addEventListener("touchend", handleTouchEnd);

    return () => {
      img.removeEventListener("mousedown", handleMouseDown);
      img.removeEventListener("mousemove", handleMouseMove);
      img.removeEventListener("mouseup", handleMouseUp);
      img.removeEventListener("mouseleave", handleMouseUp);
      img.removeEventListener("wheel", handleWheel);
      img.removeEventListener("touchstart", handleTouchStart);
      img.removeEventListener("touchmove", handleTouchMove);
      img.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    openModal,
    applyTransform,
    handleWheel,
    drag,
    startDragging,
    stopDragging,
  ]);

  const handlePreventDefault = (e) => {
    e.preventDefault();
  };

  const handlePageClick = (page) => {
    if (page !== defaultPage && page >= 1 && page <= totalsPage) {
      setDefaultPage(page);
      setMaxPagesToShow(page >= 5 ? 9 : 5);
    }
  };

  const handleGoPage = () => {
    const pageNum = parseInt(goPage, 10);
    if (pageNum && pageNum >= 1 && pageNum <= totalsPage) {
      setDefaultPage(pageNum);
      setMaxPagesToShow(pageNum >= 5 ? 9 : 5);
    }
  };

  const handleViewImage = (index) => {
    setCurrentIndexImage(index);
    setActiveImage(index);
    setScale(1);
    setCurrent({ x: 0, y: 0 });
    setOpenModal(true);
  };

  const handleZoomIn = () => {
    setScale((prev) => {
      const newScale = Math.min(3, prev + 0.1);
      applyTransform(newScale);
      return newScale;
    });
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(1, prev - 0.1);
      if (newScale === 1) {
        setCurrent({ x: 0, y: 0 });
        applyTransform(1, 0, 0);
      } else {
        applyTransform(newScale);
      }
      return newScale;
    });
  };

  const handleMouseDownZoomIn = () => {
    intervalRef.current = setInterval(() => {
      setScale((prev) => {
        const newScale = Math.min(3, prev + 0.1);
        applyTransform(newScale);
        return newScale;
      });
    }, 100);
  };

  const handleMouseDownZoomOut = () => {
    intervalRef.current = setInterval(() => {
      setScale((prev) => {
        const newScale = Math.max(1, prev - 0.1);
        if (newScale === 1) {
          setCurrent({ x: 0, y: 0 });
          applyTransform(1, 0, 0);
        } else {
          applyTransform(newScale);
        }
        return newScale;
      });
    }, 100);
  };

  const handleMouseUp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleResetZoom = () => {
    setScale(1);
    setCurrent({ x: 0, y: 0 });
    applyTransform(1, 0, 0);
  };

  // Gallery scroll handlers
  const onMouseDown = (e) => {
    if (slideshow) return;
    isDraggingScroll.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const onMouseMove = (e) => {
    if (!isDraggingScroll.current || slideshow) return;
    setIsHolding(true);
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX.current;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDraggingScroll = () => {
    setIsHolding(false);
    isDraggingScroll.current = false;
  };

  const handleNextImage = () => {
    if (activeImage < pictures.length - 1) {
      const newIndex = activeImage + 1;
      setActiveImage(newIndex);
      setCurrentIndexImage(newIndex);
    }
  };

  const handleBackImage = () => {
    if (activeImage > 0) {
      const newIndex = activeImage - 1;
      setActiveImage(newIndex);
      setCurrentIndexImage(newIndex);
    }
  };

  const handleChangeMagnifier = (e) => {
    const checked = e.target.checked;
    setChekedMagnifier(checked);
    setGlass(checked);
  };

  const handleGoPageInput = async () => {
    const { value: number } = await Swal.fire({
      customClass: {
        popup: "select-go-page root_flex_row",
        input: "input-go-page",
      },
      confirmButtonColor: "#CCE274",
      input: "number",
      inputPlaceholder: "page",
      inputAttributes: {
        min: 1,
        max: totalsPage,
      },
    });

    const pageNum = parseInt(number, 10);
    if (pageNum && pageNum >= 1 && pageNum <= totalsPage) {
      setDefaultPage(pageNum);
      setMaxPagesToShow(pageNum >= 5 ? 9 : 5);
    }
  };

  return (
    <>
      <div className="slideshow">
        <label className="root_flex_row gap_025 flex_end">
          <input
            type="checkbox"
            checked={slideshow}
            onChange={(e) => setSlideshow(e.target.checked)}
            style={{ width: "1rem", height: "1rem" }}
          />
          <span>slideshow</span>
        </label>
      </div>

      {openModal && (
        <div className="gallery-view root_flex_row">
          <div ref={divRef} className="box-view-image">
            <div
              className="img-magnifier-container"
              onDoubleClick={() => setGlass(!glass)}
            >
              <img
                id="myimage"
                ref={imgRef}
                src={pictures[currentIndexImage]?.original_link}
                alt={`image-${currentIndexImage}`}
                onTouchStart={checkedZoomBox ? handlePreventDefault : undefined}
                onTouchMove={checkedZoomBox ? handlePreventDefault : undefined}
                onTouchEnd={checkedZoomBox ? handlePreventDefault : undefined}
              />
              {glass && checkedMagnifier && (
                <div ref={glassRef} className="img-magnifier-glass"></div>
              )}
            </div>

            {!checkedZoomBox && (
              <div className="controls-zoom root_flex_column">
                <div className="item-comtrol root_flex_row">
                  <button
                    id="zoom-in"
                    onClick={handleZoomIn}
                    onMouseDown={handleMouseDownZoomIn}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="root_flex_row"
                  >
                    <small>zoom</small>
                    <span>
                      <RiZoomInFill />
                    </span>
                  </button>
                  <button
                    id="zoom-out"
                    onClick={handleZoomOut}
                    onMouseDown={handleMouseDownZoomOut}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="root_flex_row"
                  >
                    <small>zoom</small>
                    <span>
                      <RiZoomOutFill />
                    </span>
                  </button>
                </div>
                <div className="item-comtrol root_flex_row">
                  <button
                    id="reset"
                    onClick={handleResetZoom}
                    className="root_flex_row"
                  >
                    <small>reset</small>
                    <span>
                      <RiResetLeftFill />
                    </span>
                  </button>
                  <button
                    id="close"
                    onClick={() => setOpenModal(false)}
                    className="root_flex_row"
                  >
                    <small>close</small>
                    <span>
                      <RiCloseLargeFill />
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div className="switch-box root_flex_column">
              <div
                className="root_flex_row flex_start gap_05"
                style={{ width: "100%" }}
              >
                <span>Hidden Zoom</span>
                <input
                  type="checkbox"
                  checked={checkedZoomBox}
                  onChange={(e) => setChekedZoomBox(e.target.checked)}
                />
              </div>
              <div
                className="root_flex_row flex_start gap_05"
                style={{ width: "100%" }}
              >
                <span>Magnifier</span>
                <input
                  type="checkbox"
                  checked={checkedMagnifier}
                  onChange={handleChangeMagnifier}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="gallery-container root_flex_row">Loading...</div>
      ) : (
        <div className="gallery-container">
          <div
            className="gallery-item-image"
            id={slideshow ? "gallery-item-image" : ""}
            ref={containerRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDraggingScroll}
            onMouseLeave={stopDraggingScroll}
          >
            {pictures.map((pic, index) => (
              <img
                ref={listImageRef.current[index]}
                key={pic.id}
                src={pic.display_link}
                srcSet={pic.original_link}
                width="15rem"
                alt={`Gallery ${index + 1}`}
                loading="eager"
                decoding="async"
                className={`${activeImage === index ? "active_image" : ""}${
                  isHolding ? "event-none" : ""
                }`}
                onClick={() => setActiveImage(index)}
                onDoubleClick={() => handleViewImage(index)}
              />
            ))}
          </div>

          <div className="footer-gallery root_flex_row">
            <div className="root_flex_row flex_start gap_05 w-dt-40 w-mb-100">
              <span>
                Trang <b style={{ color: "#75921e" }}>{defaultPage}</b>/
                <b>{totalsPage}</b>
              </span>
              <strong>|</strong>
              <span>
                Tổng số ảnh: <b>{totalItems}</b>
              </span>
              <div className="go-mobie">
                <button onClick={handleGoPageInput}>Go to page</button>
              </div>
            </div>

            <div className="controls-go-gallery root_flex_row flex_end gap_05 w-dt-60 w-mb-100">
              <div className="go-page go-destop">
                <input
                  ref={inputRef}
                  type="number"
                  min="1"
                  max={totalsPage}
                  value={goPage}
                  onChange={(e) => setGoPage(e.target.value)}
                  onFocus={() => inputRef.current?.select()}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setGoPage(1);
                    }
                  }}
                />
                <button onClick={handleGoPage}>Go</button>
              </div>
              <div style={{ maxWidth: "100%", margin: "0 auto" }}>
                <PaginationControls
                  currentPage={defaultPage}
                  totalPages={totalsPage}
                  onPageChange={handlePageClick}
                  maxPagesToShow={maxPagesToShow}
                />
              </div>
            </div>
          </div>

          <button
            className="button_action_image back_image"
            onClick={handleBackImage}
            disabled={activeImage === 0}
            style={{
              visibility: slideshow ? "hidden" : "initial",
              opacity: activeImage === 0 ? 0.5 : 1,
            }}
          >
            <span>
              <RiArrowLeftFill />
            </span>
          </button>

          <button
            className="button_action_image next_image"
            onClick={handleNextImage}
            disabled={activeImage >= pictures.length - 1}
            style={{
              visibility: slideshow ? "hidden" : "initial",
              opacity: activeImage >= pictures.length - 1 ? 0.5 : 1,
            }}
          >
            <span>
              <RiArrowRightFill />
            </span>
          </button>
        </div>
      )}
    </>
  );
});

export default GallerysRealistic;
