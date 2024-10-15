import React, {useEffect, useState} from 'react'
import Head from 'next/head'
import { Box, Card, CardContent, Stack, Typography, AppBar, Toolbar, Button, Drawer, ListItem, List, ListItemText, ListItemButton, ListItemIcon, Collapse} from '@mui/material'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router';

//Icons
import HouseIcon from '@mui/icons-material/House';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import LoginIcon from '@mui/icons-material/Login';
import { ExpandMore } from '@mui/icons-material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function HomePage() {
  const router = useRouter();
  const [state, setState] = useState({ left: false });
  const [openAccount, setOpenAccount] = useState(false);

  const handleLoginSelect = () => {
    router.push("/loginPage");
  }
  const handleRegisterSelect = () => {
    router.push("/registerPage");
  }

  const handleNavigation = (page) => {
    switch (page) {
      case 'Login':
        router.push("/loginPage");
        break;
      case 'Register':
        router.push("/registerPage");
        break;
      case 'View Centers':
        //router.push("/centersPage");
        break;
      case 'Contact':
        //router.push("/contactPage");
        break;
      default:
        console.error("Unknown", message);
        break;
    }
  }
  const handleAccountToggle = () => {
    setOpenAccount(!openAccount);
  }

  //side bar
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.keyCode === 'Tab' || event.keyCode === 'Shift')) {
      return;
    }
    setState({...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
    sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250}}
    onClick={toggleDrawer(anchor, false)}
    onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {/* Expandable Account Section */}
        <ListItemButton onClick={(e) => {
          e.stopPropagation();
          handleAccountToggle();
        }}>
          <ListItemIcon>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText primary="Account" />
          {openAccount ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>

        <Collapse in={openAccount} timeout="auto" unmountOnExit>
          <List>
            {/* Account settings */}
              <ListItemButton onClick={() => handleNavigation('Login')} sx={{ pl: 4 }}>
                <ListItemText>Login</ListItemText>
              </ListItemButton>
              <ListItemButton onClick={() => handleNavigation('Register')} sx={{ pl: 4 }}>
                <ListItemText>Register</ListItemText>
              </ListItemButton>
          </List>
        </Collapse>

        {/* Navigation items */}
        {['View Centers', 'Contact'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleNavigation(text)}>
              <ListItemIcon>
                {text === 'View Centers' && <HouseIcon />}
                {text === 'Contact' && <ContactsIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
    router.push('/registerPage');
  };

  const handleRegisterAdoptionCenter = () => {
    router.push('/registerAdoptionCenter');
  };

  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>

      <main>
      <AppBar position="static">
          <Toolbar>
            {/* Menu items */}
            <Button color='inherit' onClick={toggleDrawer('left', true)}> <MenuIcon /> </Button>

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Whisker Works
            </Typography>
          </Toolbar>
        </AppBar>

        {/* profile avatar comps*/}

        <Drawer anchor="left" open={state.left} onClose={toggleDrawer('left', false)}> {list('left')} </Drawer>

        {/* Home page content */}
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600 }} elevation={4}>
        <Stack sx={{ paddingTop: 8 }} alignItems="center" gap={4}>
          <Card sx={{ width: 600 }} elevation={6}>
            <CardContent>
              <Typography variant="h3" align="center" gutterBottom>
                Welcome to Whisker Works!
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Select an option below to login, register, or register a new adoption center.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                <img
                  src="https://side-out.org/wp-content/uploads/2021/07/5200.jpg"
                  width={400}
                  height={300}
                  alt="Adoption Center"
                  style={{ borderRadius: '8px' }}
                />
              </Box>
            </CardContent>

          </Card>
        </Stack>
      </main>
    </>
  );
}