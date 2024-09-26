import React from 'react';
import { Stack, Typography, AppBar, Toolbar, Button, Avatar } from '@mui/material';

export default function CustomerHomePage() {
  return (
    <main>
      <AppBar position = "static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Whisker Works
          </Typography>
          <Button  color="inherit">
            Edit Preferences
          </Button>
          <Button  color="inherit">
            Adopt a Pet
          </Button>
    
          <Avatar alt="User Name" sx={{ marginLeft: 2 }} />
        </Toolbar>
      </AppBar>
      <Stack sx={{ paddingTop: 10 }} alignItems="center" gap={2}>
        <Typography variant="h3">Whisker Works</Typography>
        <Typography variant="body1" color="text.secondary">
          Here, you can explore customer-related features and content.
        </Typography>
      </Stack>
    </main>
   
  );
}

