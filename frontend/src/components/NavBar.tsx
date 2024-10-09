import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { Stack } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
import useTheme from "../hooks/useTheme";
import useAuthStore from "../hooks/useAuthStore";
import UserAvatar from "./UserAvatar";

const drawerWidth = 240;

export default function NavBar() {
  let navItems = [
    { name: "Home", route: "/" },
    { name: "Login", route: "/login" },
    { name: "Register", route: "/register" },
  ];
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuthStore();
  if (user) {
    navItems = navItems.slice(0, 1);
  }else{
    navItems = navItems.slice(1, 3);
  }
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{ my: 2, color: "inherit", textDecoration: "none" }}
        component={Link}
        to="/"
      >
        Assessment
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.route} disablePadding>
            <ListItemButton
              component={Link}
              to={item.route}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
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
              variant="h6"
              component={Link}
              sx={{
                flexGrow: 1,
                display: { xs: "none", sm: "block" },
                color: "inherit",
                textDecoration: "none",
              }}
              to="/"
            >
              Assessment
            </Typography>
          </Box>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button
                key={item.route}
                component={Link}
                to={item.route}
                sx={{ color: "#fff" }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            {user && <UserAvatar name={user.name} />}

            <IconButton onClick={toggleDarkMode} sx={{ color: "white" }}>
              {darkMode ? (
                <LightModeIcon sx={{ cursor: "pointer" }} />
              ) : (
                <NightlightIcon sx={{ cursor: "pointer" }} />
              )}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
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
      </nav>
    </Box>
  );
}
