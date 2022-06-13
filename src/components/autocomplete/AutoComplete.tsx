import {
  CSSProperties,
  useState,
  KeyboardEvent,
  MouseEvent,
  ChangeEvent,
  FocusEvent,
  useCallback,
} from "react";
import { VerticalScrollable } from "../scrollable/VerticalScrollable";
import "./AutoComplete.css";

export const AutoComplete = (props: {
  options: { label: string; id: string }[];
  value: { label: string; id: string };
  onChange: (value: { label: string; id: string }) => void;
  style?: CSSProperties;
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    { label: string; id: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [highlightedSuggested, setHighlightedSuggested] = useState(0);
  const [search, setSearch] = useState(props.value.label);

  const highlighHouseOver = (index: number) => {
    setHighlightedSuggested(index);
  };

  const onFocusGain = (e: FocusEvent<HTMLInputElement>) => {
    console.log("Hello");
    const value = e.currentTarget.value;
    let filtered: { label: string; id: string }[] = props.options;
    if (value.length > 0) {
      filtered = props.options
        .sort()
        .filter(
          (v: { label: string; id: string }) =>
            v.label.toLowerCase().indexOf(value.toLowerCase()) > -1
        );
    }
    setFilteredSuggestions(filtered);
    setHighlightedSuggested(0);
    setOpen(true);
  };

  const handleMouseOut = useCallback(() => {
    setHighlightedSuggested(-1);
  }, []);

  const onFocusLost = () => {
    setHighlightedSuggested(0);
    setOpen(false);
    setFilteredSuggestions([]);
  };

  const onClick = (e: MouseEvent<HTMLLIElement>) => {
    setSearch(e.currentTarget.innerText);
    props.onChange(
      props.options.find(
        (v: { label: string; id: string }) =>
          e.currentTarget.innerText === v.label
      ) || { label: "", id: "" }
    );
  };

  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let filtered: { label: string; id: string }[] = props.options;
    if (value.length > 0) {
      filtered = props.options
        .sort()
        .filter(
          (v: { label: string; id: string }) =>
            v.label.toLowerCase().indexOf(value.toLowerCase()) > -1
        );
    }

    setSearch(value);
    setFilteredSuggestions(filtered);
    setHighlightedSuggested(0);
    setOpen(true);
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
        suggested = props.options.findIndex(
          (value) => value.id === props.value.id
        );
        setHighlightedSuggested(suggested);
      }
      setHighlightedSuggested(suggested - 1);
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      setOpen(true);
      let suggested = highlightedSuggested;
      if (suggested === -1) {
        suggested = props.options.findIndex(
          (value) => value.id === props.value.id
        );
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
    <div className="autocomplete">
      <input
        className="input"
        onChange={onTextChange}
        onKeyDown={onKeyDown}
        value={search}
        onFocus={onFocusGain}
        onBlur={onFocusLost}
        style={props.style}
      />
      <div
        className="suggestions"
        style={props.style}
        onMouseOut={handleMouseOut}
      >
        <VerticalScrollable
          style={{ height: "fit-content", maxHeight: "12em" }}
        >
          {open ? (
            <ul>
              {filteredSuggestions.length ? (
                filteredSuggestions.map((suggestion, index) => (
                  <li
                    data-selected={suggestion.id === props.value.id}
                    data-hovering={highlightedSuggested === index}
                    key={suggestion.id}
                    onMouseDown={onClick}
                    onMouseEnter={() => highlighHouseOver(index)}
                    onMouseMove={() => highlighHouseOver(index)}
                  >
                    {suggestion.label}
                  </li>
                ))
              ) : (
                <li>
                  <em>No suggestions available.</em>
                </li>
              )}
            </ul>
          ) : null}
        </VerticalScrollable>
      </div>
    </div>
  );
};
