import { experimentalStyled as styled } from "@material-ui/core/styles";
import RunsheetHandler from "../common/RunsheetHandler";
import { useState, Fragment } from "react";
import IconButton from "@material-ui/core/IconButton";
import { Add } from "@material-ui/icons";
import { Menu, MenuItem } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
import { Type } from "../common/Storage";


const Dropdown = <T extends string>(props: {
  handler: RunsheetHandler;
  show: string;
  caller: string;
  title: string;
  values: T[];
  blacklist: T[];
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <Tooltip title={`${props.title}...`}>
        <IconButton onClick={handleClick}>
          <Add />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.values.map((value: string) => {
            if(props.blacklist.indexOf(value as T) === -1)
          return <MenuItem key={value}>{props.title} {value}</MenuItem>;
          return null;
        })}
      </Menu>
    </Fragment>
  );
};

export default Dropdown;
