import { XIcon } from "@heroicons/react/outline"
import React, { useEffect } from "react"
import Modal from "react-modal"
interface Props {
  isOpen: boolean
  onRequestClose: Function
  children: React.ReactNode
}

function ModalWrapper({ isOpen, onRequestClose, children }: Props) {
  useEffect(() => {
    Modal.setAppElement("body")
  }, [])

  return (
    <Modal
      portalClassName="test"
      onAfterClose={() => console.log("exited")}
      style={{
        overlay: {
          background: "transparent",
          backdropFilter: "blur(3px)",
        },
      }}
      isOpen={isOpen}
      onRequestClose={() => onRequestClose(false)}
      contentLabel="My dialog"
    >
      <XIcon
        className="h-6 sticky top-1 cursor-pointer text-gray-400 hover:text-gray-300  "
        onClick={() => onRequestClose(false)}
      />
      {children}
    </Modal>
  )
}

export default ModalWrapper
