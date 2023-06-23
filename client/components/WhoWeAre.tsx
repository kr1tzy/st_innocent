import {
  useTheme,
  useMediaQuery,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { imageUrl } from "@/utils";

//
// Who We Are Item
//

export interface WWAItem {
  title: string;
  image: string;
  text: string;
}

function WhoWeAreItem(props: WWAItem) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isHuge = useMediaQuery(theme.breakpoints.up("xl"));
  return (
    <Grid container>
      <Grid item sm={0} md={1} lg={2} />
      <Grid
        item
        sm={12}
        md={10}
        lg={8}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Card sx={{ display: "flex" }}>
          {!isMobile && (
            <CardMedia
              component="img"
              sx={{ width: isHuge ? 400 : 250 }}
              src={imageUrl(props.image)}
              alt={props.image}
            />
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: theme.palette.secondary.main,
              height: isMobile ? "400px" : "300px",
            }}
          >
            {isMobile && (
              <CardMedia
                component="img"
                src={imageUrl(props.image)}
                alt={props.image}
                sx={{
                  objectFit: "fill",
                  height: "300px",
                }}
              />
            )}
            <CardContent sx={{ flex: "1 0 auto", padding: "2.5%" }}>
              <Typography component="div" variant="h5" color={"primary"}>
                {props.title}
              </Typography>
              <Typography
                variant="body1"
                component="div"
                color="#fff"
                style={{
                  fontSize: "1.2rem",
                  height: isMobile ? "110px" : "230px",
                  overflowY: "scroll",
                }}
              >
                {props.text}
              </Typography>
            </CardContent>
          </Box>
        </Card>
      </Grid>
      <Grid item sm={0} md={1} lg={2} />
    </Grid>
  );
}

//
// Who We Are Section
//

interface WhoWeAreSectionProps {
  whoWeAreItems: Array<WWAItem>;
}

export default function WhoWeAreSection(props: WhoWeAreSectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isHuge = useMediaQuery(theme.breakpoints.up("xl"));
  return (
    <section id="who-we-are">
      <Box
        style={{
          backgroundColor: theme.palette.primary.main,
          marginTop: "0",
          padding: "5%",
        }}
      >
        <Box
          sx={{
            padding: "2.5%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h2" component="h3" color="#fff">
            Who We Are
          </Typography>
        </Box>
        <Carousel
          height={isMobile ? "400px" : "300px"}
          interval={6000}
          animation="slide"
          swipe={true}
          duration={500}
          navButtonsAlwaysVisible={!isMobile}
          navButtonsProps={{
            style: {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
          navButtonsWrapperProps={{
            style: {
              position: "absolute",
              height: "100px",
              backgroundColor: "transparent",
              top: "calc(50% - 70px)",
              // @ts-ignore
              "&:hover": {
                "& $button": {
                  backgroundColor: "black",
                  filter: "brightness(120%)",
                  opacity: "0.4",
                },
              },
            },
          }}
        >
          {props.whoWeAreItems.map((item, idx) => {
            return (
              <WhoWeAreItem
                key={idx}
                title={item.title}
                image={item.image}
                text={item.text}
              />
            );
          })}
        </Carousel>
      </Box>
    </section>
  );
}
