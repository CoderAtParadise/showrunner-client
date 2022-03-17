import { useEffect, useRef } from "react";
import { isEqual } from "lodash-es";

export function useDeepEffect(effectFun: any, deps: any[]) {
    const isFirst = useRef(true);
    const prevDeps = useRef(deps);

    useEffect(() => {
        const isSame = prevDeps.current.every((obj, index) =>
            isEqual(obj, deps[index])
        );
        if (isFirst.current || !isSame) effectFun();

        isFirst.current = false;
        prevDeps.current = deps;
    }, [deps, effectFun]);
}
