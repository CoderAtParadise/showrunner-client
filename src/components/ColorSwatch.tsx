import styled from "@emotion/styled";
import { useState } from "react";
import { ChromePicker } from "react-color";

const Swatch = styled.div`
    padding: 2px;
    background-color: rgb(225, 225, 225);
    border-radius: 1px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    display: inline-block;
    cursor: pointer;
`;

const SwatchColor = styled.div`
    width: 1em;
    height: 1em;
    border-radius: 2px;
    background: ${(props: { color: string }) => props.color};
`;
const Popover = styled.div`
    position: absolute;
    z-index: 2;
`;

const Cover = styled.div`
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
`;

export const ColorSwatch = (props: {
    className?: string;
    color: string;
    onChange: (color: string) => void;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={props.className}>
            <Swatch onClick={() => setOpen(!open)}>
                <SwatchColor color={props.color} />
            </Swatch>
            {open ? (
                <Popover>
                    <Cover
                        onClick={() => setOpen(false)}
                        tabIndex={-1}
                    />
                    <ChromePicker
                        color={props.color}
                        onChange={(color) => props.onChange(color.hex)}
                    />
                </Popover>
            ) : null}
        </div>
    );
};
