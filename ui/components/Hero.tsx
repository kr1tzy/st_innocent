import {
  useTheme,
  useMediaQuery,
  Container,
  Box,
  Typography,
  Theme,
  styled,
  keyframes,
} from "@mui/material";
import { SxProps } from "@mui/system";
import { imageUrl } from "@/utils";

const HeroLayoutRoot = styled("section")(({ theme }) => ({
  color: theme.palette.common.white,
  position: "relative",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  backgroundColor: "rgba(0,0,0,.5)",
  height: "100vh",
}));

const FadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1;}
`;

const Background = styled(Box)({
  animation: `${FadeIn}`,
  animationDuration: "4s",
  animationFillMode: "forwards",
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  zIndex: -2,
});

//
// Hero Layout
//

interface HeroLayoutProps {
  sxBackground: SxProps<Theme>;
}

function HeroLayout(
  props: React.HTMLAttributes<HTMLDivElement> & HeroLayoutProps
) {
  const { sxBackground, children } = props;

  return (
    <HeroLayoutRoot id="hero">
      <Container
        sx={{
          mt: 3,
          mb: 14,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {children}
        <Background sx={sxBackground} />
      </Container>
    </HeroLayoutRoot>
  );
}

//
// Hero Section
//

interface HeroSectionProps {
  backgroundImage: string;
  cursiveImage: string;
}

export default function HeroSection(props: HeroSectionProps) {
  const theme = useTheme();
  const { backgroundImage, cursiveImage } = props;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isHuge = useMediaQuery(theme.breakpoints.up("xl"));
  return (
    <HeroLayout
      sxBackground={{
        backgroundImage: `url(${imageUrl(backgroundImage)})`,
        backgroundPosition: "center",
        backgroundColor: "#000",
      }}
    >
      {/* This makes an unbelievable difference...*/}
      <img src={imageUrl(backgroundImage)} style={{ display: "none" }} />
      <img
        style={{
          //width: isMobile ? "70%" : "50%",
          width: "65%",
        }}
        src={imageUrl(cursiveImage)}
        alt="St. Innocent SVG"
      />
    </HeroLayout>
  );
}
