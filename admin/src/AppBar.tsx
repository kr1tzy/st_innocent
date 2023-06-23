import { forwardRef } from "react";
import { AppBar, Toolbar, Typography, Button, useTheme } from "@mui/material";
import { SidebarToggleButton, ToggleThemeButton, useLogout } from "react-admin";
import { lightTheme, darkTheme } from "./Theme";

const MyLogoutButton = forwardRef((props: any, ref: any) => {
  const theme = useTheme();
  const logout = useLogout();
  const handleClick = () => logout();
  return (
    <Button
      style={{
        color: theme.palette.secondary.main,
      }}
      onClick={handleClick}
      ref={ref}
      {...props}
    >
      Logout
    </Button>
  );
});

export default function MyAppBar() {
  return (
    <AppBar style={{ marginBottom: "100px" }}>
      <Toolbar>
        <SidebarToggleButton />
        <Typography
          variant="h5"
          id="react-admin-title"
          style={{ marginLeft: "2.5%" }}
        />
        <span
          style={{
            position: "absolute",
            right: 20,
          }}
        >
          <ToggleThemeButton lightTheme={lightTheme} darkTheme={darkTheme} />
          <MyLogoutButton />
        </span>
      </Toolbar>
    </AppBar>
  );
}
