import React from 'react';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TableHead,
  Paper,
  IconButton,
  Typography,
} from '@mui/material';
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from '@mui/icons-material';
import { useIntl } from 'react-intl';

import BlueButton from '../../../shared/components/ui/BlueButton';
import CustomIconButton from '../../../shared/components/ui/CustomIconButton';
import { PasswordModalTypes } from '../../../shared/constants/enums';

const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
  const theme = useTheme();

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0}>
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page + 1)} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
};

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const PasswordsTable = ({ rows, handleSelectPass }) => {
  const intl = useIntl();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  const columns = [
    { label: intl.formatMessage({ id: 'TableHeadName' }) },
    { label: intl.formatMessage({ id: 'TableHeadDescription' }) },
    { label: intl.formatMessage({ id: 'TableHeadPassword' }) },
    { label: intl.formatMessage({ id: 'TableHeadPassActions' }) },
  ];

  const emptyRows = React.useMemo(
    () => (page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0),
    [page, rowsPerPage, rows.length]
  );

  const visibleRows = React.useMemo(
    () => (rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows),
    [rows, page, rowsPerPage]
  );

  return (
    <TableContainer component={Paper}>
      <Table aria-label="passwords table">
        <TableHead>
          <TableRow>
            {columns.map((col, idx) => (
              <TableCell key={idx} align="left">
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {visibleRows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell component="th" scope="row">
                <Typography>{row.pswd_name}</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography>{row.pswd_description}</Typography>
              </TableCell>
              <TableCell align="left">
                <BlueButton
                  text="Ver contraseña"
                  handleClick={(e) => {
                    e.preventDefault();
                    handleSelectPass(row, PasswordModalTypes.SEE);
                  }}
                />
              </TableCell>
              <TableCell align="left">
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CustomIconButton
                    onClick={() => handleSelectPass(row, PasswordModalTypes.EDIT)}
                    icon={<EditIcon fontSize="small" />}
                  />
                  <CustomIconButton
                    onClick={() => handleSelectPass(row, PasswordModalTypes.DELETE)}
                    icon={<DeleteIcon fontSize="small" />}
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[30, 50, 100, { label: 'Todos', value: -1 }]}
              colSpan={0}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{ select: { inputProps: { 'aria-label': 'rows per page' }, native: true } }}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default PasswordsTable;
