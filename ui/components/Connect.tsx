import { useState } from "react";
import {
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  Modal,
  TextField,
  Alert,
  Button,
  ButtonGroup,
} from "@mui/material";
import { postConnectForm } from "@/api";

//
// Connect Modal
//

interface ConnectModalProps {
  open: boolean;
  handleClose: Function;
}

export default function ConnectModal(props: ConnectModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isHuge = useMediaQuery(theme.breakpoints.up("xl"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  const [detail, setDetail] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const dataInput = {
    name: setName,
    email: setEmail,
    phone: setPhone,
    message: setMessage,
  };

  const handleChange = (e) => {
    dataInput[e.target.name](e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendingRequest(true);
    const res = await postConnectForm({ name, email, phone, message });
    if (res.success) {
      setSuccess(true);
      setErrors({ name: "", email: "", phone: "", message: "" });
    } else {
      setSuccess(false);
      setErrors(res.data);
    }

    setDetail(res.detail);
    setSendingRequest(false);
  };

  const modalClose = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setSendingRequest(false);
    setDetail("");
    setSuccess(false);
    setErrors({ name: "", email: "", phone: "", message: "" });
    props.handleClose();
  };

  return (
    <>
      <Modal
        open={props.open}
        onClose={modalClose}
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
            variant="h6"
            component="h2"
            // @ts-ignore
            style={{ textAlign: isMobile ? "center" : "" }}
          >
            Connect
          </Typography>

          <div id="modal-modal-description" style={{ margin: "2.5%" }}>
            {errors.name && errors.name.length > 0 && (
              <Alert severity="error">{errors.name}</Alert>
            )}
            <TextField
              id="name-field"
              name="name"
              label="Name"
              value={name}
              fullWidth
              color="secondary"
              onChange={handleChange}
            />
            <br />
            <br />
            {errors.email && errors.email.length > 0 && (
              <Alert severity="error">{errors.email}</Alert>
            )}
            <TextField
              id="email-field"
              name="email"
              label="Email"
              value={email}
              fullWidth
              color="secondary"
              onChange={handleChange}
            />
            <br />
            <br />
            {errors.phone && errors.phone.length > 0 && (
              <Alert severity="error">{errors.phone}</Alert>
            )}
            <TextField
              id="phone-field"
              name="phone"
              label="Phone #"
              value={phone}
              fullWidth
              color="secondary"
              onChange={handleChange}
            />
            <br />
            <br />
            {errors.message && errors.message.length > 0 && (
              <Alert severity="error">{errors.message}</Alert>
            )}
            <TextField
              id="message-field"
              name="message"
              label="Message"
              value={message}
              fullWidth
              multiline
              color="secondary"
              onChange={handleChange}
            />
            <br />
            <br />
            {success && <Alert severity="success">{detail}</Alert>}
            <ButtonGroup
              style={{
                display: "flex",
                justifyContent: isMobile ? "center" : "",
              }}
            >
              <Button
                size="medium"
                color="primary"
                variant="outlined"
                disabled={sendingRequest || success}
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button
                size="medium"
                color="secondary"
                variant="outlined"
                onClick={modalClose}
              >
                Close
              </Button>
            </ButtonGroup>
          </div>
        </Box>
      </Modal>
    </>
  );
}
