import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Email } from '@mui/icons-material';

const BackButton = ({ email, defaultPath = '/customer-home'}) => {
    const router = useRouter();
    const [previousPage, setPreviousPage] = useState(defaultPath);
    
    useEffect(() => {
        const fromPage = sessionStorage.getItem('fromPage');
        if (fromPage) {
            setPreviousPage(fromPage);
        }
    }, []);

    const handleBackClick = () => {
        if (previousPage) {
            router.push(previousPage);
        } else {
            router.push(`${defaultPath}?email=${email}`);
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