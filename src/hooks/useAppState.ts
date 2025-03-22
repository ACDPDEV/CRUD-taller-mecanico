import { useContext } from "react";
import { AppStateContext } from "../context/AppState.tsx";

export function useAppState() {
	const context = useContext(AppStateContext);
	if (!context) {
		throw new Error("useAppState must be used within an AppStateProvider");
	}
	const { appState, setAppState } = context;
	return { appState, setAppState };
}
