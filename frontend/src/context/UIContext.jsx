import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export function UIProvider({ children }) {
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);

  const openApplicationModal = () => setApplicationModalOpen(true);
  const closeApplicationModal = () => setApplicationModalOpen(false);

  return (
    <UIContext.Provider
      value={{
        applicationModalOpen,
        openApplicationModal,
        closeApplicationModal,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}