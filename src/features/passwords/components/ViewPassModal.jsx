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
} from "../store/passwords.slice";
import { PasswordModalTypes } from "../../../shared/constants/enums";
import { TOAST_MESSAGES } from "../../../shared/constants/toastMessages";
import CustomIconButton from "../../../shared/components/ui/CustomIconButton";
import ReusableModal from "../../../shared/components/ui/ReusableModal";
import useToast from "../../../hooks/useToast";

const ViewPassModal = () => {
  const intl     = useIntl();
  const dispatch = useDispatch();
  const { toastSuccess, toastError } = useToast();

  const PASSWORD_SELECTED = useSelector(selectPasswordSelected);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(PASSWORD_SELECTED.pswdDecrypted);
      toastSuccess(TOAST_MESSAGES.auth.copySuccess);
    } catch {
      toastError(TOAST_MESSAGES.auth.copyError);
    }
  };

  const handleDeletePassword = (e) => {
    e.preventDefault();
    dispatch(fetchDeletePasswordById({ id: PASSWORD_SELECTED.id }));
  };

  return (
    <ReusableModal open={PASSWORD_SELECTED.open} onClose={() => dispatch(clearPasswordSelected())}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="h6" component="h2">
          <strong>{intl.formatMessage({ id: "ViewPassModalTitle" })}</strong>{" "}
          {PASSWORD_SELECTED.name}
        </Typography>
        <CustomIconButton
          onClick={() => dispatch(clearPasswordSelected())}
          icon={<CloseIcon fontSize="small" />}
        />
      </Box>

      <TabContext value={PASSWORD_SELECTED.type}>
        <TabPanel value={PasswordModalTypes.SEE} sx={{ p: 0 }}>
          <Box display="flex" alignItems="center" gap="10px" sx={{ mt: 2 }}>
            <Typography>
              <strong>{intl.formatMessage({ id: "ViewPassModalValue" })}</strong>{" "}
              {PASSWORD_SELECTED.pswdDecrypted}
            </Typography>
            <CustomIconButton
              onClick={handleCopyToClipboard}
              icon={<ContentCopyIcon fontSize="small" />}
            />
          </Box>
          <Typography sx={{ mt: 2 }}>
            <strong>{intl.formatMessage({ id: "ViewPassModalDescription" })}</strong>{" "}
            {PASSWORD_SELECTED.description}
          </Typography>
        </TabPanel>

        <TabPanel value={PasswordModalTypes.DELETE} sx={{ p: 0 }}>
          <Typography sx={{ mt: 2 }}>
            <strong>{intl.formatMessage({ id: "deletePasswordMessage" })}</strong>
          </Typography>
          <Stack direction="row-reverse" sx={{ p: 1, gap: 2 }}>
            <Button onClick={handleDeletePassword} variant="contained" color="success">
              {intl.formatMessage({ id: "Save" })}
            </Button>
            <Button onClick={() => dispatch(clearPasswordSelected())} variant="contained" color="error">
              {intl.formatMessage({ id: "Cancel" })}
            </Button>
          </Stack>
        </TabPanel>
      </TabContext>
    </ReusableModal>
  );
};

export default ViewPassModal;
