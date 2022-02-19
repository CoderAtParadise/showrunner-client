import {
    useState,
    useCallback,
    ReactNode,
    useRef,
    useEffect,
    MouseEvent
} from "react";
import styled from "@emotion/styled";

const ScrollContainer = styled.div`
    position: relative;
    height: 100%;
    max-height: 100%;
    width: 100%;
`;

const ScrollHost = styled.div`
    overflow: auto;
    height: 100%;
    scrollbar-width: none;
    position: relative;
    ::-webkit-scrollbar {
        display: none;
    }
`;

const Scrollbar = styled.div`
    width: 10px;
    height: 100%;
    right: 0;
    top: 0;
    position: absolute;
    border-radius: 7px;
    bottom: 0px;
    background-color: rgba(160, 160, 160, 0.35);
    opacity: ${(props: { hovering: boolean }) => (props.hovering ? 1 : 0)};
`;

const ScrollThumb = styled.div<{ height: number; top: number }>`
    height: ${(props: { height: number }) => props.height}px;
    top: ${(props: { top: number }) => props.top}px;
    width: 8px;
    margin-left: 1px;
    position: absolute;
    border-radius: 7px;
    background-color: rgba(160, 160, 160, 0.65);
`;

const SCROLL_BOX_MIN_HEIGHT = 20;

export const Scrollable = (props: {
    className?: string;
    children?: ReactNode;
}) => {
    const [hovering, setHovering] = useState(false);
    const [scrollBoxHeight, setScrollBoxHeight] = useState(
        SCROLL_BOX_MIN_HEIGHT
    );
    const [scrollBoxTop, setScrollBoxTop] = useState(0);
    const [lastScrollThumbPosition, setScrollThumbPosition] = useState(0);
    const [isDragging, setDragging] = useState(false);

    const handleMouseOver = useCallback(() => {
        setHovering(true);
    }, [hovering]);
    const handleMouseOut = useCallback(() => {
        setHovering(false);
    }, [hovering]);

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
                const scrollHostElement =
                    scrollHostRef.current as HTMLDivElement;
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

    const handleScrollThumbMouseDown = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            if (shouldDisplayScroll()) {
                e.preventDefault();
                e.stopPropagation();
                setScrollThumbPosition(e.clientY);
                setDragging(true);
            }
        },
        []
    );

    const handleScroll = useCallback(() => {
        if (!scrollHostRef) return;
        const scrollHostElement = scrollHostRef.current as HTMLDivElement;
        const { scrollTop, scrollHeight, offsetHeight } = scrollHostElement;
        let newTop = (scrollTop / scrollHeight) * offsetHeight;
        newTop = Math.min(newTop, offsetHeight - scrollBoxHeight);
        setScrollBoxTop(newTop);
    }, []);

    const shouldDisplayScroll = useCallback(() => {
        if (!scrollHostRef) return false;
        const scrollHostElement = scrollHostRef.current as HTMLDivElement;
        const { clientHeight, scrollHeight } = scrollHostElement;
        return clientHeight < scrollHeight;
    }, []);

    const scrollHostRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const scrollHostElement = scrollHostRef.current;
        const { clientHeight, scrollHeight } =
            scrollHostElement as HTMLDivElement;
        const scrollBoxPercentage = clientHeight / scrollHeight;
        const scrollbarHeight = Math.max(
            scrollBoxPercentage * clientHeight,
            SCROLL_BOX_MIN_HEIGHT
        );
        setScrollBoxHeight(scrollbarHeight);
        scrollHostElement?.addEventListener("scroll", handleScroll, true);
        return () => {
            scrollHostElement?.removeEventListener(
                "scroll",
                handleScroll,
                true
            );
        };
    }, [props.children]);

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

    return (
        <ScrollContainer
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <ScrollHost ref={scrollHostRef} className={props.className}>
                {props.children}
            </ScrollHost>
            <Scrollbar
                hovering={(hovering && shouldDisplayScroll()) || isDragging}
            >
                <ScrollThumb
                    height={scrollBoxHeight}
                    top={scrollBoxTop}
                    onMouseDown={handleScrollThumbMouseDown}
                />
            </Scrollbar>
        </ScrollContainer>
    );
};
