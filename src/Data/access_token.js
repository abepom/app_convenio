import { useCallback } from "react";
import { useStore } from "./store";

const useAccess_token = () => {
	const [store, setStore] = useStore();

	const setAccess_token = useCallback(
		(access_token) => setStore((prev) => ({ ...prev, access_token })),
		[]
	);

	return [store && store.access_token, setAccess_token];
};

export default useAccess_token;
