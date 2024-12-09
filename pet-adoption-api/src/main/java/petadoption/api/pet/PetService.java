package petadoption.api.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterRepository;
import petadoption.api.adoptionCenter.AdoptionCenterService;
import petadoption.api.pet.criteria.*;
import petadoption.api.pet.criteria.breed.CatBreed;
import petadoption.api.pet.criteria.breed.DogBreed;
import petadoption.api.Utility.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

import static petadoption.api.pet.criteria.Attribute.*;
import static petadoption.api.pet.criteria.Attribute.speciesList;

@Service
public class PetService {
    @Autowired
    private PetRepository repository;
    private ImageService imageService;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    private static final long DEFAULT_RAND_PETS = 500;

    public Optional<Pet> savePet(Long petID){
        return repository.findById(petID);
    }

    public Pet savePet(Pet pet){
        return repository.save(pet);
    }

    public Pet savePet(Pet pet, Long adoptionID) {
        if(adoptionID != null) {
            Optional<AdoptionCenter> center = adoptionCenterRepository.findById(adoptionID);
            if (center.isPresent()) {
                pet.setCenter(center.get());
            } else {
                throw new RuntimeException("Adoption Center not found.");
            }
        }

        return repository.save(pet);
    }

    public Optional<Pet> getPetById(long petId){
        return repository.findById(petId);
    }

    public List<Pet> getAllPets() {
        return repository.findAll();
    }

    public List<Pet> getRandPets(long numPets) { return repository.getRandom(numPets); }

    public List<Pet> getRandPets() { return repository.getRandom(DEFAULT_RAND_PETS); }

    public List<Pet> getAdoptionCenterPets(long adoptionID) {
        return repository.findByCenter_AdoptionID(adoptionID);
    }

    public void deletePet(long petID){
        repository.deleteById(petID);
    }

    /*
    public Pet generatePet(String name, Species species, int weight,
                           CoatLength coatLength, FurType furType, Set<FurColor> furColors,
                           AdoptionCenter adoptionCenter,Set<DogBreed> dogBreeds,
                           Set<CatBreed> catBreeds, Size size,int age,
                           Set<Temperament> temperaments, Health health,SpayedNeutered spayedNeutered,
                           Sex sex) throws IOException {

        Pet pet = new Pet(name,species,weight,coatLength,furType,furColors,adoptionCenter,dogBreeds,catBreeds,size,age,temperaments,health,spayedNeutered,sex);
        return pet;
    }

    */

