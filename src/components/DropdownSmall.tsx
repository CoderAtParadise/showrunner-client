import { KeyboardEvent, MouseEvent, useCallback, useState } from "react";
import styled from "@emotion/styled";
import { Scrollable } from "./Scrollable";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

const Content = styled.div`
  position: relative;
  user-select: none;
`;

const CollapsedSelected = styled.div`
  height: 1.2em;
  background-color: rgb(54, 54, 54);
  border: solid;
  color: white;
  margin-left: 5px;
  border-color: rgb(150, 150, 150);
  border-radius: 3px;
  width: calc(20px + 1rem);
  text-align: center;
  &:hover {
    cursor: pointer;
  }
`;

const DropdownArrow = styled(ArrowDropDown)`
  width: 10px;
  height: 100%;
  right: 5px;
  top: 0;
  position: absolute;
  bottom: 0px;
`;

const DropUpArrow = DropdownArrow.withComponent(ArrowDropUp);

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 1.8em;
  z-index: 1;
`;

const DropdownContent = styled(Scrollable)`
  height: fit-content;
  max-height: 14em;
  overflow: auto;
`;

const Suggestions = styled.ul`
  border: 1px solid;
  border-color: rgb(150, 150, 150);
  border-radius: 3px;
  margin-left: 5px;
  list-style: none;
  margin-top: 0;
  padding-left: 0;
  width: calc(20px + 1rem);
`;

const Suggested = styled.li<{ active: boolean }>`
  padding: 0.5rem;
  text-align: center;
  background-color: ${(props: { active: boolean }) =>
    props.active ? "rgb(100, 100, 100)" : "rgb(54, 54, 54)"};
  cursor: ${(props: { active: boolean }) => (props.active ? "pointer" : "")};
  :not(:last-of-type) {
    border-bottom: 1px solid #999;
  }
`;

export const DropdownSmall = (props: {
  className?: string;
  options: { label: string; id: string }[];
  value: { label: string; id: string };
  onChange: (value: { label: string; id: string }) => void;
}) => {
  const [hovering, setHovering] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedSuggested, setHighlightedSuggested] = useState(0);

  const handleMouseOver = useCallback(() => {
    setHovering(true);
  }, []);
  const handleMouseOut = useCallback(() => {
    setHovering(false);
  }, []);

  const highlighHouseOver = (index: number) => {
    setHighlightedSuggested(index);
  };

  const onButtonClick = () => {
    setHighlightedSuggested(0);
    setShowSuggestions(!showSuggestions);
  };

  const onFocusLost = () => {
    setHighlightedSuggested(0);
    setShowSuggestions(false);
  };

  const onClick = (e: MouseEvent<HTMLLIElement>) => {
    const select = props.options.find(
      (v: { label: string; id: string }) =>
        e.currentTarget.innerText === v.label
    ) || { label: "", id: "" };
    props.onChange(select);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setHighlightedSuggested(0);
      setShowSuggestions(false);
      props.onChange(props.options[highlightedSuggested]);
    } else if (e.key === "ArrowUp") {
      if (highlightedSuggested === 0) return;
      setShowSuggestions(true);
      setHighlightedSuggested(highlightedSuggested - 1);
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      setShowSuggestions(true);
      if (highlightedSuggested + 1 === props.options.length) return;
      setHighlightedSuggested(highlightedSuggested + 1);
      e.preventDefault();
    } else if (e.key === "Escape" || e.key === "Tab") {
      if (showSuggestions) {
        setShowSuggestions(false);
        setHighlightedSuggested(0);
        e.stopPropagation();
      } else {
        e.currentTarget.blur();
        e.stopPropagation();
      }
    }
  };

  return (
    <Content className={props.className}>
      <CollapsedSelected
        onKeyDown={onKeyDown}
        onBlur={onFocusLost}
        onClick={onButtonClick}
        tabIndex={0}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        {props.value.label}
        {hovering ? !showSuggestions ? <DropdownArrow /> : <DropUpArrow/> : null}
      </CollapsedSelected>
      <SuggestionsContainer>
        <DropdownContent>
          {showSuggestions ? (
            <Suggestions>
              {props.options.map((value, index) => (
                <Suggested
                  active={highlightedSuggested === index}
                  key={`${value.id}_${index}`}
                  onMouseDown={onClick}
                  onMouseEnter={() => highlighHouseOver(index)}
                  onMouseMove={() => highlighHouseOver(index)}
                >
                  {value.label}
                </Suggested>
              ))}
            </Suggestions>
          ) : null}
        </DropdownContent>
      </SuggestionsContainer>
    </Content>
  );
};
