import { useState } from "react";
import {
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  Modal,
  Grid,
  Button,
} from "@mui/material";
import { Parallax } from "react-parallax";
import { imageUrl } from "@/utils";

//
// FAQ Box
//

export interface FAQ {
  question: string;
  answer: string;
}

function FaqBox(props: FAQ) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isHuge = useMediaQuery(theme.breakpoints.up("xl"));
  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          backgroundColor: isHover
            ? // @ts-ignore
              theme.palette.primary.hover
            : theme.palette.primary.main,
          padding: "2.5%",
          margin: isMobile ? "2.5%" : "1.5%",
          color: "#fff",
          width: isMobile ? "80%" : "60%",
          cursor: "pointer",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleOpen}
      >
        <Typography
          variant="h5"
          component="p"
          sx={{
            textAlign: "center",
            color: "#fff",
          }}
        >
          {props.question}
        </Typography>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
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
          <Typography id="modal-modal-title" variant="h4" component="p">
            {props.question}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{
              mt: 2,
              fontSize: "1.2rem",
              height: isMobile ? 400 : 200,
              overflowY: "scroll",
            }}
          >
            {props.answer}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

//
// FAQ Section
//

interface FaqSectionProps {
  backgroundImage: string;
  faqs: Array<FAQ>;
}

export default function FaqSection(props: FaqSectionProps) {
  const theme = useTheme();
  return (
    <section id="faqs">
      <Parallax
        bgImage={imageUrl(props.backgroundImage)}
        bgImageAlt="FAQ Section Parallax"
        strength={500}
      >
        <Grid
          container
          style={{
            marginTop: "0",
          }}
        >
          <Grid item xs={0} sm={2} />
          <Grid item xs={12} sm={8}>
            <Box
              sx={{
                padding: "5%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {props.faqs.length > 0 &&
                props.faqs.map((faq, idx) => {
                  return (
                    <FaqBox
                      key={idx}
                      question={faq.question}
                      answer={faq.answer}
                    />
                  );
                })}
            </Box>
          </Grid>
          <Grid item xs={0} sm={2} />
        </Grid>
      </Parallax>
    </section>
  );
}
