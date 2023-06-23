import { useState, ChangeEvent } from "react";
import {
  useTheme,
  useMediaQuery,
  ButtonGroup,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  TextField,
  Modal,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

interface Column {
  id: "name" | "when" | "actions";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

let desktopColumns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 200 },
  { id: "when", label: "When", minWidth: 150 },
  { id: "actions", label: "Actions", minWidth: 100 },
];

let mobileColumns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 120 },
  { id: "actions", label: "Actions", minWidth: 100 },
];

interface Inquiry {
  id: string;
  when: string;
  data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  followed_up: boolean;
}

interface Data {
  id: string;
  when: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  followedUp: boolean;
}

function createData(inquiry: Inquiry): Data {
  return {
    id: inquiry.id,
    when: inquiry.when,
    name: inquiry.data.name,
    email: inquiry.data.email,
    phone: inquiry.data.phone,
    message: inquiry.data.message,
    followedUp: inquiry.followed_up,
  };
}

export default function InquiryTable(props: {
  inquiries: Array<Inquiry>;
  handleFollowUp: Function;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [when, setWhen] = useState("");
  const [id, setId] = useState("");
  const [followedUp, setFollowedUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [row, setRow] = useState("");
  const rows: Array<Data> = [];

  const columns = isMobile ? mobileColumns : desktopColumns;

  props.inquiries.forEach((inquiry) => {
    if (!inquiry.followed_up) {
      rows.push(createData(inquiry));
    }
  });

  const handleViewInquiry = (row: Data) => {
    setId(row.id);
    setWhen(row.when);
    setName(row.name);
    setEmail(row.email);
    setPhone(row.phone);
    setMessage(row.message);
    setFollowedUp(row.followedUp);
    setOpen(true);
  };

  const handleCloseInquiry = () => {
    setId("");
    setWhen("");
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setFollowedUp(false);
    setOpen(false);
  };
  const handleCloseDialog = (done: boolean) => {
    if (done) {
      props.handleFollowUp(row);
    }
    setDialogOpen(false);
    setRow("");
  };

  const handleDone = (selectedRow: Data) => {
    setRow(selectedRow.id);
    setDialogOpen(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={() => handleCloseDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Followed up?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This will remove the it from the table.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            size="medium"
            color="secondary"
            variant="outlined"
            onClick={() => handleCloseDialog(false)}
            autoFocus
          >
            No
          </Button>
          <Button
            size="medium"
            color="primary"
            variant="contained"
            onClick={() => handleCloseDialog(true)}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        id="tableTitle"
        style={{ marginBottom: isMobile ? "5%" : "2.5%" }}
      >
        Inquiries
      </Typography>
      {rows.length > 0 ? (
        <>
          <TableContainer sx={{ maxHeight: "50vh" }}>
            <Table stickyHeader aria-label="inquries table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, key) => {
                    if (!row.followedUp) {
                      return (
                        <TableRow hover tabIndex={-1} key={key}>
                          {columns.map((column) => {
                            let value = undefined;
                            if (column.id === "actions") {
                              value = (
                                <ButtonGroup
                                  style={{
                                    display: "flex",
                                    justifyContent: isMobile ? "center" : "",
                                  }}
                                >
                                  <Button
                                    size={
                                      isMobile || isTablet ? "small" : "medium"
                                    }
                                    color="primary"
                                    variant="contained"
                                    onClick={() => handleViewInquiry(row)}
                                  >
                                    View
                                  </Button>
                                  <Button
                                    size={
                                      isMobile || isTablet ? "small" : "medium"
                                    }
                                    color="secondary"
                                    variant="outlined"
                                    onClick={() => handleDone(row)}
                                  >
                                    Done
                                  </Button>
                                </ButtonGroup>
                              );
                            } else {
                              value = row[column.id];
                            }
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    }
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Modal
            open={open}
            onClose={handleCloseInquiry}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: isMobile ? "80%" : "60%",
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography
                id="modal-modal-title"
                variant="h5"
                component="h3"
                style={{
                  padding: "2.5%",
                  textAlign: isMobile ? "center" : "left",
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.secondary.main
                      : theme.palette.primary.main,
                }}
              >
                Inquiry ({when})
              </Typography>
              <div id="modal-modal-description" style={{ margin: "2.5%" }}>
                <TextField
                  id="name-field"
                  name="name"
                  label="Name"
                  value={name}
                  fullWidth
                  color="secondary"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <br />
                <br />
                <TextField
                  id="email-field"
                  name="email"
                  label="Email"
                  value={email.length == 0 ? "no email provided" : email}
                  fullWidth
                  style={{
                    fontStyle:
                      email.length == 0 ? "italic" : "no email provided",
                  }}
                  color="secondary"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <br />
                <br />
                <TextField
                  id="phone-field"
                  name="phone"
                  label="Phone #"
                  value={phone.length == 0 ? "no phone provided" : phone}
                  fullWidth
                  style={{
                    fontStyle: phone.length == 0 ? "italic" : "",
                  }}
                  color="secondary"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <br />
                <br />
                <TextField
                  id="message-field"
                  name="message"
                  label="Message"
                  value={message.length == 0 ? "no message provided" : message}
                  fullWidth
                  multiline
                  style={{
                    fontStyle: message.length == 0 ? "italic" : "",
                  }}
                  color="secondary"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <br />
                <br />
                <Button
                  size="medium"
                  color="secondary"
                  variant="outlined"
                  onClick={handleCloseInquiry}
                >
                  Close
                </Button>
              </div>
            </Box>
          </Modal>
        </>
      ) : (
        <span style={{ fontStyle: "italic" }}>no new inquiries</span>
      )}
    </>
  );
}
