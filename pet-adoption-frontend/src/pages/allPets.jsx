import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/router';
import { Box, Card, CardContent, Typography, CircularProgress, Alert, Grid, Autocomplete,Button,TextField, MenuItem,Avatar,Dialog,DialogTitle,DialogContent,DialogActions } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import NavBar from '@/components/NavBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function allPets() {
    const router = useRouter();
    const { email } = router.query;
    const { userID } = router.query;
    const [nav,setNav] = useState(false);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currPet,setCurrPet] = useState(null);
    const [error, setError] = useState(null);
    const [isDogChecked, setIsDogChecked] = useState(true);
    const [isCatChecked, setIsCatChecked] = useState(true);
    const [coatLength, setCoatLength] = useState('');
    const [furType, setFurType] = useState('');
    const [furColor, setFurColor] = useState({});
    const [size,setSize] = useState('');
    const [gender,setGender] = useState('');
    const [healthStatus, setHealthStatus] = useState('');
    const [temperament, setTemperament] = useState({});
    const [spayed, setSpayed] = useState('');
    const [dogBreed, setDogBreed] = useState({});
    const [catBreed, setCatBreed] = useState({});
    const [change,setChange] = useState(0);
    const [options, setOptions] = useState({
        species: [],
        coatLength: [],
        furType: [],
        furColor: [],
        dogBreed: [],
        catBreed: [],
        size: [],
        temperament: [],
        healthStatus: [],
        sex: [],
        spayedNeutered: [],
    });
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;



    const handleArrayChange = (name, value) => {
        console.log('i love rollox')
        console.log(name);
        setChange(change+1);

        if(name == 'temperament'){
            setTemperament(temperament => ({ ...temperament, [name]: value }));
        }
        if(name == 'furColor'){
            setFurColor(furColor => ({ ...furColor, [name]: value }));
        }
        if(name == 'dogBreed'){
            setDogBreed(dogBreed => ({ ...dogBreed, [name]: value }));
        }
        if(name == 'catBreed'){
            setCatBreed(catBreed => ({ ...catBreed, [name]: value }));
        }  
    
    };

    const handleCenter = (adoptionID) => {
        router.push({
      pathname: `/centerPublicProfile`,
      query: { adoptionID },
    });
    };

    const handleChange = (pet) =>{
        setChange(change+1);

        console.log('i love rollox')
        console.log(pet);

        if(pet == 'dog'){
            if(isDogChecked){
                setIsDogChecked(false);
            }
            else{
                setIsDogChecked(true);

            }
        }
        if(pet == 'cat'){
            if(isCatChecked){
                setIsCatChecked(false);
            }
            else{
                setIsCatChecked(true);
            }
        }

        if(pet.target){
            if(pet.target.name == 'coatLength'){
                setCoatLength(pet.target.value)
            }
            if(pet.target.name == 'furType'){
                setFurType(pet.target.value)
            }
            if(pet.target.name == 'furColor'){
                setFurColor(pet.target.value)
            }
            if(pet.target.name == 'temperament'){
                setTemperament(pet.target.value)
            }
            if(pet.target.name == 'petSize'){
                setSize(pet.target.value)
            }
            if(pet.target.name == 'healthStatus'){
                setHealthStatus(pet.target.value)
            }
            if(pet.target.name == 'sex'){
                setGender(pet.target.value)
            }
            if(pet.target.name == 'spayedNeutered'){
                setSpayed(pet.target.value)
            }
            
           
           /* if(pet.target.name == 'dogBreed'){
                setCoatLength(pet.target.value)
            }
            if(pet.target.name == 'catBreed'){
                setCoatLength(pet.target.value)
            }
            */

    

        }
        
    }

    const handleGoBack = () => {
        if(email){
            router.push(`/viewCenters?email=${email}&userID=${userID}`)

        }
        else{

            router.push('/viewCenters')
        }
        

    }
    const handleViewPet = (pet) =>{
        setCurrPet(pet);   

    }
    const handleExit = () => {
        setCurrPet(null);


    }
    
    function shuffleArray(array) {
        let arr = [];

        for (let i = array.length - 1; i > 0; i--) {
            // Generate a random index lower than i
            const j = Math.floor(Math.random() * (i + 1));
            let valid = true;
            // Swap elements at indices i and j
            [array[i], array[j]] = [array[j], array[i]];

            valid = isDogChecked && array[i].species == 'DOG';
            valid = valid || isCatChecked &&array[i].species == 'CAT';
        


            valid = (furType == '' && valid) ||  (valid && array[i].furType.toLowerCase() == furType.toLowerCase());
            valid = (coatLength == '' && valid) ||  (valid && array[i].coatLength.toLowerCase() == coatLength.toLowerCase());
            
            valid = (size == '' && valid) ||  (valid && array[i].petSize.toLowerCase() == size.toLowerCase()) || 
                    (valid && array[i].petSize.toLowerCase() == 'extra_large' && size.toLowerCase() == 'extra large')
            ;


            valid = (healthStatus == '' && valid) ||  (valid && array[i].healthStatus.toLowerCase() == healthStatus.toLowerCase());
            valid = (gender == '' && valid) ||  (valid && array[i].sex.toLowerCase() == gender.toLowerCase());

            valid = (spayed == '' && valid) ||  (valid && array[i].spayedNeutered.toLowerCase() == 'spayed_neutered' && spayed.toLowerCase() == 'spayed neutered')
                    || (valid && array[i].spayedNeutered.toLowerCase() == 'not_spayed_neutered' && spayed.toLowerCase() == 'not spayed neutered');
            
            
            if(Object.entries(temperament).length > 0){
                const entries  = Object.entries(temperament);
                let key = entries[0][0];
                let value = entries[0][1];
                let testTemp = !(value.length > 0);
                for (let j = 0; j < value.length && !testTemp; j++) {
                    for(let k = 0; k < array[i].temperament.length && !testTemp;k++){
                        if( array[i].temperament[k] && value[j] && array[i].temperament[k].toLowerCase() == value[j].toLowerCase()){
                            testTemp = true;
                            j = 999;
                            k = 999;
                        }
                    }
                }
                valid = valid && testTemp;
            }

            if(Object.entries(furColor).length > 0){
                const entries  = Object.entries(furColor);
                let key = entries[0][0];
                let value = entries[0][1];
                let testTemp = !(value.length > 0);
                for (let j = 0; j < value.length && !testTemp; j++) {
                    for(let k = 0; k < array[i].furColor.length && !testTemp;k++){
                        if( array[i].furColor[k] && value[j] && array[i].furColor[k].toLowerCase() == value[j].toLowerCase()){
                            testTemp = true;
                            j = 999;
                            k = 999;
                        }
                    }
                }
                valid = valid && testTemp;
            }
            
            if(Object.entries(dogBreed).length > 0){
                
                const entries  = Object.entries(dogBreed);
                let key = entries[0][0];
                let value = entries[0][1];
                let testTemp = array[i].species == 'CAT';

                for (let j = 0; j < value.length && !testTemp; j++) {

                    for(let k = 0; k <array[i].dogBreed.length && !testTemp;k++){
            
                        if( array[i].dogBreed[k] && value[j] && array[i].dogBreed[k].toLowerCase() == value[j].toLowerCase()){
                            testTemp = true;
                            j = 999;
                            k = 999;
                        }
                    }
                }
                valid = (valid && testTemp);
            }

            if(Object.entries(catBreed).length > 0){
                
                const entries  = Object.entries(catBreed);
                let key = entries[0][0];
                let value = entries[0][1];
                let testTemp = array[i].species == 'DOG';
                console.log(array[i].species)
                for (let j = 0; j < value.length && !testTemp; j++) {

                    for(let k = 0; k <array[i].catBreed.length && !testTemp;k++){
                        console.log("FIGHT")
                        console.log(array[i].catBreed)
                        console.log(value[j])
                        if( array[i].catBreed[k] && value[j] && array[i].catBreed[k].toLowerCase() == value[j].toLowerCase()){
                            testTemp = true;
                            j = 999;
                            k = 999;
                        }
                    }
                }
                valid = (valid && testTemp);
            }

            if(valid){
                
                
                arr.push(array[i])
                
            }
    
        }
        return arr;
    }

    const handleAdopt = (id) => {
        // Get the pet ID of the currently viewed pet
        const petID = id;
        let valid = true;
        console.log(id)
        
        // Check if petID is available
        if (!petID) {
          console.error('No pet ID found for the current pet.');
          return;
        }

        // Function to handle the adoption rate request
        const fetchAdoptRate = async () => {
          try {
            
            const token = localStorage.getItem('token');
            console.log(token)
            const response = await fetch(`${apiUrl}/RecEng/rateAdoptedPet`, {
              method: 'PUT', // Ensure that the method matches your API
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: Number(userID),
                petId: Number(petID),
              }),
            });
            
            if (!response.ok) {
                console.log('DUDE')
                router.push(`/registerPage`);
                throw new Error(`Failed to fetch adoption rate. Status: ${response.status}`);
             
            }
      
            const data = await response.json();
            console.log("Adoption data fetched successfully:", data);
          } catch (error) {
            router.push(`/registerPage`);
            valid = false;
            console.error('Error during adoption rate fetch:', error);
          }
        };
      
    
        fetchAdoptRate();
      
        setTimeout(() => {
            if (valid){
                router.push(`/message?email=${email}&userID=${userID}`);
            }
        }, 1000);
      };

      useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token)
        fetch(`${apiUrl}/getOptions`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => setOptions(data))
            .catch(error => console.error('Error fetching options:', error));
    }, []);

    // Fetch Pets for the Adoption Center
    useEffect(() => {
        const fetchPets = async () => {
            try {
                console.log(`${apiUrl}/pets`)
                const response = await fetch(`${apiUrl}/pets`, {
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch Pets");
                }
                const data = await response.json();
                const dat = shuffleArray(data);
                setPets(dat);

                console.log(data);
            } catch (error) {
                console.error("Error fetching Pets:", error);
                setError("Failed to load Pets.");
            } finally {
                setLoading(false);
            }
        };
        fetchPets();
        if(userID){
            setNav(true);
        }
        
        console.log('i fire once');
    }, [change]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return (
            <Box sx={{ padding: 4, textAlign: 'center'}}>
                <Alert severity="error">{error}</Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    
                    onClick={() => router.push('/')}
                >
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <main>
            <div style={{ zindex: 10 }}>
             {nav ? <NavBar /> : <p></p>}
            </div>

        
        <Box sx={{ padding: 4, backgroundColor: '#f0f4f8' }}>
            
            <div className='card-container'>
                    <div  className='fixed-card'>
                    <Typography variant="body1" className="sort-by-typography">
                            Sort by:
                        </Typography>
                        <div className='check-container'>

                        <Typography variant="h4"    >
                            Dog
                        </Typography>
                        
                        <input
                            type="checkbox"
                            className="cool-checkbox"
                            
                            checked={isDogChecked}
                            onChange={() => handleChange('dog')}
                        />

                        </div>

                        <div className='check-container'>

                        <Typography variant="h4" >
                            Cat
                        </Typography>
                        <input
                            type="checkbox"
                            className="cool-checkbox"
                            checked={isCatChecked}
                            onChange={() => handleChange('cat')}
                        />
                        </div>
                        
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="Coat Length"
                                name="coatLength"
                                value={coatLength}
                                onChange={handleChange}
                                fullWidth
                            >
                                {options.coatLength.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="Fur Type"
                                name="furType"
                                value={furType}
                                onChange={handleChange}
                                fullWidth
                            >
                                {options.furType.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                multiple
                                options={options.furColor}
                                getOptionLabel={(option) => option}
                                onChange={(e, newValue) => handleArrayChange('furColor', newValue)}
                                renderInput={(params) => <TextField {...params} label="Fur Color" fullWidth />}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <Autocomplete
                                multiple
                                options={options.temperament}
                                getOptionLabel={(option) => option}
                                onChange={(e, newValue) => handleArrayChange('temperament', newValue)}
                                renderInput={(params) => <TextField {...params} label="Temperament" fullWidth />}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                select
                                label="Pet Size"
                                name="petSize"
                                value={size}
                                onChange={handleChange}
                                fullWidth
                            >
                                {options.size.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="Health Status"
                                name="healthStatus"
                                value={healthStatus}
                                onChange={handleChange}
                                fullWidth
                            >
                                {options.healthStatus.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="Gender"
                                name="sex"
                                value={gender}
                                onChange={handleChange}
                                fullWidth
                            >
                                {options.sex.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="Spayed Neutered"
                                name="spayedNeutered"
                                value={spayed}
                                onChange={handleChange}
                                fullWidth
                            >
                                {options.spayedNeutered.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        

                        {isDogChecked && (
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    options={options.dogBreed}
                                    getOptionLabel={(option) => option}
                                    onChange={(e, newValue) => handleArrayChange('dogBreed', newValue)}
                                    renderInput={(params) => <TextField {...params} label="Dog Breed" fullWidth />}
                                />
                            </Grid>
                        )}
                        {isCatChecked && (
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    options={options.catBreed}
                                    getOptionLabel={(option) => option}
                                    onChange={(e, newValue) => handleArrayChange('catBreed', newValue)}
                                    renderInput={(params) => <TextField {...params} label="Cat Breed" fullWidth />}
                                />
                            </Grid>
                        )}


                    </div>
                <div>
                <Button style={{ zindex: 1 }}
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                sx={{ marginBottom: 2, marginLeft: 35,color: '#1976d2', borderColor: '#1976d2' }}
                onClick={handleGoBack}
            >
                Back to Home
            </Button>
                    <Card sx={{ boxShadow: 3, borderRadius: 4, padding: 3 }} className='scrollable-card'>

                        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                            Pets Available for Adoption
                        </Typography>

                        {pets.length === 0 ? (
                            <Typography variant="body1" color="textSecondary">
                            No pets available at this time.
                        </Typography>
                        ) : (
                            <Grid container spacing={3}>
                                {pets.map((pet) => (
                                    <Grid item xs={12} sm={4} md={2.4} key={pet.id}>
                                        <Card sx={{ width: 250,height: 325, borderRadius: 2, backgroundColor: '#fff', boxShadow: 2, padding: 2 }} >
                                        <Avatar
                                                src={pet.profilePicture && pet.profilePicture.imageData ? `data:image/png;base64,${pet.profilePicture.imageData}` : null}
                                                sx={{
                                                    flex: 1,
                                                    width: 225,
                                                    height: 175,
                                                    resizeMode: 'contain',
                                                    borderRadius: '0%', // if you want it circular, use '50%'
                                                    objectPosition: 'center'  // Centers the image within the element
                                                }}
                                                style={{border: 0, objectfit: 'fill'}}
                                                
                                                
                                            />
                                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                                <Avatar sx={{ marginRight: 2, backgroundColor: '#1976d2' }}>
                                                    <PetsIcon />
                                                </Avatar>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    {pet.name} 
                                                </Typography>
                                            </Box>
                                            <div className="button-container">
                                                <Button className="adopt-button" onClick={() => handleViewPet(pet)}>View Pet</Button>
                                                <Button className="adopt-button" onClick={() => handleCenter(pet.center.adoptionID)}>View Center</Button>
                                            </div>

                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Card>
                </div>
            </div>
            <Dialog open={currPet}>
                <DialogTitle>{"Would You Like To Adopt This Pet?"}</DialogTitle>
                <DialogContent>
                <Avatar
                    src={currPet && currPet.profilePicture && currPet.profilePicture.imageData ? `data:image/png;base64,${currPet.profilePicture.imageData}` : null}
                        sx={{
                            flex: 1,
                            width: 450,
                            height: 350,
                            resizeMode: 'contain',
                            borderRadius: '0%', // if you want it circular, use '50%'
                            objectPosition: 'center'  // Centers the image within the element
                        }}
                        style={{border: 0, objectfit: 'fill'}}
                        
                        
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                        <Avatar sx={{ marginRight: 2, backgroundColor: '#1976d2' }}>
                            <PetsIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {currPet ? currPet.name : null} 
                        </Typography>
                        
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                        Type: {currPet ? currPet.species : null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Age: {currPet ? currPet.age : null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Coat Length: {currPet ? currPet.coatLength : null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                         Breed: {currPet ? currPet.species == 'CAT' ? currPet.catBreed : currPet.dogBreed : null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                         Fur Type: {currPet ? currPet.furType: null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                         Health Status: {currPet ? currPet.healthStatus: null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                         Size: {currPet ? currPet.petSize: null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                         Sex: {currPet ? currPet.sex: null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                         spayed Neutered: {currPet ? currPet.spayedNeutered: null}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Temperament: {currPet ? currPet.temperament: null}
                    </Typography>
                   

                </DialogContent>
                <DialogActions>
                    <Button className="adopt-button" onClick={handleExit}>No</Button>
                    <Button onClick={() => handleAdopt(currPet ? currPet.id : null)} className="adopt-button">
                        Adopt
                    </Button>

                </DialogActions>
            </Dialog>
            
            </Box>
            </main>
        
    );
}