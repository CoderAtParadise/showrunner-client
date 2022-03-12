// import { useEffect, useRef, useState } from "react";

// export const useDraggable = (props: {
//     id: string;
//     type?: string;
//     initial: { x: number; y: number };
// }) => {
//     const targetRef = useRef<HTMLElement | null>(null);
//     const handleRef = useRef<HTMLElement | null>(null);
//     const [isDragging, setDragging] = useState(false);
//     const [prev, setPrev] = useState({ x: 0, y: 0 });
//     const [delta, setDelta] = useState({ x: 0, y: 0 });
//     const disabled = useRef(false);
//     const initial = useRef({ x: 0, y: 0 });

//     useEffect(() => {
//         const handle = handleRef.current || targetRef.current;
//         handle?.addEventListener("mousedown", startDragging);
//         handle?.addEventListener("touchstart", startDragging);

//         return () => {
//             handle?.removeEventListener("mousedown", startDragging);
//             handle?.removeEventListener("touchstart", startDragging);
//         };
//     });

//     function startDragging(event: any) {
//         if (!disabled) {
//             event.preventDefault();
//             setDragging(true);
//             const source = (event.touches && event.touches[0]) || event;
//             const { clientX, clientY } = source;
//             initial.current = { x: clientX, y: clientY };
//         }
//     }

//     function stopDragging(event: any) {
//         event.preventDefault();
//         setDragging(false);
//         const newDelta = reposition(event);
//         setPrev(newDelta);
//     }

//     useEffect(() => {
//         // const handle = handleRef.current || targetRef.current;
//         if (isDragging) {
//             document.addEventListener("mousemove", reposition, {
//                 passive: true
//             });
//             document.addEventListener("touchmove", reposition, {
//                 passive: true
//             });
//             document.addEventListener("mouseup", stopDragging);
//             document.addEventListener("touchend", stopDragging);
//         }
//         return () => {
//             document.removeEventListener("mousemove", reposition, {
//                 passive: true
//             });
//             document.removeEventListener("mouseup", stopDragging);
//             document.removeEventListener("touchmove", reposition, {
//                 passive: true
//             });
//             document.removeEventListener("touchend", stopDragging);
//         };
//     });

//     function reposition(event: any) {
//         const source =
//         (event.changedTouches && event.changedTouches[0]) ||
//         (event.touches && event.touches[0]) ||
//         event;
//       const { clientX, clientY } = source;
//       const x = clientX - initial.current.x + prev.x;
//       const y = clientY - initial.current.y + prev.y;

//       const newDelta = calcDelta({
//         x,
//         y,
//         // limits: limits.current
//       });
//       setDelta(newDelta);

//       return newDelta;
//     }
//   }, [isDragging, prev);
//     }

//     useEffect(() => {});

//     return { targetRef, handleRef, isDragging };
// };
