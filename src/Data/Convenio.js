import { useCallback } from "react";
import { useStore } from "./store";

const useConvenio = () => {
  const [store, setStore] = useStore();

  const setConvenio = useCallback(
    (convenio) => setStore((prev) => ({ ...prev, convenio })),
    []
  );

  return [store && store.convenio, setConvenio];
};

export default useConvenio;
