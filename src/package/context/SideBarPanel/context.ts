import { createContext, useContext } from "react";

interface InitialState {
  open: boolean;
  openSideBar: () => void;
  closeSideBar: () => void;
}

const INITIAL_STATE = {
  open: false,
  openSideBar: () => {},
  closeSideBar: () => {},
};

export const SideBarContext = createContext<InitialState>(INITIAL_STATE);

export function useSideBar() {
  return useContext(SideBarContext);
}
