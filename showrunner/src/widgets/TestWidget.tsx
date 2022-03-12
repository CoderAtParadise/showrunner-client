import { SMPTE } from "@coderatparadise/showrunner-common";
import styled from "@emotion/styled";
import { IWidget } from "../components/widget/IWidget";

const Styled = styled.div`
    font-size: 45px;
`;

const TestWidget: IWidget<any> = {
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
    config: []
};

export default TestWidget;
