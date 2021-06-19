import Storage, { getProperty, hasProperty } from "../common/Storage";
import Show from "../common/Show";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import Tooltip from "@material-ui/core/Tooltip";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { Dispatch, useState, SetStateAction } from "react";
import {
  ExpandLess,
  ExpandMore,
  PlayArrow as PlayIcon,
  DragIndicator,
  ArrowRight,
  Notes,
  ExitToApp,
} from "@material-ui/icons";
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
import TimePoint,{INVALID as INVALID_POINT} from "../common/TimePoint";
import { ParentProperty } from "../common/property/Parent";
import { Switch } from "@material-ui/core";
import { Goto, Update } from "./Commands";
import Status from "./Status";
import DragHandle from "./DragHandle";

const Container = styled(Grid)`
  width: 100%;
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.text.primary};
  border-radius: 25px;
  margin: ${({ theme }) => theme.spacing(1)};
  padding-right: ${({ theme }) => theme.spacing(2)};
`;

const Time = styled(TimeView)`
  width: "15%";
`;
const Display = styled(Grid)`
  width: "35%";
  color: ${({ theme }) => theme.palette.text.secondary};
  text-align: center;
  vertical-align: middle;
  line-height: 48px;
`;

const Children = styled(Grid)`
  flex-grow: 1;
`;

const Medium = styled(Grid)`
  width: "15%";
`;

const Collapsable = styled(Collapse)`
  width: 100%;
`;

function isActive(
  handler: RunsheetHandler,
  show: Show,
  trackingShow: TrackingShow,
  storage: Storage<any>
): boolean {
  if (trackingShow.active !== storage.id) {
    const pid = getProperty(storage, show, "parent") as ParentProperty;

    return false;
  }
  return true;
}

const RunsheetItem =
  (handler: RunsheetHandler, show: Show,offset:TimePoint) =>
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
  let offset:TimePoint = INVALID_POINT;
  const renderItem = RunsheetItem(props.handler, props.show,offset);
  if (storage) {
    return (
      <Container
        container
        {...props.provided.draggableProps}
        ref={props.provided.innerRef}
      >
        <Status
          active={false}
          hasChildren={hasProperty(storage, "index_list")}
          open={open}
          cb={setOpen}
        />
        <Display>{storage ? getProperty(storage,props.show,"display")?.value : ""}</Display>
        <DragHandle dragHandle={props.provided.dragHandleProps} />
        {hasProperty(storage, "index_list") ? (
          <Collapsable in={open}>
            <Droppable
              droppableId={props.rubric.draggableId}
              direction="vertical"
              type={storage.type}
            >
              {(provided) => (
                <Children
                  container
                  {...provided.droppableProps}
                  ref={provided.innerRef}
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
                  {provided.placeholder}
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

/*export const getRenderItem =
  (
    handler: RunsheetHandler,
    show: Show,
    tshow: TrackingShow,
    storage: Storage<any>,
    offset: TimePoint,
    active: boolean,
    open: boolean,
    cb: Dispatch<SetStateAction<boolean>>
  ) =>
  (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
    rubric: DraggableRubric
  ) => {
    return (
      <Container
        container
        {...provided.draggableProps}
        ref={provided.innerRef}
        data-is-dragging={snapshot.isDragging}
      >
        <Status
          active={active}
          hasChildren={hasProperty(storage, "index_list")}
          open={open}
          cb={cb}
        />
        <DragHandle dragHandle={provided.dragHandleProps} />
        {hasProperty(storage, "index_list") ? (
          <Collapsable in={open}>
            <Droppable
              droppableId={storage.id}
              direction="vertical"
              type={storage.type}
            >
              {(provided) => (
                <Children
                  container
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {getProperty(storage, show, "index_list")?.value.map(
                    (child: string, cindex: number) => {
                      if (show.tracking_list.includes(child))
                        return (
                          <RunsheetItem
                            key={child}
                            handler={handler}
                            show={show.id}
                            tracking={child}
                            index={cindex}
                            offset={offset}
                          />
                        );
                      return null;
                    }
                  )}
                  {provided.placeholder}
                </Children>
              )}
            </Droppable>
          </Collapsable>
        ) : null}
      </Container>
    );
  };

/*const RunsheetItem = (props: {
  handler: RunsheetHandler;
  show: string;
  tracking: string;
  index: number;
  offset: TimePoint;
}) => {
  const [open, setOpen] = useState(false);
  const tshow = props.handler.getTrackingShow(props.show);
  const show = props.handler.getShow(props.show);
  const storage = props.handler.getStorage(props.tracking);
  let offset: TimePoint = props.offset;
  if (tshow && show && storage) {
    const active = isActive(props.handler, show, tshow, storage);
    const renderItem = getRenderItem(
      props.handler,
      show,
      tshow,
      storage,
      props.offset,
      active,
      open,
      setOpen
    );
    return (
      <Draggable
        key={props.tracking}
        draggableId={props.tracking}
        index={props.index}
      >
        {renderItem}
      </Draggable>
    );
  } else return null;
};

export default RunsheetItem;

/*
<Time
              handler={props.handler}
              show={props.show}
              id={props.tracking}
              offset={offset}
            />
            <Time
              handler={props.handler}
              show={props.show}
              id={props.tracking}
              offset={offset}
              calEnd={true}
            />
            <Time
              handler={props.handler}
              show={props.show}
              id={props.tracking}
            />
            <Display item>
              {getProperty(storage, show, "display")?.value || ""}
            </Display>
            <Medium item>
              <IconButton>
                <Notes />
              </IconButton>
            </Medium>
            <Medium item>
              {getProperty(storage, show, "timer")?.value.type.toUpperCase() ||
                ""}
            </Medium>
            <Medium item>
              {getProperty(
                storage,
                show,
                "timer"
              )?.value.behaviour.toUpperCase() || ""}
            </Medium>
            <Medium>
              <Tooltip title="Go">
                <IconButton
                  onClick={() => {
                    Goto(props.show, props.tracking);
                  }}
                >
                  <ExitToApp />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  !getProperty(storage, show, "disabled")?.value
                    ? "Disable"
                    : "Enable"
                }
              >
                <Switch
                  onClick={() => {
                    Update(props.show, props.tracking, [
                      {
                        reset: false,
                        override: true,
                        property: {
                          key: "disabled",
                          value: !getProperty(storage, show, "disabled")?.value,
                        },
                      },
                    ]);
                  }}
                  name="disabled"
                  checked={
                    !getProperty(storage, show, "disabled")?.value || false
                  }
                />
              </Tooltip>
            </Medium>
            <Medium></Medium>*/
