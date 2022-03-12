// import {
//     ClockIdentifier,
//     ClockSource,
//     ClockState,
//     Offset,
//     SMPTE
// } from "@coderatparadise/showrunner-common";
// import {
//     Box,
//     TextField,
//     IconButton,
//     Tooltip,
//     Dialog,
//     DialogTitle,
//     DialogActions,
//     Button,
//     DialogContent,
//     MenuItem
// } from "@mui/material";
// import estyled from "@emotion/styled";
// import { styled } from "@mui/material/styles";
// import { OpenInFull, Delete as DeleteIcon } from "@mui/icons-material";
// import { useEffect, useState, Fragment } from "react";
// import { Delete as DeleteCommand, Edit } from "../../commands/Clock";
// import { zeroPad } from "../../util/ZeroPad";

// const Panel = styled(Box)`
//     height: 8em;
//     background-color: rgb(160, 160, 160);
//     background-image: linear-gradient(rgb(80, 80, 80), rgb(180, 180, 180));
//     width: 18em;
//     padding: 1em;

//     align-items: left;
//     justify-content: left;
//     text-align: left;
//     line-height: 2.5em;
//     position: relative;
// `;

// const Displayname = styled(TextField)`
//     width: 93%;
// `;
// const Seperator = estyled.span`
//     font-size: 2em;
// `;

// const AllSettings = styled(IconButton)`
//     padding: 10px;
//     width: 20px;
//     height: 20px;
//     float: right;
//     position: absolute;
//     right: 5px;
//     bottom: 5px;
//     z-index: 5;
//     &:hover {
//         color: rgb(200, 200, 200);
//     }
// `;

// const Delete = styled(IconButton)`
//     padding: 10px;
//     width: 20px;
//     height: 20px;
//     float: right;
//     position: absolute;
//     right: 25px;
//     bottom: 5px;
//     z-index: 5;
//     &:hover {
//         color: rgb(200, 200, 200);
//     }
// `;

// const NumberPicker = styled(TextField)`
//     width: 28%;
//     max-width: 75px;
// `;
// const OffsetSelect = styled(TextField)`
//     width: 75px;
//     margin-right: 0.6em;
//     height: 2.5em;
// `;
// const BehaviourSelect = styled(TextField)`
//     width: 7em;
//     height: 2.5em;
// `;

// const DirectionSelect = styled(TextField)`
//     width: 9em;
//     height: 2.5em;
// `;

// const DiagContainer = styled(Box)`
//     padding: 1em;
//     align-items: left;
//     justify-content: left;
//     text-align: left;
//     line-height: 2.5em;
//     width: 22em;
// `;

// const Title = styled(Box)`
//     font-weight: bold;
//     text-decoration: underline;
// `;

// const DisplayTime = (props: {
//     className?: string;
//     clock: ClockSource<any>;
//     label?: boolean;
// }) => {
//     const configTime = props.clock.settings?.time;
//     const [hrs, setHrs] = useState(configTime.hours());
//     const [min, setMin] = useState(configTime.minutes());
//     const [sec, setSec] = useState(configTime.seconds());
//     const [oldTime, setOldTime] = useState(configTime);
//     useEffect(() => {
//         if (!oldTime.equals(configTime)) {
//             setOldTime(configTime);
//             setHrs(configTime.hours());
//             setMin(configTime.minutes());
//             setSec(configTime.seconds());
//         }
//     }, [configTime]);

