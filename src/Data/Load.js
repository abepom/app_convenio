import { useCallback } from "react";
import { useStore } from "./store";

const useLoad = () => {
  const [store, setStore] = useStore();

  const setLoad = useCallback(
    (load) => setStore((prev) => ({ ...prev, load })),
    []
  );

  return [store && store.load, setLoad];
};

export default useLoad;
