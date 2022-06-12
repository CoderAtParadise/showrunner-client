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
    const saved = localStorage.getItem("client-settings");
    if(saved !== null)
      setConfig(JSON.parse(saved || ""));
  }, []);

  useEffect(() => {
    const delayChange = setTimeout(() => {
      localStorage.setItem("client-settings", JSON.stringify(config));
    }, 500);
    return () => clearTimeout(delayChange);
  }, [config]);

  return <>{props.children}</>;
};
