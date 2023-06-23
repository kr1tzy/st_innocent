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
// Who We Are Item
//

export interface WWAItem {
  title: string;
  image: string;
  text: string;
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
          items={props.whoWeAreItems}
          desktopImageSide="left"
          mobileNavBtnColor="rgba(233,133,32,.2)"
          backgroundColor={theme.palette.secondary.main}
          titleColor="primary"
        />
      </Box>
    </section>
  );
}
