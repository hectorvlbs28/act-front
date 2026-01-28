import React from "react";
import { Modal, Box } from "@mui/material";

const defaultStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};

const ReusableModal = ({ open, onClose, children, style }) => {
  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      return;
    }
    onClose(event);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...defaultStyle, ...style }}>{children}</Box>
    </Modal>
  );
};

export default ReusableModal;
