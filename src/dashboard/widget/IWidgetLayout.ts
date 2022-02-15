export enum RenderMode {
    COMPACT = "compact",
    EXPANDED = "expanded"
}

export interface IWidgetLayout {
    id: string;
    displayName: string;
    widget: string;
    renderMode: RenderMode;
    position: {
        x: number;
        y: number;
        z: number;
    };
    config: object;
}
