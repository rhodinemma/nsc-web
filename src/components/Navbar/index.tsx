import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Code Challenge", path: "/challenge" },
    { name: "Build a Project", path: "/build-project" },
    { name: "Logout", path: "/logout" },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ position: "relative", zIndex: 2 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            National Scratch Competition
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {navItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item.path)}>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
