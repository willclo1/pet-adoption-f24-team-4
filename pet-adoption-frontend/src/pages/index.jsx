import React from 'react'
import Head from 'next/head'
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const handleLoginSelect = () => {
    router.push("/loginPage");
  }
  const handleRegisterSelect = () => {
    router.push("/registerPage");
  }

  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600 }} elevation={4}>
            <CardContent>
              <Typography variant='h3' align='center'>Welcome to Whisker Works!</Typography>
              <Typography variant='body1' color='text.secondary' align='center'>Select a button below to login/register</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                  <img src= 'https://side-out.org/wp-content/uploads/2021/07/5200.jpg' width={400} height={300}></img>
                </Box>
            </CardContent>

          </Card>
  
          <Stack direction= "row">
            {/* There are multiple ways to apply styling to Material UI components. One way is using the `sx` prop: */}
            <Button variant='contained' onClick={handleLoginSelect} sx={{ width: 200 }}>Login</Button>

            {/* Another way is by creating a dedicated CSS file and using the styles from there: */}
            <Button variant='contained' color="secondary" onClick={handleRegisterSelect} className={styles.wideButton}>Register</Button>
          </Stack>
        </Stack>
      </main>
    </>
  );
}