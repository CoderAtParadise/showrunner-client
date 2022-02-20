import { SMPTE } from "@coderatparadise/showrunner-common";
import styled from "@emotion/styled";
import { IWidget } from "./IWidget";
import { BugReport } from "@mui/icons-material";

const Styled = styled.div`
    font-size: 45px;
`;

const TestWidget: IWidget<any, any> = {
    renderMode: {
        compact: {
            render: () => {
                return (
                    <>
                        <Styled>{new SMPTE().toString()}</Styled>
                        <Styled>{new SMPTE().toString()}</Styled>
                        <Styled>{new SMPTE().toString()}</Styled>
                        <Styled>{new SMPTE().toString()}</Styled>
                        <Styled>{new SMPTE().toString()}</Styled>
                        <Styled>{new SMPTE().toString()}</Styled>
                        <Styled>{new SMPTE().toString()}</Styled>
                        <Styled>{new SMPTE().toString()}</Styled>
                        <Styled>{new SMPTE().toString()}</Styled>
                        <Styled>{new SMPTE().toString()}</Styled>
                    </>
                );
            }
        },
        expanded: {
            render: () => {
                return <Styled>Expanded</Styled>;
            }
        },
        default: {
            render: () => {
                return <Styled>Default</Styled>;
            }
        }
    },
    config: [
        {
            menu: "test",
            icon: (
                <BugReport
                    style={{
                        width: "0.8em",
                        height: "0.8em"
                    }}
                />
            ),
            tooltip: "Testing",
            render: () => {
                return <div>Test Menu</div>;
            }
        }
    ]
};

export default TestWidget;
