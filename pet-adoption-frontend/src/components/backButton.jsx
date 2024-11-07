import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Email } from '@mui/icons-material';

const BackButton = ({defaultPath='/customer-home'}) => {
    const router = useRouter();
    const { userId, email } = router.query;
    const [previousPage, setPreviousPage] = useState(defaultPath);
    
    // useEffect(() => {
    //     const fromPage = sessionStorage.getItem('fromPage');
    //     if (fromPage) {
    //         setPreviousPage(fromPage);
    //     }
    // }, []);

    const handleBackClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            if (email && userId) {
                router.push(`${previousPage}?email=${email}&userID=${userId}`);
            } else {
                router.push(`${defaultPath}?email=${email}&userID=${userId}`);
            }
        }
    };

    return (
        <Button
            variant="outlined"
            color="inherit"
            onClick={handleBackClick}
        >
            Back
        </Button>
    );
};

export default BackButton;