    public Pet generatePet(List<AdoptionCenter> adoptionCenters, String species, String dogBreed,String catBreed, String furType,
                           String[] furColor,String furLength,String size, String health,String gender,String spayed,String [] temp,int age, int weight ) throws IOException {
        Pet pet = new Pet();
        HashSet<String> attributes = new HashSet<>();

        int speciesInt = Arrays.asList(Attribute.speciesList).indexOf(species);
        int dogBreedInt = -1;
        int catBreedInt = -1;
        if(!dogBreed.equals("n")){

            dogBreedInt = Arrays.asList(Attribute.dogBreedList).indexOf(dogBreed);
            System.out.println(dogBreedInt);
            System.out.println(dogBreed);

        }
        else {

            catBreedInt = Arrays.asList(Attribute.catBreedList).indexOf(catBreed);
            System.out.println(catBreedInt);
            System.out.println(catBreed);
        }


        int furTypeInt = Arrays.asList(Attribute.furTypeList).indexOf(furType);
        int[] furColorInt = new int[furColor.length]; // Create an array of the same length as furColor

        for (int i = 0; i < furColor.length; i++) {
            furColorInt[i] = Arrays.asList(Attribute.furColorList).indexOf(furColor[i]);
        }
        int furLengthInt = Arrays.asList(Attribute.furLengthList).indexOf(furLength);
        int sizeInt = Arrays.asList(Attribute.sizeList).indexOf(size);
        int healthInt = Arrays.asList(Attribute.healthList).indexOf(health);
        int genderInt = Arrays.asList(Attribute.genderList).indexOf(gender);
        int spayedInt = Arrays.asList(Attribute.spayedNeuteredList).indexOf(spayed);

        int[] tempInt = new int[temp.length]; // Create an array of the same length as furColor

        for (int i = 0; i < temp.length; i++) {
            tempInt[i] = Arrays.asList(Attribute.temperamentList).indexOf(temp[i]);
        }


        // Using the predefined lists from the Attribute class
        attributes.add(buildAttribute(
                Attribute.typeList[0],
                Attribute.speciesList[speciesInt]
        ));

        if(dogBreedInt != -1){

            attributes.add(buildAttribute(
                    Attribute.typeList[2],
                    Attribute.dogBreedList[dogBreedInt]

            ));
        }
        else {
            attributes.add(buildAttribute(
                    Attribute.typeList[1],
                    Attribute.catBreedList[catBreedInt]
            ));

        }

        attributes.add(buildAttribute(
                Attribute.typeList[3],
                Attribute.furTypeList[furTypeInt]
        ));

        for(int i = 0 ; i < furColor.length ; i++){
            attributes.add(buildAttribute(
                    Attribute.typeList[4],
                    Attribute.furColorList[furColorInt[i]]
            ));
        }



        attributes.add(buildAttribute(
                Attribute.typeList[5],
                Attribute.furLengthList[furLengthInt]
        ));

        attributes.add(buildAttribute(
                Attribute.typeList[6],
                Attribute.sizeList[sizeInt]
        ));
        attributes.add(buildAttribute(
                Attribute.typeList[7],
                Attribute.healthList[healthInt]
        ));

        attributes.add(buildAttribute(
                Attribute.typeList[8],
                Attribute.genderList[genderInt]
        ));

        attributes.add(buildAttribute(
                Attribute.typeList[9],
                Attribute.spayedNeuteredList[spayedInt]
        ));


        for (int i = 0; i < temp.length; i++) {

            attributes.add(buildAttribute(
                    Attribute.typeList[10],
                    Attribute.temperamentList[tempInt[i]]
            ));
        }
        // Age
        attributes.add(buildAttribute(
                typeList[11],
                Integer.toString(age)
        ));
        //weight
        attributes.add(buildAttribute(
                typeList[12],
                Integer.toString(weight)
        ));

        Random random = new Random();

        if (adoptionCenters != null && !adoptionCenters.isEmpty()) {
            pet.setCenter(adoptionCenters.get(random.nextInt(adoptionCenters.size())));
        }

        pet.setAttributes(attributes);
        System.out.println("FINSH");
        // Assuming there's a collection called pets where you store all pet objects
        return pet;

    }


