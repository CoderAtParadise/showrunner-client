// import styled from "@emotion/styled";
// import { CloseRounded } from "@mui/icons-material";
// import { Dispatch, SetStateAction } from "react";
// import { ConfigBuilder } from "../config/ConfigBuilder";
// import { Tooltip, TooltipContent, TooltipTitle } from "../Tooltip";

// const Background = styled.div`
//     width: 100vw;
//     height: 100vh;
//     position: fixed;
//     left: 0;
//     top: 0;
//     background-color: rgb(200, 200, 200);
//     z-index: 2;
//     justify-content: center;
//     display: flex;
//     align-items: center;
// `;

// const Header = styled.div`
//     width: 100%;
//     height: 5%;
//     border-bottom: solid;
//     border-color: rgb(150, 150, 150);
//     align-items: center;
//     display: inline-block;
//     flex-direction: row;
// `;

// const ConfigContent = styled.div`
//     display: flex;
//     flex-direction: row;
//     height: 95%;
//     width: 100%;
// `;

// const Menu = styled.div`
//     width: 40em;
//     height: 40em;
//     background-color: rgb(54, 54, 54);
//     border: solid;
//     position: relative;
//     border-radius: 3px;
//     border-color: rgb(150, 150, 150);
// `;

// const Title = styled.div`
//     margin-top: 0.5em;
//     font-weight: bold;
//     width: 50%;
// `;

// const SettingsTooltip = styled(Tooltip)`
//     width: 10%;
//     position: absolute;
//     right: 0.5px;
// `;

// const CloseButton = styled(CloseRounded)`
//     width: 0.8em;
//     height: 0.8em;
//     float: right;
//     position: absolute;
//     top: 0.2em;
//     right: 0.2em;
//     color: rgb(255, 255, 255);
//     &:hover {
//         color: rgb(200, 200, 200);
//         cursor: pointer;
//     }
// `;

// const CloseButtonTooltipContent = styled(TooltipContent)`
//     top: -100%;
//     left: 125%;
// `;

// export const CreateClockMenu = (props: {
//     className?: string;
//     isOpen: boolean;
//     setOpen: Dispatch<SetStateAction<boolean>>;
//     config: ConfigBuilder;
// }) => {
//     return (
//         <Background
//             className={props.className}
//             onClick={() => props.setOpen(false)}
//         >
//             <Menu onClick={(e) => e.stopPropagation()}>
//                 <Header>
//                     <SettingsTooltip>
//                         <TooltipTitle>
//                             <CloseButton onClick={() => props.setOpen(false)} />
//                         </TooltipTitle>
//                         <CloseButtonTooltipContent>
//                             Close
//                         </CloseButtonTooltipContent>
//                     </SettingsTooltip>
//                     <Title>
//                         {props.config.get("widget.displayName")?.get() || ""}
//                     </Title>
//                 </Header>
//                 <ConfigContent></ConfigContent>
//             </Menu>
//         </Background>
//     );
// };
