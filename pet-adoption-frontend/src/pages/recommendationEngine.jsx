import React, { useEffect, useState } from 'react';
import { Stack, Typography, AppBar, Toolbar, Button, Drawer, ListItem, List, ListItemText, ListItemButton, Box, ListItemIcon, Card, CardMedia, CardActions} from '@mui/material';
import HouseIcon from '@mui/icons-material/House';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { useRouter } from 'next/router';

export default function recommendationEnginePage() {

  const [state, setState] = React.useState({ left: false });
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  //tinder like cards variables
  const [profilePicture, setProfilePicture] = useState('default-image-url.jpg');
  const [isLiked, setIsLiked] = useState(null);
    
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

  //handle yes or no button
  const handleYes = () => {
    setIsLiked(true);
    // TODO: call backend API to update user's status
    // and update preferences
  };
  const handleNo = () => {
    setIsLiked(false);
    // TODO: call backend API to update user's status
  };

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
        <Stack sx={{ paddingTop: 5 }} alignItems="center" gap={2}>
          <Typography variant="h3">Start Matching!</Typography>
          <Typography variant="body1" color="text.secondary">
            Adopt Now :D
          </Typography>

          {/* TODO: Fetch pet data from backend */}
          {/* Cards + Yes/No */}
          <Card sx={{ maxWidth: 600 }}>
            <CardMedia
              component="img"
              alt="Pet Image"
              height="500"
              width="400"
              image={profilePicture}
              sx={{ objectFit: 'cover' }}
            />
            <CardActions sx={{ justifyContent: 'space-between'}}>
              <Button 
              size="large" 
              color="primary" 
              onClick={handleYes}
              startIcon={<CheckCircleIcon sx={{ fontSize: 60}}/>}>
              </Button>
              <Button 
              size="large" 
              color="secondary" 
              onClick={handleNo}
              startIcon={<CancelIcon sx={{ fontSize: 60}}/>}>
              </Button>
            </CardActions>
          </Card>

          {isLiked !== null && (
            <Typography variant="h5" sx={{ marginTop: 5 }}>
              {isLiked? 'You liked this pet!' : 'You disliked this pet.'}
            </Typography>
          )}
        </Stack>
    </main>
  );
}