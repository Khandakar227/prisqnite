import { useEffect, useState, useContext } from "react";
import {NotifyContext} from '@/context/notification';
import { BiX } from "react-icons/bi";

function Modal() {
  const {notify:{heading, message, type}, setNotify} = useContext(NotifyContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (heading && message && type) setOpen(true);
    else setOpen(false);
  }, [heading, message, type]);

  function close () {
    setNotify({
      heading:"",
      message: "",
      type: ""
    })
  }
  if (open)
    return (
      <div className="absolute top-8 left-0 flex justify-center items-center w-full">
        <div
          className={`p-4 rounded-md shadow border-b md:min-w-[400px] ${
            type == "error"
              ? "bg-red-300 text-red-700"
              : "bg-green-300 text-green-700"
          } ${
            (heading && message && type)
              ? "z-10 opacity-100 translate-y-0"
              : "-z-10 opacity-0 -translate-y-10"
          } transition-all`}
        >
          <div className="text-end w-full">
            <button onClick={close} className="p-1">
              <BiX />
            </button>
          </div>
          <h1 className="font-bold text-2xl mt-1 mb-4"> {heading} </h1>
          <p>{message}</p>
        </div>
      </div>
    );
  return <></>;
}

export default Modal;
