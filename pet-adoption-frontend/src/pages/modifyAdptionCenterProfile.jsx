import React, { useEffect, useState } from 'react';
// @mui/material
import { 
  TextField, Button, Paper, Box, Typography,  Grid } from '@mui/material';
import { useRouter } from 'next/router';


export default function modifyAdoptionCenterProfile(){

const router = useRouter();
const { adoptionID, email } = router.query;
const [adoptionCenter, setAdoptionCenter] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);


    return (
            
      <Typography
      variant="h4"
      align="center"
      sx={{ mt: 7, mb: 3, fontWeight: 500, color: '#333' }}
     >
        Register
     </Typography>

    );
}