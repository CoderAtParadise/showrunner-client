import {
  createDir,
  readTextFile,
  BaseDirectory,
  writeFile,
} from "@tauri-apps/api/fs";

import { ReactNode, useEffect } from "react";
import { atom, useRecoilState } from "recoil";

export const clientSettingsState = atom({
  key: "clientSettings",
  default: { client: { serverUrl: "" } },
});

export const ClientSettings = (props: {
  className?: string;
  children?: ReactNode;
}) => {
  const [config, setConfig] = useRecoilState(clientSettingsState);

  useEffect(() => {
    readTextFile("showrunner/settings.json", {
      dir: BaseDirectory.LocalData,
    })
      .then((data) => {
        setConfig(JSON.parse(data));
      })
      .catch(() => {
        createDir("showrunner", {
          dir: BaseDirectory.LocalData,
          recursive: true,
        }).then(() =>
          writeFile(
            {
              path: "showrunner/settings.json",
              contents: JSON.stringify(config),
            },
            { dir: BaseDirectory.LocalData }
          )
        );
      });
  }, []);

  useEffect(() => {
    const delayChange = setTimeout(() => {
      writeFile(
        {
          path: "showrunner/settings.json",
          contents: JSON.stringify(config),
        },
        { dir: BaseDirectory.LocalData }
      );
    }, 500);
    return () => clearTimeout(delayChange);
  }, [config]);

  return <>{props.children}</>;
};
