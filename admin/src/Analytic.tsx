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
            variant={isMobile ? "h5" : "h5"}
            id="site-visits"
            style={{
              fontSize: isMobile ? ".9em" : "",
              fontWeight: isMobile ? "bold" : "",
            }}
          >
            {props.description}:{" "}
            <span
              style={{ fontWeight: "bold", color: theme.palette.primary.main }}
            >
              {props.value}
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
