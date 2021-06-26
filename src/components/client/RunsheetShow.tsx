import { experimentalStyled as styled } from "@material-ui/core/styles";
import RunsheetHandler from "../common/RunsheetHandler";
import {
  Draggable,
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
  Droppable,
} from "react-beautiful-dnd";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import { getProperty,Type } from "../common/Storage";
import { useState } from "react";
import Status from "./Status";
import DragHandle from "./DragHandle";
import { add, stringify, INVALID as INVALID_POINT } from "../common/TimePoint";
import IconButton from "@material-ui/core/IconButton";
import { Stop, PlayArrow,  Delete } from "@material-ui/icons";
import RunsheetItem from "./RunsheetItem";
import { Goto } from "./Commands";
import MenuAddDropdown from "./RunsheetAddDropdown";

const Container = styled(Grid)`
  background-color: ${({ theme }) => theme.palette.background.default};
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.text.primary};
  border-radius: 25px;
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const Header = styled(Grid)`
  position: absulute;
  float: left;
  justify-content: center;
`;

const Text = styled(Grid)`
  text-align: center;
  vertical-align: middle;
  line-height: 48px;
  width: 20%;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const Control = styled(Grid)`
  width: 10%;
`;

const Children = styled(Grid)`
  clear: both;
  position: relative;
  float: left;
`;

const Collapsable = styled(Collapse)`
  width: 100%;
`;

const RunsheetShow =
  (props: { handler: RunsheetHandler }) =>
  (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
    rubric: DraggableRubric
  ) =>
    (
      <View
        handler={props.handler}
        provided={provided}
        snapshot={snapshot}
        rubric={rubric}
      />
    );

const View = (props: {
  handler: RunsheetHandler;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  rubric: DraggableRubric;
}) => {
  const [open, setOpen] = useState(false);
  const show = props.handler.getShow(props.rubric.draggableId);
  const tshow = props.handler.getTrackingShow(props.rubric.draggableId);
  if (show && tshow) {
    const session = props.handler.getStorage(show?.session || "");
    const renderItem = RunsheetItem(props.handler, show, INVALID_POINT);
    return (
      <Container
        container
        ref={props.provided.innerRef}
        {...props.provided.draggableProps}
      >
        <Header container>
          <Status
            active={props.handler.activeShow() === show.id}
            hasChildren={true}
            open={open}
            cb={setOpen}
          />
          <Text>
            <b>Service: </b>{" "}
            {session && show
              ? getProperty(session, show, "display")?.value
              : ""}
          </Text>
          <Text>
            <b>Start Time: </b>{" "}
            {stringify(
              session && show
                ? getProperty(session, show, "start_time")?.value ||
                    INVALID_POINT
                : INVALID_POINT
            )}
          </Text>
          <Text>
            <b>End Time: </b>{" "}
            {stringify(
              session && show
                ? add(
                    getProperty(session, show, "start_time")?.value ||
                      INVALID_POINT,
                    getProperty(session, show, "timer")?.value.duration ||
                      INVALID_POINT
                  )
                : INVALID_POINT
            )}
          </Text>
          <Text>
            <b>Run Time: </b>{" "}
            {stringify(
              session && show
                ? add(
                    getProperty(session, show, "start_time")?.value ||
                      INVALID_POINT,
                    getProperty(session, show, "timer")?.value.duration ||
                      INVALID_POINT
                  )
                : INVALID_POINT
            )}
          </Text>
          <Control>
            <IconButton
              onClick={() => {
                if (props.handler.activeShow() === show.id) Goto(show.id, "");
                else Goto(show.id, show.session);
              }}
            >
              {props.handler.activeShow() === show.id ? (
                <Stop />
              ) : (
                <PlayArrow />
              )}
            </IconButton>
            <MenuAddDropdown handler={props.handler} show={show.id} caller={show.session} blacklist={[Type.INVALID]}/>
            <IconButton>
              <Delete />
            </IconButton>
          </Control>
          <DragHandle dragHandle={props.provided.dragHandleProps} />
        </Header>
        <Collapsable in={open}>
          <Droppable
            key={props.rubric.draggableId}
            droppableId={props.rubric.draggableId}
            direction="vertical"
            type="session"
            renderClone={renderItem}
          >
            {(provided, snapshot) => (
              <Children
                container
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {session
                  ? getProperty(session, show, "index_list")?.value.map(
                      (child: string, index: number) => {
                        const id = `${show.id}_${child}`;
                        return show.tracking_list.includes(child) ? (
                          <Draggable key={id} draggableId={id} index={index}>
                            {renderItem}
                          </Draggable>
                        ) : (
                          provided.placeholder
                        );
                      }
                    )
                  : provided.placeholder}
              </Children>
            )}
          </Droppable>
        </Collapsable>
      </Container>
    );
  }
  return (
    <Container
      container
      ref={props.provided.innerRef}
      {...props.provided.draggableProps}
      {...props.provided.dragHandleProps}
    ></Container>
  );
};

export default RunsheetShow;
