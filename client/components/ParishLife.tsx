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
// Parish Life Item
//

export interface PLItem {
  title: string;
  image: string;
  text: string;
}

function ParishLifeItem(props: PLItem) {
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: theme.palette.primary.main,
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
            <CardContent
              sx={{
                flex: "1 0 auto",
              }}
            >
              <Typography component="div" variant="h5" color={"secondary"}>
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
          {!isMobile && (
            <CardMedia
              component="img"
              sx={{
                width: isHuge ? 400 : 250,
              }}
              src={imageUrl(props.image)}
              alt={props.image}
            />
          )}
        </Card>
      </Grid>
      <Grid item sm={0} md={1} lg={2} />
    </Grid>
  );
}

//
// Parish Life Section
//

interface ParishLifeSectionProps {
  parishLifeItems: Array<PLItem>;
}

export default function ParishLifeSection(props: ParishLifeSectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isHuge = useMediaQuery(theme.breakpoints.up("xl"));
  return (
    <section id="parish-life">
      <Box
        style={{
          backgroundColor: theme.palette.secondary.main,
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
            Parish Life
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
              //backgroundColor: "transparent",
              backgroundColor: theme.palette.primary.main,
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
          {props.parishLifeItems.map((item, idx) => {
            return (
              <ParishLifeItem
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
