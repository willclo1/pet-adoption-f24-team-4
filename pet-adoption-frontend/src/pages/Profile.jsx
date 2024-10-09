import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import styles from '@/styles/Home.module.css'

export default function Prof(){
  const [message, setMessage] = useState('');

  useEffect(() => {
      // Fetch data from your Spring API
     fetch('http://localhost:8080/profile')
          .then(response => response.text())  // Assuming the server responds with plain text
          .then(data => {
              setMessage(data);  // Set the message state with the response data
          })
          .catch(error => {
              console.error('Error fetching data: ', error);
              setMessage('Failed to load data');  // Handle errors
          });
  }, []);  // The empty array ensures this effect runs only once after the initial render

  return (

    <main>
      <div>
          <h1>Olf's Profile</h1>
          <h3>Olf's Message of the Day: </h3>
          <p>{message}</p>

          <p> 
            
            <big> 
            <b>Favorite Pet: </b>
            
            </big>
            
            Black Dogs
            
            </p>


      </div>

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
