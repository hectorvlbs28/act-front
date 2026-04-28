import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { useSelector } from "react-redux";

import { selectApiLoading } from "../../../store/navigation.slice";

const Loading = () => {
  const OPEN = useSelector(selectApiLoading);
  return (
    <Backdrop open={OPEN} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
