import { experimentalStyled as styled } from "@material-ui/core/styles";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import Grid from "@material-ui/core/Grid";
import DragIndicator from "@material-ui/icons/DragIndicator";

const Container = styled(Grid)`
  width: 5%;
  height: 48px;
  text-align: center;
  vertical-align: middle;
  line-height: 64px;
`;

const Drag = styled(DragIndicator)`
  color: ${({ theme }) => theme.palette.text.primary};
`;

const DragHandle = (props: {
  dragHandle: DraggableProvidedDragHandleProps | undefined;
}) => {
  return (
    <Container {...props.dragHandle} item>
      <Drag />
    </Container>
  );
};

export default DragHandle;
