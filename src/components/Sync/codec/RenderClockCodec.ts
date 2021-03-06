import {
    BaseClockSettings,
    ClockIdentifier,
    Codec,
    serializeTypes
} from "@coderatparadise/showrunner-common";
import {
    AdditionalData,
    CurrentClockState,
    RenderClockSource
} from "../../../util/RenderClockSource";

export const RenderClockCodec: Codec<RenderClockSource> = {
    serialize(): object {
        return {};
    },

    deserialize(json: serializeTypes): RenderClockSource {
        const data = json as {
            type: string;
            identifier: ClockIdentifier;
            currentState: CurrentClockState;
            settings: BaseClockSettings & any;
            additional: AdditionalData;
        };
        return new RenderClockSource(
            data.type,
            data.identifier,
            data.currentState,
            data.settings,
            data.additional
        );
    }
};
