import React, { useState } from 'react';
import Head from 'next/head';
import { Box, Card, CardContent, Stack, Typography, AppBar, Toolbar, Button, Drawer, ListItem, List, ListItemButton, ListItemIcon, Collapse, Grid, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Link } from '@mui/material';
import { useRouter } from 'next/router';

// Icons
import HouseIcon from '@mui/icons-material/House';
import ContactsIcon from '@mui/icons-material/Contacts';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function HomePage() {
  const router = useRouter();
  const [state, setState] = useState({ left: false });
  const [openAccount, setOpenAccount] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleNavigation = (page) => {
    switch (page) {
      case 'Login':
        router.push("/loginPage");
        break;
      case 'Register':
        router.push("/registerPage");
        break;
      case 'View Centers':
        router.push("/viewCenters");
        break;
      case 'Register Center':
        router.push("/addAdoptionCenter");
        break;
      default:
        console.error("Unknown page:", page);
        break;
    }
  };

  const handleAccountToggle = () => {
    setOpenAccount(!openAccount);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    console.log(anchor);
    setState({ ...state, [anchor]: open });
    console.log(state);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('View Centers')}>
            <ListItemIcon>
              <HouseIcon />
            </ListItemIcon>
            <ListItemText primary="View Centers" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>

      <main>
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" onClick={toggleDrawer('left', true)}> 
              <MenuIcon /> 
            </Button>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Whisker Works
            </Typography>
            <Button color="inherit" onClick={handleDialogOpen}>Register</Button>
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={state.left} onClose={toggleDrawer('left', false)}> 
          {list('left')} 
        </Drawer>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Welcome!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please choose the type of account you wish to register.
            </DialogContentText>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ marginTop: 2 }}>
              Already registered?{' '}
              <Link href="/loginPage" color="primary">
                Click here
              </Link>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { handleNavigation('Register'); handleDialogClose(); }} color="primary">
              Register Account
            </Button>
            <Button onClick={() => { handleNavigation('Register Center'); handleDialogClose(); }} color="primary">
              Register Adoption Center
            </Button>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ padding: 4, backgroundColor: '#f4f6f8' }}>
          <Stack spacing={4} alignItems="center">
            {/* Welcome Section */}
            <Card sx={{ width: '100%', maxWidth: 800, padding: 3 }} elevation={6}>
              <CardContent>
                <Typography variant="h3" align="center" gutterBottom>
                  Welcome to Whisker Works!
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  Your one-stop platform for adopting pets and finding loving homes. Check out our adoption centers or read testimonials from happy adopters below!
                </Typography>
              </CardContent>
            </Card>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ marginBottom: 2, padding: 2, backgroundColor: '#f0f8ff', borderRadius: 2, height: '100%' }} elevation={3}>
                <CardContent>
                  <Typography variant="body1" align="center">
                      "Whisker Works helped me find my best friend. I could't ask for a better pet adoption experience!"
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ marginTop: 1 }}>
                      - Alex R.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ marginBottom: 2, padding: 2, backgroundColor: '#f0f8ff', borderRadius: 2, height: '100%' }} elevation={3}>
                <CardContent>
                  <Typography variant="body1" align="center">
                      "The company Whisker Works is incredibly passionate about pets and their well-being. Highly recommend!"
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ marginTop: 1 }}>
                      - Jamie L.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ marginBottom: 2, padding: 2, backgroundColor: '#f0f8ff', borderRadius: 2, height: '100%' }} elevation={3}>
                    <CardContent>
                        <Typography variant="body1" align="center">
                            "Thanks to Whisker Works, I found the perfect companion. The process was smooth and stress-free!"
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ marginTop: 1 }}>
                            - Sarah K.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>


            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ marginBottom: 2, padding: 2, backgroundColor: '#f0f8ff', borderRadius: 2, height: '100%' }} elevation={3}>
                <CardContent>
                  <Typography variant="body1" align="center">
                      "I never knew adopting a pet could be so rewarding! Whisker Works made it a wonderful experience."
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ marginTop: 1 }}>
                      - Chris J.
                  </Typography>
                </CardContent>
              </Card>
          </Grid>
        </Grid>
                  

            {/* Other Information */}
            <Card sx={{ width: '100%', maxWidth: 800, padding: 3 }} elevation={4}>
              <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                  Did You Know?
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary">
                  Adopting a pet can bring endless joy and companionship. By adopting from one of our centers, you’re giving an animal a second chance at a loving home.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </main>
    </>
  );
}