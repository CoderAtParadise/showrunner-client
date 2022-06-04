import { ReactNode, useEffect } from "react";
import {
  atomFamily,
  selectorFamily,
  useRecoilState,
  useSetRecoilState,
} from "recoil";
import { IFetcher } from "./IFetcher";

export const fetched = atomFamily<
  Map<string, any>,
  { show: string; session: string }
>({
  key: "fetched",
  default: new Map<string, any>(),
});

// prettier-ignore
const setFetched = selectorFamily({
    key: "fetched/update",
    get: (key: { show: string; session: string }) => ({ get }) => {
        return get(fetched(key)) as Map<string, any>;
    },
    set: (key:{show:string, session:string}) => ({ set }, newValue:any) => {
        // @ts-ignore: It's just the parser being stupid this compiles fine
        set(fetched(key), (prevState: any) => {
            const state = new Map(prevState);
            const data = newValue as {id:string, data:any};
            state.set(data.id, data.data);
            return state;
        });
    }
});

export function useFetcher(
  show: string,
  session: string,
  fetcher: IFetcher<any>
) {
  const [_fetched, updateFetched] = useRecoilState(
    setFetched({ show: show, session: session })
  );
  if (!fetchers.has(fetcher.id)) {
    fetchers.set(fetcher.id, fetcher);
    fetcher
      .fetch(show, session)
      .then((data: any) => updateFetched({ id: fetcher.id, data: data }));
  }
  return (_fetched as Map<string, any>).get(fetcher.id);
}

const fetchers: Map<string, IFetcher<any>> = new Map<string, IFetcher<any>>();
const GetEventSource = (props: { show: string; session: string }) => {
  const updateFetched = useSetRecoilState(
    setFetched({ show: props.show, session: props.session })
  );

  useEffect(() => {
    setInterval(() => {
      fetchers.forEach((fetcher: IFetcher<any>) => {
        fetcher
          .fetch(props.show, props.session)
          .then((data: any) => updateFetched({ id: fetcher.id, data: data }));
      });
    }, 10000);
  }, []);
};

export const FetchedState = (props: {
  show: string;
  session: string;
  children?: ReactNode;
}) => {
  return (
    <div>
      <>
        {GetEventSource(props)}
        {props.children}
      </>
    </div>
  );
};
