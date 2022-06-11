import { useState, KeyboardEvent, MouseEvent } from "react";
import "./Dropdown.css"

export const Dropdown = (props: {
  options: { label: string; id: string }[];
  value: { label: string; id: string };
  onChange: (value: { label: string; id: string }) => void;
}) => {
  const [hovering, setHovering] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlightSuggested, setHighlightSuggested] = useState(0);

  const handleMouseOver = () => {
    setHovering(true);
  };

  const handleMouseOut = () => {
    setHovering(false);
  };

  const onFocusLost = () => {
    setHighlightSuggested(0);
    setOpen(false);
  };

  const onCollapsedClick = () => {
    setHighlightSuggested(0);
    setOpen(!open);
  };

  const onClick = (e: MouseEvent<HTMLLIElement>) => {
    const select = props.options.find(
      (value: { label: string; id: string }) =>
        e.currentTarget.innerText === value.label
    ) || { label: "", id: "" };
    props.onChange(select);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setHighlightSuggested(0);
      setOpen(false);
      props.onChange(props.options[highlightSuggested]);
    } else if (e.key === "ArrowUp") {
      if (highlightSuggested === 0) return;
      setOpen(true);
      setHighlightSuggested(highlightSuggested - 1);
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      setOpen(true);
      if (highlightSuggested + 1 === props.options.length) return;
      setHighlightSuggested(highlightSuggested + 1);
      e.preventDefault();
    } else if (e.key === "Escape" || e.key === "Tab") {
      if (open) {
        setOpen(false);
        setHighlightSuggested(0);
        e.stopPropagation();
      } else {
        e.currentTarget.blur();
        e.stopPropagation();
      }
    }
  };

  return (
    <div className="dropdown">
      <div className="collapsed" tabIndex={0} role="button" onKeyDown={onKeyDown} onClick={onCollapsedClick}>
        <div className="selected"><p>{props.value.label}</p></div>
        <div className="arrow" data-open={open}/>
      </div>
    </div>
  );
};
