import { indexOf } from "lodash";
import {
  useState,
  KeyboardEvent,
  MouseEvent,
  CSSProperties,
  useCallback,
} from "react";
import { VerticalScrollable } from "../scrollable/VerticalScrollable";
import "./Dropdown.css";

export const Dropdown = (props: {
  options: { label: string; id: string }[];
  value: { label: string; id: string };
  onChange: (value: { label: string; id: string }) => void;
  style?: CSSProperties;
}) => {
  const [open, setOpen] = useState(false);
  const [highlightedSuggested, setHighlightedSuggested] = useState(0);

  const handleMouseOut = useCallback(() => {
    setHighlightedSuggested(-1);
  }, []);

  const onFocusLost = () => {
    setHighlightedSuggested(0);
    setOpen(false);
  };

  const highlighHouseOver = (index: number) => {
    setHighlightedSuggested(index);
  };

  const onCollapsedClick = () => {
    setHighlightedSuggested(0);
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
    if (e.key === "Enter" && open) {
      setHighlightedSuggested(0);
      setOpen(false);
      if (highlightedSuggested !== -1)
        props.onChange(props.options[highlightedSuggested]);
    } else if (e.key === "ArrowUp") {
      if (highlightedSuggested === 0) return;
      setOpen(true);
      let suggested = highlightedSuggested;
      if (suggested === -1) {
        suggested = props.options.findIndex((value) => value.id === props.value.id);
        setHighlightedSuggested(suggested);
      }
      setHighlightedSuggested(suggested - 1);
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      setOpen(true);
      let suggested = highlightedSuggested;
      if (suggested === -1) {
        suggested = props.options.findIndex((value) => value.id === props.value.id);
        setHighlightedSuggested(suggested);
      }
      if (suggested + 1 === props.options.length) return;
      setHighlightedSuggested(suggested + 1);
      e.preventDefault();
    } else if (e.key === "Escape" || e.key === "Tab") {
      if (open) {
        setOpen(false);
        setHighlightedSuggested(0);
        e.stopPropagation();
      } else {
        e.currentTarget.blur();
        e.stopPropagation();
      }
    }
  };

  return (
    <div className="dropdown">
      <div
        className="collapsed"
        tabIndex={0}
        role="button"
        onKeyDown={onKeyDown}
        onBlur={onFocusLost}
        onClick={onCollapsedClick}
        style={props.style}
      >
        <div className="selected">
          <p>{props.value.label}</p>
        </div>
        <div className="arrow" data-open={open} />
      </div>
      {open ? (
        <div
          className="suggestions"
          style={props.style}
          onMouseOut={handleMouseOut}
        >
          <VerticalScrollable
            style={{ height: "fit-content", maxHeight: "12em" }}
          >
            <ul>
              {props.options.map((value, index) => (
                <li
                  data-selected={value.id === props.value.id}
                  data-hovering={highlightedSuggested === index}
                  key={`${value.id}_${index}`}
                  onMouseDown={onClick}
                  onMouseEnter={() => highlighHouseOver(index)}
                  onMouseMove={() => highlighHouseOver(index)}
                >
                  {value.label}
                </li>
              ))}
            </ul>
          </VerticalScrollable>
        </div>
      ) : null}
    </div>
  );
};
