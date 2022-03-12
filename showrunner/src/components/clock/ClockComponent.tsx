// import { useState } from "react";
// import { ClockIdentifier } from "@coderatparadise/showrunner-common";
// import { Box, experimentalStyled as styled, Collapse } from "@mui/material";
// import ClockPanel from "./ClockPanelComponent";
// import ClockSettingsComponent from "./ClockSettingsComponent";

// const Container = styled(Box)`
//     background-color: none;
//     margin: 1em 1em;
//     width: fit-content;
//     height: fit-content;
//     flex-direction: row;
//     display: flex;
//     align-items: flex-start;
//     align-content: flex-start;
//     overflow: hidden;
//     background-color: rgb(160, 160, 160);
//     background-image: linear-gradient(rgb(80, 80, 80), rgb(180, 180, 180));
//     border-style: solid;
//     border-radius: 1em;
//     border-width: 0.2em;
// `;

// const ClockComponent = (props: {
//     className?: string;
//     clock: ClockIdentifier;
// }) => {
//     const [settingsOpen, setSettingsOpen] = useState(false);
//     return (
//         <Container className={props.className}>
//             <ClockPanel
//                 clock={props.clock}
//                 settignsOpen={settingsOpen}
//                 displaySettings={setSettingsOpen}
//             />

//             <Collapse
//                 orientation="horizontal"
//                 timeout={{ enter: 300, exit: 300 }}
//                 easing={{ enter: "linear", exit: "linear" }}
//                 in={settingsOpen}
//             >
//                 <ClockSettingsComponent clock={props.clock} />
//             </Collapse>
//         </Container>
//     );
// };

// export default ClockComponent;
