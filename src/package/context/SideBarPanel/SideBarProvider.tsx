import { useState } from "react";
import { SideBarContext } from "./context";

export const SideBarProvider: React.FC = ({ children }) => {
  const [open, setOpen] = useState(false);

  const openSideBar = () => {
    setOpen(true);
  };

  const closeSideBar = () => {
    setOpen(false);
  };

  return (
    <SideBarContext.Provider
      value={{
        open,
        openSideBar,
        closeSideBar,
      }}
    >
      {children}
    </SideBarContext.Provider>
  );
};