//     useEffect(() => {
//         if (
//             hrs !== configTime.hours() ||
//             min !== configTime.minutes() ||
//             sec !== configTime.seconds()
//         ) {
//             const delayChange = setTimeout(() => {
//                 Edit(props.clock.show, props.clock.id, {
//                     time: `${configTime.offset()}${zeroPad(hrs, 2)}:${zeroPad(
//                         min,
//                         2
//                     )}:${zeroPad(sec, 2)}:00`
//                 });
//             }, 500);
//             return () => clearTimeout(delayChange);
//         }
//         return () => {};
//     }, [hrs, min, sec]);
//     return (
//         <Box className={props.className}>
//             {
//                 // prettier-ignore
//                 props?.label
//                     ? (
//                         <Fragment>
//                             <Title>Time</Title>
//                             <DisplayOffset clock={props.clock} />{" "}
//                         </Fragment>
//                     )
//                     : null
//             }
//             <NumberPicker
//                 type="number"
//                 variant="outlined"
//                 size="small"
//                 fullWidth={false}
//                 inputProps={{
//                     min: 0,
//                     max: 23,
//                     readOnly:
//                         props.clock.state === ClockState.RUNNING ||
//                         props.clock.state === ClockState.PAUSED
//                 }}
//                 onChange={(event) => setHrs(parseInt(event.target.value))}
//                 value={hrs}
//             />
//             <Seperator>:</Seperator>
//             <NumberPicker
//                 type="number"
//                 size="small"
//                 fullWidth={false}
//                 inputProps={{
//                     min: 0,
//                     max: 59,
//                     readOnly:
//                         props.clock.state === ClockState.RUNNING ||
//                         props.clock.state === ClockState.PAUSED
//                 }}
//                 onChange={(event) => setMin(parseInt(event.target.value))}
//                 value={min}
//             ></NumberPicker>
//             <Seperator>:</Seperator>
//             <NumberPicker
//                 type="number"
//                 size="small"
//                 fullWidth={false}
//                 inputProps={{
//                     min: 0,
//                     max: 59,
//                     readOnly:
//                         props.clock.state === ClockState.RUNNING ||
//                         props.clock.state === ClockState.PAUSED
//                 }}
//                 onChange={(event) => setSec(parseInt(event.target.value))}
//                 value={sec}
//             ></NumberPicker>
//         </Box>
//     );
// };

// const Time = styled(DisplayTime)`
//     padding-top: ${(props) => (!props.label ? "0.6em" : 0)};
// `;

// const DisplayDirection = (props: { clock: ClockSource<any> }) => {
//     const settings = (props.clock.data() as any).settings;
//     if (settings?.direction !== undefined) {
//         const [direction, setDirection] = useState(settings!.direction);

//         useEffect(() => {
//             if (direction !== settings.direction) {
//                 const delayChange = setTimeout(() => {
//                     Edit(props.clock.show, props.clock.id, {
//                         direction: direction
//                     });
//                 }, 500);
//                 return () => clearTimeout(delayChange);
//             }
//             return () => {};
//         }, [direction]);
//         return (
//             <Fragment>
//                 <Title>Direction</Title>
//                 <DirectionSelect
//                     select
//                     size="small"
//                     value={direction}
//                     defaultValue={direction}
//                     onChange={(event) =>
//                         setDirection(event.target.value as Offset)
//                     }
//                 >
//                     <MenuItem value={"countdown"}>Countdown</MenuItem>
//                     <MenuItem value={"countup"}>Countup</MenuItem>
//                 </DirectionSelect>
//             </Fragment>
//         );
//     }
//     return null;
// };

// const DisplayBehaviour = (props: { clock: ClockSource<any> }) => {
//     const settings = (props.clock.data() as any).settings;
//     if (settings?.behaviour !== undefined) {
//         const [behaviour, setBehaviour] = useState(settings!.behaviour);

//         useEffect(() => {
//             if (behaviour !== settings.behaviour) {
//                 const delayChange = setTimeout(() => {
//                     Edit(props.clock.show, props.clock.id, {
//                         behaviour: behaviour
//                     });
//                 }, 500);
//                 return () => clearTimeout(delayChange);
//             }
//             return () => {};
//         }, [behaviour]);
//         return (
//             <Fragment>
//                 <Title>Behaviour</Title>
//                 <BehaviourSelect
//                     select
//                     size="small"
//                     value={behaviour}
//                     defaultValue={behaviour}
//                     onChange={(event) =>
//                         setBehaviour(event.target.value as Offset)
//                     }
//                 >
//                     <MenuItem value={"stop"}>Stop</MenuItem>
//                     <MenuItem value={"overrun"}>Overrun</MenuItem>
//                 </BehaviourSelect>
//             </Fragment>
//         );
//     }
//     return null;
// };

// const DisplayOffset = (props: { clock: ClockSource<any> }) => {
//     const settings = (props.clock.data() as any).settings;
//     if (settings?.offset !== undefined) {
//         const doffset = new SMPTE(settings.offset).offset();
//         const [offset, setOffset] = useState(doffset);

