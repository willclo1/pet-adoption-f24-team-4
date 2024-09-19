import React from 'react';
import Head from 'next/head'
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import styles from '@/styles/Home.module.css'

export default function Prof(){

return (
    <main>
        <h1>Olf's Profile: </h1>

        <body>
            <p>
                Loves black dogs
            </p>
        </body>

        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
            <Card sx={{ width: 600 }} elevation={4}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                  <img src= 'https://i.pinimg.com/1200x/76/cb/25/76cb251888f228df534e434ce350d964.jpg' width={400} height={300}></img>
                </Box>
              </CardContent>

            </Card>
          </Stack>
    </main>



)

}