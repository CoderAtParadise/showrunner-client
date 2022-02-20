import { useRef, useState } from "react";

export const useDraggable = (props: {
    id: string;
    type?: string;
    initial: { x: number; y: number };
}) => {
    const targetRef = useRef<HTMLElement | null>(null);
    const handleRef = useRef<HTMLElement | null>(null);
    const [isDragging, setDragging] = useState(false);
    const [position, setPosition] = useState(props.initial);

    return [targetRef, handleRef, position];
};
