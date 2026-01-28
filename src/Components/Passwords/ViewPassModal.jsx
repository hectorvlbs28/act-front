import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";

import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";

import {
  selectPasswordSelected,
  clearPasswordSelected,
  fetchDeletePasswordById,
} from "../../Redux/passwords.Slice";
import { PasswordModalTypes } from "../../Utils/Enums";
import CustomIconButton from "../Generals/CustomIconButton";
import ReusableModal from "../Generals/ReusableModal";

const ViewPassModal = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const PASSWORD_SELECTED = useSelector(selectPasswordSelected);

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(PASSWORD_SELECTED.pswdDecrypted)
      .then(() => {
        alert("Contraseña copiada al portapapeles");
      })
      .catch(() => {
        alert("Error al copiar la contraseña");
      });
  };

  const handleDeletePassword = (e) => {
    e.preventDefault();
    dispatch(
      fetchDeletePasswordById({
        id: PASSWORD_SELECTED.id,
      })
    );
  };

  const handleCloseModal = () => {
    dispatch(clearPasswordSelected());
  };

  return (
    <ReusableModal open={PASSWORD_SELECTED.open} onClose={handleCloseModal}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Typography id="modal-ViewPassModal-title" variant="h6" component="h2">
          <strong>{intl.formatMessage({ id: "ViewPassModalTitle" })}</strong>{" "}
          {PASSWORD_SELECTED.name}
        </Typography>

        <CustomIconButton
          onClick={handleCloseModal}
          icon={<CloseIcon fontSize="small" />}
        />
      </Box>

      <TabContext value={PASSWORD_SELECTED.type}>
        <TabPanel value={PasswordModalTypes.SEE} sx={{ p: 0 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            gap="10px"
            sx={{ mt: 2 }}
          >
            <Typography id="modal-ViewPassModal-password">
              <strong>
                {intl.formatMessage({ id: "ViewPassModalValue" })}
              </strong>{" "}
              {PASSWORD_SELECTED.pswdDecrypted}
            </Typography>

            <CustomIconButton
              onClick={handleCopyToClipboard}
              icon={<ContentCopyIcon fontSize="small" />}
            />
          </Box>

          <Typography id="modal-ViewPassModal-description" sx={{ mt: 2 }}>
            <strong>
              {intl.formatMessage({ id: "ViewPassModalDescription" })}
            </strong>{" "}
            {PASSWORD_SELECTED.description}
          </Typography>
        </TabPanel>

        <TabPanel value={PasswordModalTypes.DELETE} sx={{ p: 0 }}>
          <Typography id="modal-ViewPassModal-description" sx={{ mt: 2 }}>
            <strong>
              {intl.formatMessage({ id: "deletePasswordMessage" })}
            </strong>
          </Typography>

          <Stack direction="row-reverse" sx={{ p: 1, gap: 2 }}>
            <Button
              onClick={handleDeletePassword}
              variant="contained"
              color="success"
            >
              {intl.formatMessage({ id: "Save" })}
            </Button>

            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="error"
            >
              {intl.formatMessage({ id: "Cancel" })}
            </Button>
          </Stack>
        </TabPanel>
      </TabContext>
    </ReusableModal>
  );
};

export default ViewPassModal;
