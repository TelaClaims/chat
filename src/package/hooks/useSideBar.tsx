import { useSideBar as _useSideBar } from "@/package/context/SideBarPanel/context";

export const useSideBar = () => {
  const { openSideBar } = _useSideBar();

  return {
    openSideBar,
  };
};
