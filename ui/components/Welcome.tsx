import { useTheme, Box, Grid, Typography, Button } from "@mui/material";
import { imageUrl } from "@/utils";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

//
// Upcoming Event Box
//

interface UpcomingEventBoxProps {
  info: string;
  date: string;
}

function UpcomingEventBox(props: UpcomingEventBoxProps) {
  const theme = useTheme();
  return (
    <>
      <Typography
        variant="h5"
        component="p"
        sx={{
          textAlign: "center",
          color: "#fff",
        }}
      >
        <span style={{ whiteSpace: "nowrap" }}>Next {props.info}</span>
      </Typography>
      <Box
        sx={{
          textAlign: "center",
          backgroundColor: theme.palette.secondary.main,
          padding: "2.5%",
          color: "#fff",
        }}
      >
        <Typography
          variant="h6"
          component="p"
          sx={{
            textAlign: "center",
            color: "#fff",
          }}
        >
          {props.date}
        </Typography>
      </Box>
    </>
  );
}

//
// Welcome Section
//

interface WelcomeSectionProps {
  churchSvg: string;
  welcomeText: string;
  produceDist: string;
  communityMeal: string;
}

export default function WelcomeSection(props: WelcomeSectionProps) {
  const theme = useTheme();
  return (
    <section id="welcome">
      <Grid
        container
        style={{
          backgroundColor: theme.palette.primary.main,
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
            <img
              style={{ width: "40%" }}
              src={`${imageUrl(props.churchSvg)}`}
            />
            <Typography
              variant="h1"
              component="h2"
              color={theme.palette.secondary.main}
            >
              Welcome
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{ width: "50%", textAlign: "center", color: "#fff" }}
            >
              {props.welcomeText}
            </Typography>
            <br />
            <br />
            <Box sx={{ width: "60%" }}>
              <Grid container spacing={6}>
                <Grid item sm={12} md={12} lg={6} style={{ width: "100%" }}>
                  <UpcomingEventBox
                    info="Produce Distribution"
                    date={props.produceDist}
                  />
                </Grid>
                <Grid item sm={12} md={12} lg={6} style={{ width: "100%" }}>
                  <UpcomingEventBox
                    info="Community Meal"
                    date={props.communityMeal}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              padding: "2.5%",
            }}
          >
            <div className="player-wrapper">
              <ReactPlayer
                className="react-player"
                url="https://youtu.be/Jh5nuQxiS30"
                controls={true}
                height="100%"
                width="100%"
              />
            </div>
          </Box>
        </Grid>
        <Grid item xs={0} sm={2} />
      </Grid>
    </section>
  );
}
