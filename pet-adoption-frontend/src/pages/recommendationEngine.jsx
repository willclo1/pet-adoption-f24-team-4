import React, { useEffect, useState } from 'react';
import { Stack, Typography, AppBar, Toolbar, Button, Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Drawer, ListItem, List, ListItemText, ListItemButton, Box, ListItemIcon} from '@mui/material';
import HouseIcon from '@mui/icons-material/House';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import { useRouter } from 'next/router';

export default function recommendationEnginePage() {

  const [state, setState] = React.useState({ left: false });
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
    
  //email functionality
  useEffect(() => {
    if(router.isReady) {
      const { email } = router.query;
      if(email) {
        console.log('Tracking user email');
        setUserEmail(email);
      }
    }
  }, [router.isReady, router.query]);

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
        {['Home', 'Adopt', 'Meeting', 'Contact'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => {
              const path = text === 'Home'? '/customer-home' : '/recommendation-engine'; //TODO: fix this to actually go back to user home based on email retrieval

              router.push({
                pathname: path,
                query: { email: userEmail || ''},
              })
            }}>
              <ListItemIcon>
                {text === 'Home' && <HouseIcon />}
                {text === 'Adopt' && <PetsIcon />}
                {text === 'Meeting' && <GroupsIcon />}
                {text === 'Contact' && <ContactsIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
      <main>
          <AppBar position="static">
      <Toolbar>
        {/* Menu items */}
        {['Menu'].map((anchor) => (
          <React.Fragment key={anchor}>
            <Button 
            color="inherit" 
            onClick={toggleDrawer(anchor, true)} 
            menuIcon={<MenuIcon/>}>
              {anchor}
            </Button>
            <Drawer 
            anchor={anchor} 
            open={state[anchor]} 
            onClose={toggleDrawer(anchor, false)}
            sx={{ zIndex: (theme) => theme.zIndex.modal + 1}}>
              {list(anchor)}
            </Drawer>
          </React.Fragment>
        ))}

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Whisker Works
        </Typography>

      </Toolbar>
    </AppBar>
    <Stack sx={{ paddingTop: 10 }} alignItems="center" gap={2}>
      <Typography variant="h3">Start Matching!</Typography>
      <Typography variant="body1" color="text.secondary">
        Adopt Now :D
      </Typography>
    </Stack>
      </main>
  );
}