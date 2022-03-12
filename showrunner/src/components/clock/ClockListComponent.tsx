// import { ClockIdentifier } from "@coderatparadise/showrunner-common";
// import { Box, experimentalStyled as styled } from "@mui/material";
// import ClockListHeader from "./ClockListHeaderComponent";
// import { useRecoilValue } from "recoil";
// import { clocksState } from "../Sync/Clocks";
// import ClockComponent from "./ClockComponent";

// const Container = styled(Box)`
//     display: flex;
//     width: 100vw;
//     height: fit-content;
//     flex-direction: row;
//     align-items: flex-start;
//     align-content: flex-start;
//     flex-wrap: wrap;
// `;

// // function onDragEnd(result: DropResult): void {
// //     if (!result.destination) return;

// //     if (result.source.index === result.destination.index) return;
// // }

// const ClockList = (props: { className?: string; show: string }) => {
//     const label = useRecoilValue(clocksState(props.show));
//     return (
//         <Container className={props.className}>
//             <ClockListHeader show={props.show} />
//             {Array.from(label.values()).map((clock: ClockIdentifier) => {
//                 return <ClockComponent key={clock.clock.id} clock={clock} />;
//             })}
//         </Container>
//     );
// };

// export default ClockList;
