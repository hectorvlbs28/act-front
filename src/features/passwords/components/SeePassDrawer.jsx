import { useIntl } from 'react-intl';
import { Drawer, Divider, Box, Typography, Stack } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectPasswordSelected,
  clearPasswordSelected,
  openDeletePassword,
  openEditPassword,
} from '../store/passwords.slice';
import { PasswordModalTypes } from '../../../shared/constants/enums';
import CloseButton from '../../../shared/components/ui/Buttons/CloseButton';
import ColorButton from '../../../shared/components/ui/Buttons/ColorButton';
import PasswordField from './PasswordField';
import DrawerField from '../../../shared/components/ui/Fields/DrawerField';
import ReadOnlyText from '../../../shared/components/ui/Fields/ReadOnlyText';

const SeePassDrawer = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const PASSWORD_SELECTED = useSelector(selectPasswordSelected);
  const isOpen = PASSWORD_SELECTED.open && PASSWORD_SELECTED.type === PasswordModalTypes.SEE ? true : false;

  const handleClose = () => {
    dispatch(clearPasswordSelected());
  };

  const handleOpenDelete = () => {
    dispatch(openDeletePassword());
  };

  const handleOpenEdit = () => {
    dispatch(openEditPassword());
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      slotProps={{ paper: { sx: { width: 380, backgroundColor: 'background.paper', backgroundImage: 'none' } } }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        role="presentation"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            p: 2,
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="overline" color="primary" sx={{ lineHeight: 1 }}>
              {intl.formatMessage({ id: 'ViewPassDetail' })}
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {PASSWORD_SELECTED.name}
            </Typography>
          </Stack>

          <CloseButton handleClose={handleClose} />
        </Box>

        <Divider />

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Stack spacing={0.75} width="100%">
            <DrawerField label={intl.formatMessage({ id: 'ViewPass' })}>
              <PasswordField value={PASSWORD_SELECTED.pswdDecrypted} />
            </DrawerField>
          </Stack>

          <Stack spacing={0.75} width="100%">
            <DrawerField label={intl.formatMessage({ id: 'ViewPassDesc' })}>
              <ReadOnlyText value={PASSWORD_SELECTED.description} />
            </DrawerField>
          </Stack>
        </Box>

        <Divider />

        <Box
          sx={{
            p: 2,
            display: 'flex',
            gap: 1,
          }}
        >
          <ColorButton
            color="info"
            text={intl.formatMessage({ id: 'Edit' })}
            handleClick={() => {
              handleOpenEdit();
            }}
          />
          <ColorButton
            text={intl.formatMessage({ id: 'Delete' })}
            handleClick={() => {
              handleOpenDelete();
            }}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default SeePassDrawer;
