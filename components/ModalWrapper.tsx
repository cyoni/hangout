import { XIcon } from "@heroicons/react/outline"
import React, { useEffect } from "react"
import Modal from "react-modal"
interface Props {
  isOpen: boolean
  className?: string
  onRequestClose: Function
  children: React.ReactNode
  height?: string
  width?: string
}

function ModalWrapper({
  isOpen,
  onRequestClose,
  children,
  className,
  height,
  width,
}: Props) {
  useEffect(() => {
    Modal.setAppElement("body")
  }, [])

  return (
    <Modal
      bodyOpenClassName="overflow-hidden"
      onAfterClose={() => console.log("exited")}
      style={{
        overlay: {
          background: "transparent",
          backdropFilter: "blur(3px)",
          zIndex: 10,
        },
      }}
      isOpen={isOpen}
      className={`fixed p-3 outline-none border rounded-md shadow-lg
               ${height ? height : "h-[90%]"}
               ${width ? width : "w-[50%]"}
               top-1/2 left-1/2
               translate-x-[-50%] translate-y-[-50%]
               overflow-auto bg-white ${className ? className : ""}`}
      onRequestClose={onRequestClose}
      contentLabel="My dialog"
    >
      <XIcon
        className="h-6 sticky top-1 cursor-pointer text-gray-400 hover:text-gray-300  "
        onClick={onRequestClose}
      />
      {children}
    </Modal>
  )
}

export default ModalWrapper
