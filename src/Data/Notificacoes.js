import { useCallback } from "react";
import { useStore } from "./store";

const useNotificacao = () => {
  const [store, setStore] = useStore();

  const setNotificacao = useCallback(
    (notificacao) => setStore((prev) => ({ ...prev, notificacao })),
    []
  );

  return [store && store.notificacao, setNotificacao];
};

export default useNotificacao;
