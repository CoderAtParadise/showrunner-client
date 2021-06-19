import { experimentalStyled as styled } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {
  DragDropContext,
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import RunsheetHandler from "../common/RunsheetHandler";
import DragHandle from "./DragHandle";
import Status from "./Status";
import { useState } from "react";
import RunsheetShow from "./RunsheetShow";

const Container = styled(Grid)`
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing(1)};
  padding-top: 220px;
  justify-content: center;
`;

const DropContainer = styled(Grid)`
  width: 90%;
`;

const onDragEnd = (result: any) => {
  const { destination, source, draggableId } = result;

  if (!destination) {
    return;
  }

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  )
    return;
};

const onDragStart = () => {};


const Runsheet = (props: { handler: RunsheetHandler }) => {
  const renderShow = RunsheetShow(props);
  return (
    <Container container>
      {props.handler.hasLoadedRunsheet() ? (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <Droppable
            droppableId="runsheet"
            direction="vertical"
            type="show"
            renderClone={renderShow}
          >
            {(provided, snapshot) => (
              <DropContainer
                container
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {props.handler.showList().map((show: string, index: number) => (
                  <Draggable key={show} draggableId={show} index={index}>
                    {renderShow}
                  </Draggable>
                ))}
                {provided.placeholder}
              </DropContainer>
            )}
          </Droppable>
        </DragDropContext>
      ) : null}
    </Container>
  );
};

export default Runsheet;

/**
 * <JGrid container>
      <HGrid item xs={11}>
        {props.handler.hasLoadedRunsheet() ? (
          <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <Droppable droppableId="runsheet" direction="vertical" type="show">
              {(provided) => (
                <Grid item {...provided.droppableProps} ref={provided.innerRef}>
                  {props.handler
                    .showList()
                    .map((show: string, index: number) => {
                      return (
                        <RunsheetShow
                          key={show}
                          handler={props.handler}
                          show={show}
                          index={index}
                        />
                      );
                    })}
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>
          </DragDropContext>
        ) : null}
      </HGrid>
    </JGrid>
 */
