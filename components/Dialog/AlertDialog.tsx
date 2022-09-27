import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

export default function AlertDialog({
  open,
  setOpen,
  dialogTitle,
  dialogText,
  cancelText,
  okText,
  okFunction,
}) {
  const handleOk = () => {
    okFunction()
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      className="z-[11]"
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{cancelText}</Button>
        <Button onClick={handleOk} autoFocus>
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