    public List<Pet>  addSamplePets(List<AdoptionCenter> adoptionCenters) throws IOException {

        Random random = new Random();
        List<Pet> pets = new ArrayList<>();

        //DOGS


        Pet pet = generatePet(adoptionCenters,"Dog","Greyhound","n","Smooth",new String[]{"Grey"},
                "Medium", "Large","Good","Male", "Y", new String[]{"Active", "Reactive","Athletic"},4,50 );
        pet.setName("Wilson");

        File imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api//home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/GreyHound.jpg");
        Image image = new Image();
        image.setType("image/jpg");
        image.setName("GreyHound.jpg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet.setProfilePicture(image);
        pets.add(pet);



        // Assuming we have a list of adoption centers and adoptionCenter.get() provides a random one.



        // Set the name
        pet = generatePet(adoptionCenters,"Dog","German Shepherd Dog","n","Smooth",new String[]{"Black","Bronze"},
                "Medium", "Large","Excellent","Male", "Y", new String[]{"Active", "Sociable","Friendly"},4,50 );
        pet.setName("Axel");

        //   Assuming image handling is somewhere in your application
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/german-shepherd-dog.jpeg");
        image = new Image();
        image.setType("image/jpeg");
        image.setName("german-shepherd-dog.jpg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);

        // Add to your collection
        pets.add(pet);



        pet = generatePet(adoptionCenters, "Dog", "Cesky Terrier", "n", "Double", new String[]{"Grey", "White"}, "Medium", "Small", "Good", "Male", "Y", new String[]{"Aggressive", "Bossy", "Anxious"}, 4, 20);
        pet.setName("Jake");

        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/CESKYTERRIER.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("CESKYTERRIER.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Dog", "Giant Schnauzer", "n", "Smooth", new String[]{"Black"}, "Long", "Extra Large", "Excellent", "Female", "Y", new String[]{"Adaptable", "Friendly", "Calm"}, 7, 80);
        pet.setName("Jack Harlow");

        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/GIANTSCHNAUZER.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("GIANTSCHNAUZER.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);



        pet = generatePet(adoptionCenters, "Dog", "Doberman Pinscher", "n", "Silky", new String[]{"Black", "Brown"}, "Short", "Large", "Excellent", "Male", "Y", new String[]{"Aggressive", "Loyal", "Reactive"}, 6, 75);
        pet.setName("Jackson");

        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Doberman.jpeg");
        image = new Image();
        image.setType("image/jpeg");
        image.setName("Doberman.jpeg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Dog", "Poodle", "n", "Rough", new String[]{"Brown"}, "Medium", "Small", "Excellent", "Female", "Y", new String[]{"Passive", "Easy Going", "Excitable"}, 4, 20);
        pet.setName("Rolex");

        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/poodle.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("poodle.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Dog", "Boxer", "n", "Smooth", new String[]{"White", "Brown"}, "Short", "Large", "Good", "Female", "Y", new String[]{"Aggressive", "Reactive", "Curious"}, 7, 55);
        pet.setName("Waller");

        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Boxer.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Boxer.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Dog", "Catahoula Leopard Dog", "n", "Silky", new String[]{"White", "Grey"}, "Short", "Large", "Good", "Male", "Y", new String[]{"Agile", "Calm", "Curious"}, 2, 20);
        pet.setName("Bart");

        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/CATAHOULALEOPARDDOG.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("CATAHOULALEOPARDDOG.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Dog", "Golden Retriever", "n", "Double", new String[]{"Bronze"}, "Long", "Large", "Excellent", "Male", "Y", new String[]{"Active", "Playful", "Loyal"}, 5, 70);
        pet.setName("Monke");

        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/GoldenRetreiver.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("GoldenRetreiver.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Dog", "Tosa", "n", "Smooth", new String[]{"Bronze", "White"}, "Medium", "Large", "Excellent", "Male", "Y", new String[]{"Aggressive", "Active", "Dependent"}, 6, 50);
        pet.setName("Cola");

        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/tosa.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("tosa.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Cat", "n", "Siamese", "Silky", new String[]{"Black", "White"}, "Short", "Small", "Good", "Male", "Y", new String[]{"Active", "Sociable", "Even Tempered"}, 8, 25);
        pet.setName("WilburForce");

        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Siamese.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Siamese.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Cat", "n", "Domestic Shorthair", "Rough", new String[]{"Black", "Brown"}, "Short", "Medium", "Excellent", "Female", "Y", new String[]{"Active", "Easy Going"}, 4, 52);
        pet.setName("Jerome");

        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/cat1.jpg");
        image = new Image();
        image.setType("image/jpeg");
        image.setName("cat1.jpg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Domestic Shorthair", "Rough", new String[]{"Grey"}, "Short", "Medium", "Excellent", "Female", "Y", new String[]{"Aggressive", "Anxious", "Easily Trained"}, 6, 18);
        pet.setName("Aubrey");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/cat2.jpg");
        image = new Image();
        image.setType("image/jpg");
        image.setName("cat2.jpg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Domestic Shorthair", "Smooth", new String[]{"Black", "White"}, "Short", "Small", "Excellent", "Male", "Y", new String[]{"Affectionate", "Calm", "Loyal", "Curious"}, 7, 23);
        pet.setName("Jake");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/cat3.jpeg");
        image = new Image();
        image.setType("image/jpeg");
        image.setName("cat3.jpeg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "American Bobtail", "Smooth", new String[]{"Brown"}, "Short", "Medium", "Excellent", "Female", "Y", new String[]{"Aggressive", "Bossy", "Bold"}, 4, 34);
        pet.setName("Stewie");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Bobtail.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Bobtail.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Cat", "n", "American Curl", "Smooth", new String[]{"White"}, "Medium", "Medium", "Excellent", "Female", "Y", new String[]{"Passive", "Calm", "Intelligent"}, 4, 27);
        pet.setName("SETH");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/curl.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("curl.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Cat", "n", "Devon Rex", "Smooth", new String[]{"White", "Grey"}, "Short", "Small", "Fair", "Female", "Y", new String[]{"Aggressive", "Adaptable", "Aloof"}, 3, 15);
        pet.setName("Wizard");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/REX.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("REX.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Cat", "n", "Maine Coon", "Double", new String[]{"Bronze"}, "Long", "Large", "Excellent", "Male", "Y", new String[]{"Agile", "Easily Trained", "Bold", "Intelligent"}, 2, 35);
        pet.setName("UltimateDestroyerOfWorlds");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/maine.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("maine.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Siamese", "Double", new String[]{"Bronze"}, "Medium", "Medium", "Excellent", "Male", "Y", new String[]{"Possessive", "Intelligent", "Introverted"}, 4, 30);
        pet.setName("John");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/persian.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("persian.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Cat", "n", "Turkish Angora", "Silky", new String[]{"White"}, "Short", "Small", "Excellent", "Female", "Y", new String[]{"Aloof", "Dependent", "Loyal", "Curious"}, 3, 50);
        pet.setName("Servine");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Angora.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Angora.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        // Afghan Hound
        pet = generatePet(adoptionCenters, "Dog", "Afghan Hound", "n", "Silky", new String[]{"Black", "Brown", "Grey"}, "Long", "Extra Large", "Excellent", "Female", "Y", new String[]{"Passive", "Intelligent", "Chill"}, 4, 80);
        pet.setName("Robert");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/afghan.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("afghan.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

// Alaskan Malamute
        pet = generatePet(adoptionCenters, "Dog", "Alaskan Malamute", "n", "Rough", new String[]{"Black", "White"}, "Medium", "Large", "Excellent", "Female", "Y", new String[]{"Affectionate", "Friendly", "Energetic"}, 9, 52);
        pet.setName("Vic");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/alaskan.jpg");
        image = new Image();
        image.setType("image/jpg");
        image.setName("alaskan.jpg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

// Akita
        pet = generatePet(adoptionCenters, "Dog", "Akita", "n", "Rough", new String[]{"Black", "Brown", "White"}, "Short", "Small", "Good", "Male", "Y", new String[]{"Impulsive", "Easily Trained", "Curious", "Anxious"}, 4, 24);
        pet.setName("RandyOrton");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/akita.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("akita.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

// American Foxhound
        pet = generatePet(adoptionCenters, "Dog", "American Foxhound", "n", "Rough", new String[]{"Black", "Brown", "White"}, "Short", "Large", "Excellent", "Male", "Y", new String[]{"Adaptable", "Even Tempered", "Reactive"}, 7, 60);
        pet.setName("MrStealYoGirl");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/foxhound.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("foxhound.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

// American Hairless Terrier
        pet = generatePet(adoptionCenters, "Dog", "American Hairless Terrier", "n", "Hairless", new String[]{"None"}, "Hairless", "Small", "Excellent", "Male", "Y", new String[]{"Aloof", "Calm", "Submissive"}, 3, 22);
        pet.setName("Quagmire");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/hairless.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("hairless.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

// American Bulldog
        pet = generatePet(adoptionCenters, "Dog", "American Bulldog", "n", "Rough", new String[]{"White"}, "Short", "Large", "Good", "Male", "Y", new String[]{"Reactive", "Friendly", "Affectionate"}, 4, 49);
        pet.setName("George");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/AmericanBulldog.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("AmericanBulldog.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

// American Water Spaniel
        pet = generatePet(adoptionCenters, "Dog", "American Water Spaniel", "n", "Double", new String[]{"Brown"}, "Long", "Large", "Good", "Female", "Y", new String[]{"Calm", "Curious", "Anxious"}, 6, 65);
        pet.setName("Lex");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/water.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("water.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

// Australian Kelpie
        pet = generatePet(adoptionCenters, "Dog", "Australian Kelpie", "n", "Rough", new String[]{"Brown"}, "Medium", "Large", "Excellent", "Female", "Y", new String[]{"Agile", "Friendly", "Intelligent"}, 7, 70);
        pet.setName("Tyler");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Kelpie.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Kelpie.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

// Australian Cattle Dog
        pet = generatePet(adoptionCenters, "Dog", "Australian Cattle Dog", "n", "Rough", new String[]{"Grey", "Brown"}, "Medium", "Large", "Excellent", "Male", "Y", new String[]{"Possessive", "Reactive", "Demanding"}, 9, 68);
        pet.setName("Terrence");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Cattle.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Cattle.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

// Basset Hound
        pet = generatePet(adoptionCenters, "Dog", "Basset Hound", "n", "Smooth", new String[]{"Black", "Brown"}, "Short", "Medium", "Excellent", "Female", "Y", new String[]{"Passive", "Even Tempered", "Easily Trained"}, 6, 29);
        pet.setName("Darrel");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/basset.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("basset.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Cat", "n", "Norwegian Forest Cat", "Rough", new String[]{"Black", "White"}, "Medium", "Medium", "Good", "Male", "Y", new String[]{"Reactive", "Bold", "Passive"}, 4, 35);
        pet.setName("Lux");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/forest.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("forest.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Scottish Fold", "Smooth", new String[]{"Bronze"}, "Short", "Small", "Excellent", "Male", "Y", new String[]{"Anxious", "Bold", "Demanding", "Reactive"}, 5, 20);
        pet.setName("Lucifer");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/fold.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("fold.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Sphynx", "Hairless", new String[]{"None"}, "Hairless", "Small", "Good", "Female", "Y", new String[]{"Anxious", "Demanding", "Bold"}, 6, 16);
        pet.setName("Dory");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/sphynx.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("sphynx.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Singapura", "Smooth", new String[]{"White", "Brown"}, "Medium", "Medium", "Good", "Male", "Y", new String[]{"Affectionate", "Calm", "Introverted"}, 7, 29);
        pet.setName("Serb");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/siberia.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("siberia.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Russian Blue", "Smooth", new String[]{"Blue"}, "Short", "Small", "Excellent", "Female", "Y", new String[]{"Athletic", "Curious", "Dependent"}, 4, 18);
        pet.setName("Blue");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/BLue.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("BLue.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "British Shorthair", "Smooth", new String[]{"Black", "White"}, "Medium", "Medium", "Excellent", "Female", "Y", new String[]{"Bold", "Demanding", "Even Tempered"}, 4, 27);
        pet.setName("Tham");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/british.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("british.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Bombay", "Smooth", new String[]{"Black"}, "Short", "Small", "Fair", "Male", "Y", new String[]{"Aggressive", "Sociable", "Easy Going"}, 3, 24);
        pet.setName("TheBomb");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/bombay.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("bombay.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Bengal", "Wiry", new String[]{"Bronze", "Brown"}, "Short", "Small", "Excellent", "Female", "Y", new String[]{"Passive", "Sociable", "Possessive"}, 2, 23);
        pet.setName("Alex");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/bengal.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("bengal.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Chausie", "Rough", new String[]{"Bronze"}, "Medium", "Large", "Excellent", "Male", "Y", new String[]{"Possessive", "Bold", "Calm"}, 4, 45);
        pet.setName("Antonio");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Chausie.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Chausie.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Egyptian Mau", "Silky", new String[]{"Black", "White"}, "Short", "Small", "Excellent", "Female", "Y", new String[]{"Submissive", "Anxious", "Dependent"}, 3, 26);
        pet.setName("SkylerWhiteYo");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/egypt.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("egypt.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        // Assuming you have an appropriate method to handle these creations in your Java code
        // Adoption centers for each pet

        // Creating pet profiles
        pet = generatePet(adoptionCenters, "Dog", "Bearded Collie", "n", "Silky", new String[]{"Grey", "White"}, "Long", "Medium", "Excellent", "Male", "Y", new String[]{"Active", "Playful", "Friendly"}, 6, 50);
        pet.setName("Dexter");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Collie.jpg");
        image = new Image();
        image.setType("image/jpg");
        image.setName("Collie.jpg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Basenji", "n", "Rough", new String[]{"Bronze", "White"}, "Short", "Large", "Excellent", "Male", "Y", new String[]{"Reactive", "Athletic", "Bold"}, 4, 62);
        pet.setName("Steph");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/basenji.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("basenji.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Australian Shepherd", "n", "Double", new String[]{"Black", "Brown", "Grey", "White"}, "Long", "Large", "Fair", "Female", "Y", new String[]{"Friendly", "Playful", "Dependent"}, 5, 65);
        pet.setName("Po");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/aush.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("aush.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Bedlington Terrier", "n", "Wavy", new String[]{"Grey"}, "Short", "Large", "Excellent", "Male", "Y", new String[]{"Reactive", "Friendly", "Calm"}, 7, 72);
        pet.setName("Ellington");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/bedlington.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("bedlington.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Belgian Tervuren", "n", "Smooth", new String[]{"Dark", "Brown"}, "Long", "Extra Large", "Excellent", "Male", "Y", new String[]{"Calm", "Playful", "Even Tempered"}, 7, 85);
        pet.setName("Beluga");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Beluga.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Beluga.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Bichon Frise", "n", "Wavy", new String[]{"White"}, "Medium", "Small", "Excellent", "Female", "Y", new String[]{"Passive", "Intelligent", "Independent"}, 4, 23);
        pet.setName("Tea");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/bichon.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("bichon.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Bloodhound", "n", "Rough", new String[]{"Black", "Brown"}, "Medium", "Extra Large", "Excellent", "Male", "Y", new String[]{"Aggressive", "Reactive", "Playful"}, 7, 90);
        pet.setName("AndrewTate");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/bloodhound.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("bloodhound.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Bluetick Coonhound", "n", "Rough", new String[]{"Black", "Grey"}, "Short", "Large", "Excellent", "Female", "Y", new String[]{"Athletic", "Reactive", "Demanding"}, 2, 49);
        pet.setName("Harry");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/bluetick.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("bluetick.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Bernese Mountain Dog", "n", "Double", new String[]{"Black", "Bronze"}, "Medium", "Extra Large", "Excellent", "Female", "Y", new String[]{"Friendly", "Reactive", "Kid Friendly", "Intelligent", "Energetic"}, 5, 91);
        pet.setName("SlimShady");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Mountain.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Mountain.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Beauceron", "n", "Rough", new String[]{"Black", "Bronze"}, "Short", "Large", "Excellent", "Female", "Y", new String[]{"Reactive", "Aggressive", "Playful"}, 6, 70);
        pet.setName("Usman");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/beauceron.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("beauceron.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Cat", "n", "Korat", "Smooth", new String[]{"Grey"}, "Short", "Medium", "Good", "Female", "Y", new String[]{"Anxious", "Curious", "Placid"}, 8, 25);
        pet.setName("Kora");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Korat.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Korat.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Himalayan", "Double", new String[]{"White", "Bronze"}, "Medium", "Medium", "Excellent", "Male", "Y", new String[]{"Aloof", "Dependent", "Chill"}, 4, 35);
        pet.setName("Bot");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/him.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("him.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Havana Brown", "Rough", new String[]{"Brown"}, "Short", "Small", "Excellent", "Female", "Y", new String[]{"Aloof", "Dependent", "Timid"}, 6, 23);
        pet.setName("Wormwood");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/havana.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("havana.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Domestic Longhair", "Smooth", new String[]{"Black", "Bronze"}, "Long", "Medium", "Good", "Female", "Y", new String[]{"Calm", "Aggressive", "Excitable"}, 7, 29);
        pet.setName("Dominic");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/DomesticLongHairCat.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("DomesticLongHairCat.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Manx", "Rough", new String[]{"Black", "Bronze"}, "Medium", "Medium", "Excellent", "Male", "Y", new String[]{"Playful", "Possessive"}, 4, 30);
        pet.setName("Michael");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/manx.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("manx.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Ocicat", "Rough", new String[]{"Black", "Bronze"}, "Short", "Small", "Excellent", "Male", "Y", new String[]{"Reactive", "Intelligent", "Kid Friendly"}, 3, 24);
        pet.setName("Max");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/ocicat.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("ocicat.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Pixie Bob", "Rough", new String[]{"Bronze"}, "Short", "Medium", "Fair", "Female", "Y", new String[]{"Curious", "Impulsive", "Focused"}, 3, 27);
        pet.setName("Gandalf");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/pixiebob.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("pixiebob.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "RagaMuffin", "Double", new String[]{"Grey", "Black"}, "Long", "Medium", "Excellent", "Female", "Y", new String[]{"Aggressive", "Reactive", "Demanding"}, 6, 25);
        pet.setName("Girl");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/ragamuffin.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("ragamuffin.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Snowshoe", "Rough", new String[]{"Black", "White", "Grey"}, "Short", "Small", "Excellent", "Male", "Y", new String[]{"Bold", "Focused", "Vocal"}, 4, 23);
        pet.setName("Snape");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/snowshoe.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("snowshoe.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Singapura", "Rough", new String[]{"White"}, "Short", "Small", "Excellent", "Female", "Y", new String[]{"Dependent", "Reactive", "Easy Going", "Introverted"}, 3, 12);
        pet.setName("KittyCat");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/singapura.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("singapura.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);


        pet = generatePet(adoptionCenters, "Dog", "Boerboel", "n", "Silky", new String[]{"Bronze"}, "Short", "Extra Large", "Excellent", "Male", "Y", new String[]{"Calm", "Sociable", "Bold"}, 8, 80);
        pet.setName("GeorgeFloyd");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Boerboel.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Boerboel.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Borzoi", "n", "Double", new String[]{"Bronze", "White"}, "Medium", "Extra Large", "Excellent", "Female", "Y", new String[]{"Affectionate", "Kid Friendly", "Possessive", "Excitable"}, 6, 102);
        pet.setName("TRAVIS");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/borzoi.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("borzoi.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Boykin Spaniel", "n", "Silky", new String[]{"Brown"}, "Medium", "Medium", "Good", "Female", "Y", new String[]{"Even Tempered", "Focused", "Insistent"}, 4, 34);
        pet.setName("BIGBOY");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/boykin-spaniel.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("boykin-spaniel.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Briard", "n", "Silky", new String[]{"Grey"}, "Long", "Large", "Excellent", "Male", "Y", new String[]{"Playful", "Kid Friendly", "Chill"}, 10, 62);
        pet.setName("Griffin");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/briard.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("briard.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Brittany Spaniel", "n", "Rough", new String[]{"Brown", "White"}, "Medium", "Medium", "Excellent", "Female", "Y", new String[]{"Curious", "Loyal", "Bold"}, 5, 56);
        pet.setName("Optimus");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/brittany.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("brittany.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Carolina Dog", "n", "Rough", new String[]{"Bronze", "Light"}, "Short", "Large", "Good", "Female", "Y", new String[]{"Reactive", "Energetic", "Easily Trained"}, 4, 64);
        pet.setName("Austin");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Carolina.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Carolina.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Caucasian Shepherd Dog", "n", "Curly", new String[]{"Black", "Bronze"}, "Medium", "Large", "Excellent", "Male", "Y", new String[]{"Affectionate", "Bold", "Friendly", "Reactive"}, 6, 75);
        pet.setName("Whitaker");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Caucasian.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Caucasian.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Cavalier King Charles Spaniel", "n", "Silky", new String[]{"Brown", "White"}, "Long", "Small", "Excellent", "Female", "Y", new String[]{"Bossy", "Demanding", "Lively"}, 7, 30);
        pet.setName("Diana");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/cavalier.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("cavalier.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Chihuahua", "n", "Rough", new String[]{"Brown", "White"}, "Short", "Small", "Excellent", "Male", "Y", new String[]{"Friendly", "Aggressive", "Easily Trained", "Loyal"}, 9, 29);
        pet.setName("Sneako");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/chihuahua.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("chihuahua.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Dog", "Canaan Dog", "n", "Smooth", new String[]{"Bronze", "White"}, "Medium", "Medium", "Excellent", "Male", "Y", new String[]{"Friendly", "Reactive", "Kid Friendly", "Cuddly"}, 5, 49);
        pet.setName("DAX");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/canaan.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("canaan.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);




        pet = generatePet(adoptionCenters, "Cat", "n", "Selkirk Rex", "Wavy", new String[]{"Grey", "White"}, "Medium", "Medium", "Good", "Male", "Y", new String[]{"Bold", "Dependent", "Docile"}, 3, 28);
        pet.setName("Bob");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Selkirk.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Selkirk.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Tonkinese", "Smooth", new String[]{"Brown"}, "Medium", "Medium", "Excellent", "Female", "Y", new String[]{"Anxious", "Friendly", "Loyal"}, 5, 26);
        pet.setName("Olive");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/tonkinese.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("tonkinese.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Turkish Van", "Smooth", new String[]{"Brown", "White"}, "Medium", "Medium", "Fair", "Female", "Y", new String[]{"Calm", "Loyal", "Playful"}, 3, 26);
        pet.setName("Cindy");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/turkish.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("turkish.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Somali", "Smooth", new String[]{"Bronze"}, "Medium", "Medium", "Good", "Male", "Y", new String[]{"Anxious", "Vocal", "Impulsive"}, 7, 29);
        pet.setName("Yamcha");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/somali.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("somali.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Toyger", "Rough", new String[]{"Black", "Bronze"}, "Short", "Small", "Excellent", "Male", "Y", new String[]{"Dependent", "Timid", "Placid"}, 4, 23);
        pet.setName("Sam");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Toyger.jpg");
        image = new Image();
        image.setType("image/jpg");
        image.setName("Toyger.jpg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Tuxedo", "Rough", new String[]{"Black", "White"}, "Medium", "Medium", "Excellent", "Male", "Y", new String[]{"Sociable", "Intelligent", "Even Tempered"}, 3, 27);
        pet.setName("Tuc");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Tux.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Tux.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Lykoi", "Rough", new String[]{"Grey"}, "Medium", "Small", "Fair", "Male", "Y", new String[]{"Aggressive", "Dependent", "Reactive", "Active"}, 3, 23);
        pet.setName("Ember");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/lykoi.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("lykoi.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "European Burmese", "Wiry", new String[]{"Bronze"}, "Short", "Medium", "Excellent", "Female", "Y", new String[]{"Curious", "Friendly", "Bold"}, 9, 30);
        pet.setName("Oscar");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Burmese.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Burmese.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Nebelung", "Smooth", new String[]{"Grey"}, "Long", "Small", "Excellent", "Male", "Y", new String[]{"Calm", "Bold", "Focused", "Affectionate"}, 6, 15);
        pet.setName("Timothy");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/NEBELUNG.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("NEBELUNG.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        pet = generatePet(adoptionCenters, "Cat", "n", "Oriental", "Rough", new String[]{"Brown", "White"}, "Short", "Small", "Excellent", "Female", "Y", new String[]{"Submissive", "Intelligent", "Introverted", "Demanding"}, 3, 18);
        pet.setName("Airy");
        imageFile = new File("/home/willclore/actions-runner/_work/pet-adoption-f24-team-4/pet-adoption-f24-team-4/pet-adoption-api/PetImages/Oriental.jpg");
        image = new Image();
        image.setType("image/jpg");
        image.setName("Oriental.jpg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));
        pet.setProfilePicture(image);
        pets.add(pet);

        /*




        //CATS


        repository.saveAll(samplePets);
         */


        return pets;
    }



}
