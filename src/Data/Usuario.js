import { useCallback } from "react";
import { useStore } from "./store";

const useUsuario = (usuario) => {
  const [store, setStore] = useStore();

  const setUsuario = useCallback(
    (usuario) => setStore((prev) => ({ ...prev, usuario })),
    []
  );

  return [store && store.usuario, setUsuario];
};

export default useUsuario;
