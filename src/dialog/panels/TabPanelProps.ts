import {Dispatch, SetStateAction} from "react";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
    cb: Dispatch<SetStateAction<boolean>>;
};

export default TabPanelProps;