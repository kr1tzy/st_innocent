import App, { AppContext, AppInitialProps, AppProps } from "next/app";
import { NextResponse } from "next/api";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  responsiveFontSizes,
} from "@mui/material";
import { Navbar, Footer } from "@/components";
import { fetchPage } from "@/api";
import colors from "@/styles/colors.module.scss";
import "@/styles/calendar.scss";
import "@/styles/global.scss";
import "@/styles/fonts.scss";

export default function MyApp({
  Component,
  pageProps,
  // @ts-ignore
  props,
}: AppProps) {
  const theme = createTheme({
    palette: {
      primary: {
        main: colors.primaryMain,
        // @ts-ignore
        hover: colors.primaryHover,
      },
      secondary: {
        main: colors.secondaryMain,
        // @ts-ignore
        hover: colors.seconaryHover,
      },
    },
    typography: {
      fontFamily: "Staatliches",
    },
  });

  return (
    <ThemeProvider theme={responsiveFontSizes(theme)}>
      <main>
        <Component {...pageProps} />
        <CssBaseline />
      </main>
    </ThemeProvider>
  );
}
