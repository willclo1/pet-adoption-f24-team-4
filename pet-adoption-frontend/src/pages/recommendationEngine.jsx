import React, { useEffect, useState } from 'react';
import { Stack, Typography, AppBar, Toolbar, Button, Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Drawer, ListItem, List, ListItemText, ListItemButton, Box, ListItemIcon} from '@mui/material';
import HouseIcon from '@mui/icons-material/House';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import { useRouter } from 'next/router';

export default function recommendationEnginePage() {

  const [state, setState] = React.useState({
    left: false
  });
    //const { email } = router.query; // Use email from query parameters
    //const [user, setUser] = useState(null);
    //const [loading, setLoading] = useState(true);
    //const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //       if (email) {
    //         try {
    //           const response = await fetch(`http://localhost:8080/users/email/${email}`); // Updated to fetch by email
    //           if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //           }
    //           const data = await response.json();
    //           setUser(data); // Set the user data
    //         } catch (error) {
    //           console.error('Error fetching user:', error);
    //           setError('User not found.'); // Update error state
    //         } finally {
    //           setLoading(false); // Loading is done
    //         }
    //       }
    //     };
    //     fetchUser();
    // }, [email]);

    // if (loading) {
    //     return <div>Loading...</div>; // Show a loading message while fetching
    // }
  
    // if (error) {
    //   return <div>{error}</div>; // Show the error message if there's an error
    // }
  
    // if (!user) {
    //   return <div>User not found.</div>; // Show a fallback if user data isn't available
    // }
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
          {['Adopt', 'Meeting', 'Contact'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
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