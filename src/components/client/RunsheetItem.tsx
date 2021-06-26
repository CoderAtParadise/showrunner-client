import { Type, getProperty, hasProperty } from "../common/Storage";
import Show from "../common/Show";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { useState } from "react";
import { Notes, ExitToApp, Edit } from "@material-ui/icons";
import RunsheetHandler from "../common/RunsheetHandler";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DraggableRubric,
} from "react-beautiful-dnd";
import TrackingShow from "../common/TrackingShow";
import TimeView from "./Time";
import TimePoint, { INVALID as INVALID_POINT } from "../common/TimePoint";
import { ParentProperty } from "../common/property/Parent";
import { Switch } from "@material-ui/core";
import { Goto, Update } from "./Commands";
import Status from "./Status";
import DragHandle from "./DragHandle";
import DeleteDialog from "./DeleteDialog";
import MenuAddDropdown from "./RunsheetAddDropdown";

const Container = styled(Grid)`
  width: 100%;
  border-style: solid;
  border-color: ${(props: { rtype: Type }) =>
    props.rtype === Type.BRACKET ? "darkturquoise" : "mediumslateblue"};
  border-radius: 25px;
  margin: ${({ theme }) => theme.spacing(1)};
`;

const Time = styled(TimeView)`
  width: 15%;
`;
const Display = styled(Grid)`
  width: 30%;
  color: ${({ theme }) => theme.palette.text.secondary};
  text-align: center;
  vertical-align: middle;
  line-height: 48px;
`;

const Children = styled(Grid)`
  flex-grow: 1;
`;

const Settings = styled(Grid)`
  width: 8%;
  color: ${({ theme }) => theme.palette.text.secondary};
  text-align: center;
  vertical-align: middle;
  line-height: 48px;
  margin-left: ${({ theme }) => theme.spacing(1)};
`;

const Controls = styled(Grid)`
  width: 10%;
  color: ${({ theme }) => theme.palette.text.secondary};
  text-align: center;
  vertical-align: middle;
  line-height: 48px;
  margin-left: ${({ theme }) => theme.spacing(1)};
`;

const NotesContainer = styled(Grid)`
  width: 5%;
  color: ${({ theme }) => theme.palette.text.secondary};
  text-align: center;
  vertical-align: middle;
  line-height: 48px;
  margin-left: ${({ theme }) => theme.spacing(1)};
`;

const Collapsable = styled(Collapse)`
  width: 100%;
`;

function isActive(
  handler: RunsheetHandler,
  show: Show,
  trackingShow: TrackingShow,
  tracking: string
): boolean {
  if (trackingShow.active !== tracking) {
    const active = handler.getStorage(trackingShow.active);
    if (active) {
      const pid = getProperty(active, show, "parent") as ParentProperty;
      if (pid) return pid.value === tracking;
    }
    return false;
  }
  return true;
}

const RunsheetItem =
  (handler: RunsheetHandler, show: Show, offset: TimePoint) =>
  (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
    rubric: DraggableRubric
  ) =>
    (
      <View
        handler={handler}
        show={show}
        offset={offset}
        provided={provided}
        snapshot={snapshot}
        rubric={rubric}
      />
    );

const View = (props: {
  handler: RunsheetHandler;
  show: Show;
  offset: TimePoint;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  rubric: DraggableRubric;
}) => {
  const [open, setOpen] = useState(false);
  const split = props.rubric.draggableId.split("_");
  const storage = props.handler.getStorage(split[1]);
  const tshow = props.handler.getTrackingShow(props.show.id);
  let offset: TimePoint = INVALID_POINT;
  const renderItem = RunsheetItem(props.handler, props.show, offset);
  if (storage && tshow) {
    return (
      <Container
        container
        ref={props.provided.innerRef}
        {...props.provided.draggableProps}
        rtype={storage.type}
      >
        <Status
          active={isActive(props.handler, props.show, tshow, split[1])}
          hasChildren={hasProperty(storage, "index_list")}
          open={open}
          cb={setOpen}
        />
        <Display item>
          {storage ? getProperty(storage, props.show, "display")?.value : ""}
        </Display>
        <Time handler={props.handler} show={props.show.id} id={split[1]} />
        <Time handler={props.handler} show={props.show.id} id={split[1]} />
        <Time handler={props.handler} show={props.show.id} id={split[1]} />
        <Settings item>
          {storage
            ? getProperty(
                storage,
                props.show,
                "timer"
              )?.value.type.toUpperCase()
            : ""}
        </Settings>
        <Settings item>
          {storage
            ? getProperty(
                storage,
                props.show,
                "timer"
              )?.value.behaviour.toUpperCase()
            : ""}
        </Settings>
        <NotesContainer item>
          <IconButton>
            <Notes />
          </IconButton>
        </NotesContainer>
        <Controls item>
          <IconButton onClick={() => Goto(props.show.id, split[1])}>
            <ExitToApp />
          </IconButton>
          <Switch
            onChange={() => {
              Update(props.show.id, split[1], [
                {
                  reset: false,
                  override: true,
                  property: {
                    key: "disabled",
                    value: storage
                      ? !getProperty(storage, props.show, "disabled")?.value
                      : false,
                  },
                },
              ]);
            }}
            checked={
              storage
                ? !getProperty(storage, props.show, "disabled")?.value
                : false
            }
          />
        </Controls>
        <Controls item>
          <IconButton>
            <Edit />
          </IconButton>
          <MenuAddDropdown handler={props.handler} show={props.show.id} caller={split[1]} blacklist={[Type.INVALID,Type.SESSION, storage.type !== Type.BRACKET ? Type.BRACKET : Type.INVALID]}/>
          <DeleteDialog handler={props.handler} show={props.show.id} delete={split[1]}/>
        </Controls>
        <DragHandle dragHandle={props.provided.dragHandleProps} />
        {hasProperty(storage, "index_list") ? (
          <Collapsable in={open}>
            <Droppable
              droppableId={props.rubric.draggableId}
              direction="vertical"
              type={storage.type}
            >
              {(provided,snapshot) => (
                <Children
                  container
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {getProperty(storage, props.show, "index_list")?.value.map(
                    (child: string, cindex: number) => {
                      if (props.show.tracking_list.includes(child)) {
                        const id = `${props.show.id}_${child}`;
                        return (
                          <Draggable key={id} draggableId={id} index={cindex}>
                            {renderItem}
                          </Draggable>
                        );
                      }
                      return null;
                    }
                  )}
                </Children>
              )}
            </Droppable>
          </Collapsable>
        ) : null}
      </Container>
    );
  }
  return null;
};

export default RunsheetItem;