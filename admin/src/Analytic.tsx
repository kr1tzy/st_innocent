import {
  useTheme,
  useMediaQuery,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

export default function Analytic(props: {
  description: string;
  value: number;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box>
      <Card>
        <CardContent>
          <Typography
            variant={"h5"}
            id="site-visits"
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              fontSize: isMobile ? ".9rem" : "1.1rem",
            }}
          >
            {props.description}:
            <span
              style={{
                fontWeight: "bold",
                color: theme.palette.primary.main,
                marginLeft: "5%",
              }}
            >
              {props.value}
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
