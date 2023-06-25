import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@mui/material";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ConnectModal } from "@/components";

//
// Navbar
//

interface NavItem {
  title: string;
  link: string;
}

interface NavbarProps {
  support: string;
}

export default function Navbar(props: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const theme = useTheme();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 240;
  const navItems: NavItem[] = [
    //{ title: "Home", link: "#hero" },
    { title: "FAQs", link: "#faqs" },
    { title: "Parish Life", link: "#parish-life" },
    { title: "Calendar", link: "#calendar" },
    { title: "Who We Are", link: "#who-we-are" },
    { title: "Connect", link: "connect" },
    { title: "Support", link: props.support },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h5"
        component={Link}
        href="/#"
        sx={{
          textDecoration: "none",
          color: "#000",
          "&:hover": {
            cursor: "pointer",
          },
        }}
      >
        Orthodoxy in the falls
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => {
          return item.link !== "connect" ? (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                component={Link}
                key={item.title}
                href={item.link}
                sx={{
                  textAlign: "center",
                }}
              >
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ) : (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                key={item.title}
                onClick={() => setConnectOpen(true)}
                sx={{
                  textAlign: "center",
                }}
              >
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <nav>
      <AppBar
        position="fixed"
        style={{ backgroundColor: "rgba(42,68,106,.5)" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            component={Link}
            href="/#"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
              textDecoration: "none",
              color: "#fff",
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            Orthodoxy in the falls
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) =>
              item.link !== "connect" ? (
                <Button
                  component={Link}
                  key={item.title}
                  href={item.link}
                  sx={{
                    fontSize: "1.25rem",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.main,
                      cursor: "pointer",
                    },
                  }}
                >
                  {item.title}
                </Button>
              ) : (
                <Button
                  key={item.title}
                  onClick={() => setConnectOpen(true)}
                  sx={{
                    fontSize: "1.25rem",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.main,
                      cursor: "pointer",
                    },
                  }}
                >
                  {item.title}
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <ConnectModal
        open={connectOpen}
        handleClose={() => setConnectOpen(false)}
      />
    </nav>
  );
}
