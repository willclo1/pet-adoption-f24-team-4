import React from 'react';
import Head from 'next/head';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  const handleLoginSelect = () => {
    router.push('/loginPage');
  };

  const handleRegisterSelect = () => {
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

          <Stack direction="row" gap={2}>
            {/* Login Button */}
            <Button variant="contained" onClick={handleLoginSelect} sx={{ width: 200 }}>
              Login
            </Button>

            {/* Register Button */}
            <Button variant="contained" color="secondary" onClick={handleRegisterSelect} className={styles.wideButton}>
              Register
            </Button>

            {/* Register New Adoption Center Button */}
            <Button variant="outlined" color="primary" onClick={handleRegisterAdoptionCenter} sx={{ width: 260 }}>
              Register New Adoption Center
            </Button>
          </Stack>
        </Stack>
      </main>
    </>
  );
}