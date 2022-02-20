import estyled from "@emotion/styled";
import {
    Box,
    experimentalStyled as styled,
    IconButton,
    Tooltip,
    Dialog,
    Button,
    DialogContent,
    DialogActions,
    DialogTitle,
    TextField,
    MenuItem,
    Autocomplete
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { Add } from "@mui/icons-material";
import { Offset } from "@coderatparadise/showrunner-common";
import { useRecoilValue } from "recoil";
import { clocksState } from "../Sync/Clocks";
import { Create } from "../../commands/Clock";
import { zeroPad } from "../../util/ZeroPad";

const Container = styled(Box)`
    width: 100%;
    padding: 0.8em;
`;

const Header = styled(Box)`
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    align-content: flex-start;
`;

const HR = estyled.hr`
    width:100%;
`;

const Title = styled(Box)`
    font-weight: bold;
    font-size: 1.2em;
    padding-right: 0.8em;
`;

const AddButton = styled(IconButton)`
    width: 0.8em;
    height: 0.8em;
    &:hover {
        color: rgb(200, 200, 200);
    }
`;
const Authority = styled(Autocomplete)``;

const TypeSelector = styled(TextField)`
    width: 9em;
`;

enum ClockType {
    TIMER = "timer",
    TOD = "tod",
    OFFSET = "offset"
}

const DiagContainer = styled(Box)`
    padding: 1em;
    align-items: left;
    justify-content: left;
    text-align: left;
    line-height: 2.5em;
    width: 22em;
`;

const CreateTitle = styled(Box)`
    font-weight: bold;
    text-decoration: underline;
`;

const Displayname = styled(TextField)`
    width: 93%;
`;

const NumberPicker = styled(TextField)`
    width: 28%;
    max-width: 75px;
`;

const Seperator = estyled.span`
    font-size: 2em;
`;

const ListClocks = (show: string) => {
    const clocks = useRecoilValue(clocksState(show));
    const ret: { label: string; id: string }[] = [];
    Array.from(clocks.values())
        .filter(
            (clock) =>
                clock.clock.type !== "offset" &&
                clock.clock.type !== "tod:offset" &&
                clock.clock.type !== "sync"
        )
        .forEach((clock) =>
            ret.push({ label: clock.clock.displayName, id: clock.clock.id })
        );
    return ret;
};

const DisplayAuthority = (props: {
    className?: string;
    show: string;
    type: ClockType;
    setAuthority: Dispatch<SetStateAction<string>>;
}) => {
    const clocks = ListClocks(props.show);
    if (props.type === ClockType.OFFSET) {
        return (
            <Box className={props.className}>
                <CreateTitle>Authority</CreateTitle>
                <Authority
                    options={clocks}
                    onChange={(event, value) => {
                        props.setAuthority(
                            (value as { label: string; id: string }).id
                        );
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Box>
        );
    }
    return null;
};

const DisplayDirection = (props: {
    className?: string;
    type: ClockType;
    direction: string;
    setDirection: Dispatch<SetStateAction<string>>;
}) => {
    if (props.type === ClockType.TIMER) {
        return (
            <Box className={props.className}>
                <CreateTitle>Direction</CreateTitle>
                <TypeSelector
                    select
                    size="small"
                    value={props.direction}
                    onChange={(event) => props.setDirection(event.target.value)}
                >
                    <MenuItem value={"countdown"}>Countdown</MenuItem>
                    <MenuItem value={"countup"}>Countup</MenuItem>
                </TypeSelector>
            </Box>
        );
    }
    return null;
};

const DisplayTime = (props: {
    className?: string;
    type: ClockType;
    time: {
        offset: Offset;
        setOffset: Dispatch<SetStateAction<Offset>>;
        hrs: number;
        setHrs: Dispatch<SetStateAction<number>>;
        min: number;
        setMin: Dispatch<SetStateAction<number>>;
        sec: number;
        setSec: Dispatch<SetStateAction<number>>;
    };
}) => {
    return (
        <Box className={props.className}>
            <CreateTitle>
                {
                    // prettier-ignore
                    props.type === ClockType.OFFSET
                        ? "Offset"
                        : props.type === ClockType.TIMER
                            ? "Duration"
                            : "Time"
                }
            </CreateTitle>
            {
                // prettier-ignore
                props.type === ClockType.OFFSET
                    ? (
                        <NumberPicker
                            select
                            size="small"
                            value={props.time.offset}
                            onChange={(event) =>
                                props.time.setOffset(event.target.value as Offset)
                            }
                        >
                            <MenuItem value={Offset.START}>{Offset.START}</MenuItem>
                            <MenuItem value={Offset.END}>{Offset.END}</MenuItem>
                        </NumberPicker>
                    )
                    : null
            }
            <NumberPicker
                type="number"
                variant="outlined"
                size="small"
                fullWidth={false}
                inputProps={{
                    min: 0,
                    max: 23
                }}
                onChange={(event) =>
                    props.time.setHrs(parseInt(event.target.value))
                }
                value={props.time.hrs}
            />
            <Seperator>:</Seperator>
            <NumberPicker
                type="number"
                size="small"
                fullWidth={false}
                inputProps={{
                    min: 0,
                    max: 59
                }}
                onChange={(event) =>
                    props.time.setMin(parseInt(event.target.value))
                }
                value={props.time.min}
            ></NumberPicker>
            <Seperator>:</Seperator>
            <NumberPicker
                type="number"
                size="small"
                fullWidth={false}
                inputProps={{
                    min: 0,
                    max: 59
                }}
                onChange={(event) =>
                    props.time.setSec(parseInt(event.target.value))
                }
                value={props.time.sec}
            ></NumberPicker>
        </Box>
    );
};

const ClockListHeader = (props: { className?: string; show: string }) => {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState(ClockType.TIMER);
    const [displayName, setDisplayName] = useState("");
    const [authority, setAuthority] = useState("");
    const [offset, setOffset] = useState(Offset.START);
    const [hrs, setHrs] = useState(0);
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);
    const [behaviour, setBehaviour] = useState("stop");
    const [direction, setDirection] = useState("countdown");

    const closeDialog = () => {
        setOpen(false);
        setType(ClockType.TIMER);
        setDisplayName("");
        setAuthority("");
        setOffset(Offset.START);
        setHrs(0);
        setMin(0);
        setSec(0);
        setBehaviour("stop");
        setDirection("countdown");
    };

    return (
        <Container>
            <Header className={props.className}>
                <Title>System</Title>
                <Tooltip title="Add Timer">
                    <AddButton onClick={() => setOpen(true)}>
                        <Add />
                    </AddButton>
                </Tooltip>
            </Header>
            <HR />
            <Dialog open={open} onClose={closeDialog}>
                <DialogTitle>Create Clock</DialogTitle>
                <DialogContent>
                    <DiagContainer>
                        <CreateTitle>Type</CreateTitle>
                        <TypeSelector
                            select
                            size="small"
                            value={type}
                            defaultValue={type}
                            onChange={(event) =>
                                setType(event.target.value as ClockType)
                            }
                        >
                            <MenuItem value={ClockType.TIMER}>Timer</MenuItem>
                            <MenuItem value={ClockType.TOD}>
                                Time of Day
                            </MenuItem>
                            <MenuItem value={ClockType.OFFSET}>Offset</MenuItem>
                        </TypeSelector>
                        <CreateTitle>Display Name</CreateTitle>
                        <Displayname
                            id="displayName"
                            variant="outlined"
                            size="small"
                            inputProps={{ maxLength: 20 }}
                            onChange={(event) =>
                                setDisplayName(event.target.value)
                            }
                            value={displayName}
                        />
                        <DisplayAuthority
                            type={type}
                            show={props.show}
                            setAuthority={setAuthority}
                        />
                        <DisplayTime
                            type={type}
                            time={{
                                offset: offset,
                                setOffset: setOffset,
                                hrs: hrs,
                                setHrs: setHrs,
                                min: min,
                                setMin: setMin,
                                sec: sec,
                                setSec: setSec
                            }}
                        />
                        <CreateTitle>Behaviour</CreateTitle>
                        <TypeSelector
                            select
                            size="small"
                            value={behaviour}
                            onChange={(event) =>
                                setBehaviour(event.target.value)
                            }
                        >
                            <MenuItem value={"stop"}>Stop</MenuItem>
                            <MenuItem value={"overrun"}>Overrun</MenuItem>
                        </TypeSelector>
                        <DisplayDirection
                            type={type}
                            direction={direction}
                            setDirection={setDirection}
                        />
                    </DiagContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button
                        autoFocus
                        onClick={() => {
                            Create(props.show, {
                                owner: "system",
                                type: type,
                                displayName: displayName,
                                authority: authority,
                                time:
                                    type === "offset"
                                        ? `${offset}${zeroPad(
                                            hrs,
                                            2
                                        )}:${zeroPad(min, 2)}:${zeroPad(
                                            sec,
                                            2
                                        )}:00`
                                        : `${zeroPad(hrs, 2)}:${zeroPad(
                                            min,
                                            2
                                        )}:${zeroPad(sec, 2)}:00`,
                                behaviour: behaviour,
                                direction: direction
                            });
                            closeDialog();
                        }}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ClockListHeader;
