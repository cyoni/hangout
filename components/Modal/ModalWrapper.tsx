import { XMarkIcon } from "@heroicons/react/24/outline"
import React, { useEffect } from "react"
import Modal from "react-modal"
interface Props {
  isOpen: boolean
  className?: string
  onRequestClose: Function
  children: React.ReactNode
  height?: string
  width?: string
  hideCloseButton?: boolean
  preventForceCloseWindow?: boolean
}

function ModalWrapper({
  isOpen,
  onRequestClose,
  children,
  className,
  hideCloseButton,
  preventForceCloseWindow,
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
          background: "rgba(0,0,0,.5)",
          backdropFilter: "blur(12px)",
          zIndex: 10,
        },
      }}
      isOpen={isOpen}
      className={`fixed rounded-md border p-3 shadow-xl outline-none
               ${height ? height : "h-[90%]"}
               ${width ? width : "w-[50%]"}
               top-1/2 left-1/2
               translate-x-[-50%] translate-y-[-50%]
               overflow-auto bg-white ${className ? className : ""}`}
      onRequestClose={!preventForceCloseWindow ? onRequestClose : null}
      contentLabel="My dialog"
    >
      {!hideCloseButton && (
        <XMarkIcon
          className="sticky top-1 h-5 cursor-pointer text-gray-400 hover:text-gray-300  "
          onClick={() => onRequestClose()}
        />
      )}

      {children}
    </Modal>
  )
}

export default ModalWrapper
