import { useState, useEffect, useCallback } from "react";
import {
  useTheme,
  useMediaQuery,
  Modal,
  Button,
  ButtonGroup,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import {
  Calendar as BigCalendar,
  Toolbar,
  ToolbarProps,
  dayjsLocalizer,
  Navigate,
  Views,
} from "react-big-calendar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { Parallax } from "react-parallax";
import { imageUrl } from "@/utils";
import dayjs from "dayjs";

//
// Calendar Toolbar Button
//

interface CalendarToolbarButtonProps {
  text: string;
  click: Function;
}

function CalendarToolbarButton(props: CalendarToolbarButtonProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Button
      style={{
        textAlign: "center",
        backgroundColor: isHover ? theme.palette.secondary.main : "transparent",
        cursor: "pointer",
        color: "#fff",
      }}
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
      onClick={() => props.click()}
    >
      <Typography
        variant="h6"
        component="p"
        sx={{
          fontSize: ".75em",
          textAlign: "center",
          color: "#fff",
        }}
      >
        {props.text}
      </Typography>
    </Button>
  );
}

//
// Calendar Toolbar
//

function CalendarToolbar(props: ToolbarProps) {
  const theme = useTheme();
  const isTabletOrSmaller = useMediaQuery(theme.breakpoints.down("md"));
  const [viewState, setViewState] = useState("");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const goToDayView = () => {
    props.onView("day");
    setViewState("day");
  };
  const goToWeekView = () => {
    props.onView("week");
    setViewState("week");
  };
  const goToMonthView = () => {
    props.onView("month");
    setViewState("month");
  };
  const goToAgendaView = () => {
    props.onView("agenda");
    setViewState("agenda");
  };

  const goToBack = () => {
    props.onNavigate(Navigate.PREVIOUS);
  };

  const goToNext = () => {
    props.onNavigate(Navigate.NEXT);
  };

  const goToToday = () => {
    props.onNavigate(Navigate.TODAY);
  };

  const goToSpecificDate = (newDate: Date) => {
    props.onNavigate(Navigate.DATE, newDate);
  };

  useEffect(() => {
    if (isTabletOrSmaller) {
      goToAgendaView();
    } else {
      goToMonthView();
    }
  }, [isTabletOrSmaller]);

  return (
    <div className="rbc-toolbar">
      <span style={{ margin: "1.5%" }} className="rbc-btn-group">
        <CalendarToolbarButton text={"<"} click={goToBack} />
        <CalendarToolbarButton text={"today"} click={goToToday} />
        <CalendarToolbarButton text={">"} click={goToNext} />
      </span>

      <Typography
        variant="h5"
        component="p"
        className="rbc-toolbar-label"
        style={{
          margin: "5px",
          textAlign: "center",
          color: theme.palette.secondary.main,
        }}
      >
        {props.label}
      </Typography>

      <span style={{ margin: "1.5%" }} className="rbc-btn-group">
        <CalendarToolbarButton text={"month"} click={goToMonthView} />
        <CalendarToolbarButton text={"week"} click={goToWeekView} />
        <CalendarToolbarButton text={"day"} click={goToDayView} />
        <CalendarToolbarButton text={"agenda"} click={goToAgendaView} />
      </span>
    </div>
  );
}

//
// Calendar
//

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

interface CalendarProps {
  events: Array<CalendarEvent>;
}

function Calendar(props: CalendarProps) {
  const theme = useTheme();
  const localizer = dayjsLocalizer(dayjs);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    allDay: false,
  });

  const handleSelectEvent = useCallback((e) => {
    setSelectedEvent({
      title: e.title,
      start: e.start,
      end: e.end,
      allDay: e.allDay,
    });
    setModalOpen(true);
  }, []);

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEvent({
      title: "",
      start: new Date(),
      end: new Date(),
      allDay: false,
    });
  };

  const prettyTime = (date: Date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let minutesString = "";
    let ampm = hours >= 12 ? "pm" : "am";
    if (hours > 12) {
      hours = hours - 12;
    }
    if (minutes < 10) {
      minutesString = `${minutes}0`;
    } else {
      minutesString = minutes.toString();
    }
    return `${hours}:${minutesString}${ampm}`;
  };

  let events = Array();
  props.events &&
    props.events.forEach((event) => {
      events.push({
        title: event.title,
        // @ts-ignore
        start: new Date(Date.parse(event.start)),
        // @ts-ignore
        end: new Date(Date.parse(event.end)),
        allDay: event.allDay,
      });
    });

  return (
    <>
      <BigCalendar
        events={events}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        components={{ toolbar: CalendarToolbar }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={(event, start, end, isSelected) => {
          return {
            style: {
              backgroundColor: theme.palette.secondary.main,
              cursor: "pointer",
            },
          };
        }}
        dayPropGetter={(date) => {
          const today = new Date();
          if (
            date.getDate() == today.getDate() &&
            date.getMonth() == today.getMonth()
          ) {
            return {
              style: {
                // @ts-ignore
                backgroundColor: theme.palette.primary.hover,
              },
            };
          }
        }}
        style={{
          height: isMobile ? 500 : isTablet ? 600 : 800,
          width: "100%",
          fontSize: isMobile ? "1em" : "1em",
          backgroundColor: theme.palette.primary.main,
          padding: "1.5%",
          color: "#fff",
        }}
      />
      <Modal
        open={open}
        onClose={handleModalClose}
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
            {selectedEvent.title}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, fontSize: "1.2rem" }}
          >
            {selectedEvent.allDay
              ? "All day"
              : `${prettyTime(selectedEvent.start)} - ${prettyTime(
                  selectedEvent.end
                )}`}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

//
// Calendar Section
//

interface CalendarSectionProps {
  calendarAddLink: string;
  backgroundImage: string;
  events: Array<CalendarEvent>;
}

export default function CalendarSection(props: CalendarSectionProps) {
  const theme = useTheme();

  return (
    <section id="calendar">
      <Parallax
        bgImage={imageUrl(props.backgroundImage)}
        bgImageAlt="Calendar Section Parallax"
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
              <Calendar {...props} />
              <ButtonGroup
                variant="contained"
                aria-label="outlined primary button group"
                style={{ marginTop: "2.5%" }}
              >
                <Button
                  href={props.calendarAddLink}
                  startIcon={<CalendarMonthIcon />}
                  variant="contained"
                  style={{
                    backgroundColor: theme.palette.primary.main,
                  }}
                >
                  Subscribe
                </Button>
                <Button
                  href={"https://www.oca.org/readings"}
                  startIcon={<AutoStoriesIcon />}
                  variant="contained"
                  style={{
                    backgroundColor: theme.palette.secondary.main,
                  }}
                >
                  Scripture
                </Button>
              </ButtonGroup>
            </Box>
          </Grid>
          <Grid item xs={0} sm={2} />
        </Grid>
      </Parallax>
    </section>
  );
}
