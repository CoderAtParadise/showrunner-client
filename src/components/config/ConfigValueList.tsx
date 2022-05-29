import { ReactNode, useState } from "react";
import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";
import { ConfigValue } from "./ConfigValue";
import { IConfigurable } from "./IConfigurable";
import { Add, Remove, Edit } from "@mui/icons-material";
import styled from "@emotion/styled";
import { Tooltip, TooltipContent, TooltipHoverable } from "../tooltip";
import { Scrollable } from "../Scrollable";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const ContentScrollable = styled(Scrollable)`
  width: 100%;
  max-height: 10em;
`;

const Table = styled.table`
  background-color: rgb(54, 54, 54);
  border: solid;
  color: white;
  border-collapse: collapse;
  text-align: center;
  margin-left: 5px;
  border-color: rgb(150, 150, 150);
  border-radius: 3px;
  table-layout: fixed;
  user-select: none;
  width: 99%;
`;

const TableHead = styled.th`
  position: sticky;
`;

const TableRow = styled.tr`
  font-size: 0.8em;
  background-color: ${(props: { selected: boolean }) =>
    props.selected ? "rgb(150,150,150)" : ""};
  &:hover {
    background-color: rgb(100, 100, 100);
    cursor: pointer;
  }
`;

const ControlButtons = styled.div`
  float: right;
  position: absolute;
  display: flex;
  right: 0.2em;
  top: -0.3em;
  gap: 0.5em;
`;

const Header = styled.div`
  position: relative;
`;

const AddButton = styled(Add)`
  width: 0.8em;
  height: 0.8em;
`;
const RemoveButton = AddButton.withComponent(Remove);
const EditButton = AddButton.withComponent(Edit);

const ControlButtonTooltip = styled(Tooltip)`
  height: 1.3em;
`;
const ControlButtonTooltipHoverable = styled(TooltipHoverable)`
  border: solid;
  border-width: 0.5px;
  border-color: rgb(150, 150, 150);
  align-items: center;
  text-align: center;
  justify-content: center;
`;

const ControlButtonsTooltipContent = styled(TooltipContent)`
  left: 20%;
`;

const Br = styled.p`
  font-size: 15%;
`;

const TableComponent = (props: {
  builder: ConfigBuilder;
  configurable: IConfigurable;
  values: object[];
  columns: { id: string; label: string }[];
}) => {
  const [selected, setSelected] = useState("");
  return (
    <>
      <Header>
        {props.configurable.displayName}:
        <ControlButtons>
          <ControlButtonTooltip>
            <ControlButtonTooltipHoverable
              onClick={(event) => {
                if (props.configurable.onClick)
                  props.configurable.onClick(props.builder, event, "add", {
                    selected: selected,
                  });
              }}
            >
              <AddButton />
            </ControlButtonTooltipHoverable>
            <ControlButtonsTooltipContent>Add</ControlButtonsTooltipContent>
          </ControlButtonTooltip>
          <ControlButtonTooltip>
            <ControlButtonTooltipHoverable
              onClick={(event) => {
                if (selected !== "") {
                  if (props.configurable.onClick)
                    props.configurable.onClick(props.builder, event, "remove", {
                      selected: selected,
                    });
                }
              }}
            >
              <RemoveButton />
            </ControlButtonTooltipHoverable>
            <ControlButtonsTooltipContent>Remove</ControlButtonsTooltipContent>
          </ControlButtonTooltip>
          <ControlButtonTooltip>
            <ControlButtonTooltipHoverable
              onClick={(event) => {
                if (selected !== "") {
                  if (props.configurable.onClick)
                    props.configurable.onClick(props.builder, event, "edit", {
                      selected: selected,
                    });
                }
              }}
            >
              <EditButton />
            </ControlButtonTooltipHoverable>
            <ControlButtonsTooltipContent>Edit</ControlButtonsTooltipContent>
          </ControlButtonTooltip>
        </ControlButtons>
      </Header>
      <Br />
      <ContentScrollable>
        <Table>
          <thead>
            <tr>
              {props.columns.map(
                (value: {
                  label: string;
                  id: string;
                  selectiveShow?: boolean;
                }) => {
                  return !value.selectiveShow ? <TableHead>{value.label}</TableHead> : null;
                }
              )}
            </tr>
          </thead>
          <tbody>
            {props.values.map((channel: any) => {
              return (
                <TableRow
                  key={channel.id}
                  selected={channel.id === selected}
                  onClick={() => {
                    selected === channel.id
                      ? setSelected("")
                      : setSelected(channel.id);
                  }}
                >
                  {props.columns.map(
                    (value: {
                      id: string;
                      label: string;
                      selectiveShow?: boolean;
                    }) => {
                      return !value.selectiveShow ? (
                        <td>{channel[value.id]}</td>
                      ) : null;
                    }
                  )}
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </ContentScrollable>
    </>
  );
};

export class ConfigValueList implements ConfigValue<object[]> {
  constructor(
    builder: ConfigBuilder,
    configurable: IConfigurable,
    storage: (config: ConfigBuilder) => LooseObject
  ) {
    this.builder = builder;
    this.configurable = configurable;
    this.storage = storage;
  }

  get(): object[] {
    return (
      this.storage(this.builder).get(
        `${this.configurable.group}.${this.configurable.key}`
      ) || this.configurable?.defaultValue
    );
  }

  set(value: object[]): void {
    this.storage(this.builder).set(
      this.builder,
      `${this.configurable.group}.${this.configurable.key}`,
      value
    );
  }

  render(key: string): ReactNode {
    const columns: { label: string; id: string; selectiveShow?: boolean }[] =
      this.configurable.Options?.(this.builder) || [];
    return (
      <Content key={key}>
        <TableComponent
          builder={this.builder}
          configurable={this.configurable}
          values={this.get()}
          columns={columns}
        />
      </Content>
    );
  }

  builder: ConfigBuilder;
  configurable: IConfigurable;
  storage: (config: ConfigBuilder) => LooseObject;
}
