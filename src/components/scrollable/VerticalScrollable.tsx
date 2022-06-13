import {
  CSSProperties,
  ReactNode,
  useCallback,
  useRef,
  useEffect,
  useState,
  MouseEvent,
} from "react";
import "./Scrollable.css";

interface ScrollThumbCSSProperties extends CSSProperties {
  "--thumb-height": number;
  "--thumb-top": number;
}

const SCROLL_BOX_MIN_HEIGHT = 20;

export const VerticalScrollable = (props: {
  children?: ReactNode;
  style?: CSSProperties;
}) => {
  const [hovering, setHovering] = useState(false);
  const [scrollBoxHeight, setScrollBoxHeight] = useState(SCROLL_BOX_MIN_HEIGHT);
  const [scrollBoxTop, setScrollBoxTop] = useState(0);
  const [lastScrollThumbPosition, setScrollThumbPosition] = useState(0);
  const [isDragging, setDragging] = useState(false);

  const handleMouseOver = useCallback(() => {
    setHovering(true);
  }, []);
  const handleMouseOut = useCallback(() => {
    setHovering(false);
  }, []);

  const handleDocumentMouseUp = useCallback(
    (e: any) => {
      if (isDragging) {
        e.preventDefault();
        setDragging(false);
      }
    },
    [isDragging]
  );

  const handleDocumentMouseMove = useCallback(
    (e: any) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        const scrollHostElement = scrollHostRef.current as HTMLDivElement;
        const { scrollHeight, offsetHeight } = scrollHostElement;

        const deltaY = e.clientY - lastScrollThumbPosition;
        const percentage = deltaY * (scrollHeight / offsetHeight);
        setScrollThumbPosition(e.clientY);
        setScrollBoxTop(
          Math.min(
            Math.max(0, scrollBoxTop + deltaY),
            offsetHeight - scrollBoxHeight
          )
        );
        scrollHostElement.scrollTop = Math.min(
          scrollHostElement.scrollTop + percentage,
          scrollHeight - offsetHeight
        );
      }
    },
    [isDragging, lastScrollThumbPosition, scrollBoxHeight, scrollBoxTop]
  );

  const shouldDisplayScroll = useCallback(() => {
    if (!scrollHostRef) return false;
    const scrollHostElement = scrollHostRef.current as HTMLDivElement;
    const { clientHeight, scrollHeight } = scrollHostElement;
    return clientHeight < scrollHeight;
  }, []);

  const handleScrollThumbMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (shouldDisplayScroll()) {
        e.preventDefault();
        e.stopPropagation();
        setScrollThumbPosition(e.clientY);
        setDragging(true);
      }
    },
    [shouldDisplayScroll]
  );

  const handleScroll = useCallback(() => {
    if (!scrollHostRef) return;
    const scrollHostElement = scrollHostRef.current as HTMLDivElement;
    const { scrollTop, scrollHeight, offsetHeight } = scrollHostElement;
    let newTop = (scrollTop / scrollHeight) * offsetHeight;
    newTop = Math.min(newTop, offsetHeight - scrollBoxHeight);
    setScrollBoxTop(newTop);
  }, [scrollBoxHeight]);

  const scrollHostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scrollHostElement = scrollHostRef.current;
    const { clientHeight, scrollHeight } = scrollHostElement as HTMLDivElement;
    const scrollBoxPercentage =
      scrollHeight !== 0 ? clientHeight / scrollHeight : 0;
    const scrollbarHeight = Math.max(
      scrollBoxPercentage * clientHeight,
      SCROLL_BOX_MIN_HEIGHT
    );
    setScrollBoxHeight(scrollbarHeight);
    scrollHostElement?.addEventListener("scroll", handleScroll, true);
    return () => {
      scrollHostElement?.removeEventListener("scroll", handleScroll, true);
    };
  }, [handleScroll, props.children]);

  useEffect(() => {
    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("mouseup", handleDocumentMouseUp);
    document.addEventListener("mouseleave", handleDocumentMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleDocumentMouseMove);
      document.removeEventListener("mouseup", handleDocumentMouseUp);
      document.removeEventListener("mouseleave", handleDocumentMouseUp);
    };
  }, [handleDocumentMouseMove, handleDocumentMouseUp]);
  const thumbStyle: ScrollThumbCSSProperties = {
    "--thumb-height": scrollBoxHeight,
    "--thumb-top": scrollBoxTop,
  };
  return (
    <div className="scroll-container" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <div ref={scrollHostRef} style={props.style} className="scroll-host">
        {props.children}
      </div>
      <div
        className="scrollbar"
        data-type="vertical"
        data-hovering={(hovering && shouldDisplayScroll()) || isDragging}
      >
        <div className="scroll-thumb" data-type="vertical" style={thumbStyle} onMouseDown={handleScrollThumbMouseDown}/>
      </div>
    </div>
  );
};
