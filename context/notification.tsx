import Modal from "@/components/Modal";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
type Notify = {
  heading: string;
  message: string;
  type: "error" | "success" | string;
};
interface NotifyProp {
  notify: Notify;
  setNotify: Dispatch<SetStateAction<Notify>>;
}

export const NotifyContext = createContext<NotifyProp>({
  notify: { heading: "", message: "", type: "" },
  setNotify: () => {},
});

export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notify, setNotify] = useState({} as Notify);
  return (
    <NotifyContext.Provider value={{ notify, setNotify }}>
      <Modal />
      {children}
    </NotifyContext.Provider>
  );
}
