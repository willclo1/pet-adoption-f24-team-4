import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'

export default function adoptionHome(){
    const[data, setData] = useState('');
    useEffect(() =>{ 
        const fetchData = () =>{
            fetch("http://localhost:8080/AdoptHome")
            .then(function(respose){
                if(!Response.ok){
                    throw new Error("Bad network response");
                }
                return respose.text();
            })
            .then(function(result){
                setData(result);
            })
            .catch(function (error) {
                console.error('Error fetching data:', error);
            });


        };

        fetchData();
        return <h1>{data}</h1>

    });




    }
    
    
    
    
    

