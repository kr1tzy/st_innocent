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
import { Carousel } from "@/components";

//
// Parish Life Item
//

export interface PLItem {
  title: string;
  image: string;
  text: string;
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
          items={props.parishLifeItems}
          desktopImageSide="right"
          mobileNavBtnColor="rgba(42, 68, 106, .2)"
          backgroundColor={theme.palette.primary.main}
          titleColor="secondary"
        />
      </Box>
    </section>
  );
}
