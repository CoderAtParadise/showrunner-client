import {
    ChangeEvent,
    KeyboardEvent,
    MouseEvent,
    FocusEvent,
    useState
} from "react";
import styled from "@emotion/styled";
import { Scrollable } from "./Scrollable";

const Content = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
`;

const SuggestionsContainer = styled.div`
    max-height: 143px;
    position: absolute;
    top: 1.8em;
    z-index: 1;
`;

const Suggestions = styled.ul`
    border: 1px solid;
    border-color: rgb(150, 150, 150);
    border-radius: 3px;
    margin-left: 5px;
    list-style: none;
    margin-top: 0;
    padding-left: 0;
    width: calc(160px + 1rem);
`;

const Suggested = styled.li<{ active: boolean }>`
    padding: 0.5rem;
    background-color: ${(props: { active: boolean }) =>
        props.active ? "rgb(100, 100, 100)" : " rgb(54, 54, 54)"};
    cursor: ${(props: { active: boolean }) => (props.active ? "pointer" : "")};
    :not(:last-of-type) {
        border-bottom: 1px solid #999;
    }
`;

const Input = styled.input`
    background-color: rgb(54, 54, 54);
    border: solid;
    color: white;
    margin-left: 5px;
    border-color: rgb(150, 150, 150);
    border-radius: 3px;
`;

export const AutoComplete = (props: {
    className?: string;
    options: { label: string; id: string }[];
    value: { label: string; id: string };
    onChange: (value: { label: string; id: string }) => void;
}) => {
    const [filteredSuggestions, setFilteredSuggestions] = useState<
        { label: string; id: string }[]
    >([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedSuggested, setHighlightedSuggested] = useState(0);
    const [search, setSearch] = useState(props.value.label);

    const highlighHouseOver = (index: number) => {
        setHighlightedSuggested(index);
    };

    const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let filtered: { label: string; id: string }[] = [];
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
        setShowSuggestions(true);
    };

    const onFocusGain = (e: FocusEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        let filtered: { label: string; id: string }[] = [];
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
        setShowSuggestions(true);
    };

    const onFocusLost = () => {
        setHighlightedSuggested(0);
        setShowSuggestions(false);
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

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setSearch(filteredSuggestions[highlightedSuggested].label);
            setHighlightedSuggested(0);
            setShowSuggestions(false);
            props.onChange(filteredSuggestions[highlightedSuggested]);
        } else if (e.key === "ArrowUp") {
            if (highlightedSuggested === 0) return;
            setHighlightedSuggested(highlightedSuggested - 1);
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            if (highlightedSuggested + 1 === filteredSuggestions.length) return;
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

    const SuggestionList = () => {
        return filteredSuggestions.length ? (
            <Suggestions>
                {filteredSuggestions.map((suggestion, index) => (
                    <Suggested
                        active={highlightedSuggested === index}
                        key={suggestion.id}
                        onMouseDown={onClick}
                        onMouseEnter={() => highlighHouseOver(index)}
                        onMouseMove={() => highlighHouseOver(index)}
                    >
                        {suggestion.label}
                    </Suggested>
                ))}
            </Suggestions>
        ) : (
            <div>
                <em>No suggestions available.</em>
            </div>
        );
    };

    return (
        <Content className={props.className}>
            <Input
                type="text"
                onChange={onTextChange}
                onKeyDown={onKeyDown}
                value={search}
                onFocus={onFocusGain}
                onBlur={onFocusLost}
            />
            <SuggestionsContainer>
                <Scrollable>
                    {showSuggestions && search && <SuggestionList />}
                </Scrollable>
            </SuggestionsContainer>
        </Content>
    );
};
