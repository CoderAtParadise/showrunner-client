import { ReactNode } from "react";
import { IConfigValue } from "./IConfigValue";

export interface IConfigValueRender<T> extends IConfigValue<T> {
  render: () => ReactNode;
}
