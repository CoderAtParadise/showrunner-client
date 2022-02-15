import { Box } from "@mui/material";
import { IWidget } from "./IWidget";

const TestWidget: IWidget = {
    renderMode: {
        compact: () => {
            return <Box>Hello</Box>;
        },
        expanded: () => {
            return <></>;
        }
    },
    config: (props: { config: object }) => {
        return <Box>{JSON.stringify(props.config)}</Box>;
    }
};

export default TestWidget;