//         useEffect(() => {
//             if (offset !== doffset) {
//                 const delayChange = setTimeout(() => {
//                     const old = new SMPTE(settings.offset);
//                     Edit(props.clock.show, props.clock.id, {
//                         time: `${offset}${zeroPad(old.hours(), 2)}:${zeroPad(
//                             old.minutes(),
//                             2
//                         )}:${zeroPad(old.seconds(), 2)}:00`
//                     });
//                 }, 500);
//                 return () => clearTimeout(delayChange);
//             }
//             return () => {};
//         }, [offset]);

//         switch (props.clock.type) {
//             case "offset":
//             case "tod:offset":
//                 return (
//                     <OffsetSelect
//                         select
//                         size="small"
//                         value={offset}
//                         defaultValue={offset}
//                         onChange={(event) =>
//                             setOffset(event.target.value as Offset)
//                         }
//                     >
//                         <MenuItem value={Offset.START}>{Offset.START}</MenuItem>
//                         <MenuItem value={Offset.END}>{Offset.END}</MenuItem>
//                     </OffsetSelect>
//                 );
//             default:
//                 return null;
//         }
//     }
//     return null;
// };

// const ClockSettingsComponent = (props: {
//     className?: string;
//     clock: ClockIdentifier;
// }) => {
//     const [open, setOpen] = useState(false);
//     const [settingsOpen, setSettingsOpen] = useState(false);
//     const [displayName, setDisplayName] = useState(
//         props.clock.clock.settings.displayName
//     );

//     useEffect(() => {
//         if (displayName !== props.clock.clock.settings.displayName) {
//             const delayChange = setTimeout(() => {
//                 Edit(props.clock.clock.show, props.clock.clock.id, {
//                     displayName: displayName
//                 });
//             }, 500);
//             return () => clearTimeout(delayChange);
//         }
//         return () => {};
//     }, [displayName]);
//     return (
//         <Panel className={props.className}>
//             <Displayname
//                 id="displayName"
//                 variant="outlined"
//                 size="small"
//                 inputProps={{ maxLength: 20 }}
//                 onChange={(event) => setDisplayName(event.target.value)}
//                 value={displayName}
//                 defaultValue={displayName}
//             />
//             <Time clock={props.clock.clock} />
//             <Tooltip title="Delete">
//                 <Delete
//                     onClick={() => {
//                         setOpen(true);
//                     }}
//                 >
//                     <DeleteIcon />
//                 </Delete>
//             </Tooltip>
//             <Tooltip title="All Settings">
//                 <AllSettings
//                     onClick={() => {
//                         setSettingsOpen(true);
//                     }}
//                 >
//                     <OpenInFull />
//                 </AllSettings>
//             </Tooltip>
//             <Dialog open={open} onClose={() => setOpen(false)}>
//                 <DialogTitle>{`Are you sure you want to delete "${props.clock.clock.settings.displayName}"?`}</DialogTitle>
//                 <DialogActions>
//                     <Button
//                         onClick={() => {
//                             setOpen(false);
//                         }}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         autoFocus
//                         onClick={() => {
//                             DeleteCommand(
//                                 props.clock.clock.show,
//                                 props.clock.clock.id
//                             );
//                             setOpen(false);
//                         }}
//                     >
//                         Delete
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//             <Dialog
//                 open={settingsOpen}
//                 onClose={() => {
//                     setSettingsOpen(false);
//                 }}
//             >
//                 <DialogTitle>{`Configure ${props.clock.clock.settings.displayName}`}</DialogTitle>
//                 <DialogContent>
//                     <DiagContainer>
//                         <Title>Display Name</Title>
//                         <Displayname
//                             id="displayName"
//                             variant="outlined"
//                             size="small"
//                             inputProps={{ maxLength: 20 }}
//                             onChange={(event) =>
//                                 setDisplayName(event.target.value)
//                             }
//                             value={displayName}
//                             defaultValue={displayName}
//                         />
//                         <Time label clock={props.clock.clock} />
//                         <DisplayBehaviour clock={props.clock.clock} />
//                         <DisplayDirection clock={props.clock.clock} />
//                     </DiagContainer>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setSettingsOpen(false)}>
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Panel>
//     );
// };

// export default ClockSettingsComponent;
