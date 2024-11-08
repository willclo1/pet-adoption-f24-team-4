package petadoption.api.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterRepository;
import petadoption.api.adoptionCenter.AdoptionCenterService;
import petadoption.api.pet.criteria.*;
import petadoption.api.pet.criteria.breed.AnimalBreed;
import petadoption.api.pet.criteria.breed.CatBreed;
import petadoption.api.pet.criteria.breed.DogBreed;
import petadoption.api.Utility.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

@Service
public class PetService {
    @Autowired
    PetRepository repository;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    public Optional<Pet> savePet(Long petID){
        return repository.findById(petID);
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
    public List<Pet> getAdoptionCenterPets(long adoptionID) {
        return repository.findByCenter_adoptionID(adoptionID);
    }


    public void deletePet(long petID){
        repository.deleteById(petID);
    }

    public Pet generatePet(String name, Species species, int weight,
                           CoatLength coatLength, FurType furType, FurColor furColor,
                           AdoptionCenter adoptionCenter,Set<DogBreed> dogBreeds,
                           Set<CatBreed> catBreeds, Size size,int age,
                           Set<Temperament> temperaments, Health health) throws IOException {

        Pet pet = new Pet(name,species,weight,coatLength,furType,furColor,adoptionCenter,dogBreeds,catBreeds,size,age,temperaments,health);
        return pet;
    }
    public void addSamplePets(AdoptionCenterService adoptionCenterService) throws IOException {

        List<Pet> samplePets = new ArrayList<>();

        //DOGS
        Optional<AdoptionCenter> adoptionCenter = adoptionCenterService.getCenter((long)(1));

        Set<DogBreed> dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.GREYHOUND);
        Set<CatBreed> catBreeds = new HashSet<>();
        Set<Temperament> temperaments = new HashSet<>();
        temperaments.add(Temperament.ACTIVE);


        File imageFile = new File("PetImages/GreyHound.jpg");
        Image image = new Image();
        image.setType("image/jpeg");
        image.setName("GreyHound.jpg");

        image.setImageData(Files.readAllBytes(imageFile.toPath()));


        Pet pet = new Pet("wilson",Species.DOG,50,CoatLength.MEDIUM, FurType.SMOOTH, FurColor.BLACK, adoptionCenter.get(), dogBreeds, catBreeds, Size.LARGE,4,temperaments, Health.GOOD);
        pet.setProfilePicture(image);
        samplePets.add(pet);


        adoptionCenter = adoptionCenterService.getCenter((long)(2));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.GERMAN_SHEPHERD_DOG);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.ACTIVE);

        imageFile = new File("PetImages/german-shepherd-dog.jpeg");
        image = new Image();
        image.setType("image/jpeg");
        image.setName("german-shepherd-dog.jpg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Axel",Species.DOG,52,CoatLength.MEDIUM,
                FurType.SMOOTH, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.LARGE,4,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);





        adoptionCenter = adoptionCenterService.getCenter((long)(3));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.CESKY_TERRIER);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGGRESSIVE);

        imageFile = new File("PetImages/CESKYTERRIER.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("CESKYTERRIER.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("jake",Species.DOG,20,CoatLength.MEDIUM,
                FurType.DOUBLE, FurColor.WHITE, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.SMALL,4,temperaments,
                Health.GOOD);
        pet.setProfilePicture(image);
        samplePets.add(pet);


        adoptionCenter = adoptionCenterService.getCenter((long)(4));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.GIANT_SCHNAUZER);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.ADAPTABLE);

        imageFile = new File("PetImages/GIANTSCHNAUZER.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("GIANTSCHNAUZER.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("jake",Species.DOG,80,CoatLength.LONG,
                FurType.SMOOTH, FurColor.BLACK, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.EXTRA_LARGE,7,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);


        adoptionCenter = adoptionCenterService.getCenter((long)(5));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.DOBERMAN_PINSCHER);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGGRESSIVE);

        imageFile = new File("PetImages/Doberman.jpeg");
        image = new Image();
        image.setType("image/jpeg");
        image.setName("Doberman.jpeg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Jackson",Species.DOG,45,CoatLength.SHORT,
                FurType.SILKY, FurColor.BLACK, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.LARGE,6,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);



        adoptionCenter = adoptionCenterService.getCenter((long)(6));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.POODLE);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.PASSIVE);

        imageFile = new File("PetImages/poodle.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("poodle.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("rolex",Species.DOG,20,CoatLength.MEDIUM,
                FurType.ROUGH, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.SMALL,4,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);




        adoptionCenter = adoptionCenterService.getCenter((long)(7));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.BOXER);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGGRESSIVE);

        imageFile = new File("PetImages/Boxer.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Boxer.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Waller",Species.DOG,55,CoatLength.SHORT,
                FurType.SMOOTH, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.LARGE,7,temperaments,
                Health.GOOD);
        pet.setProfilePicture(image);
        samplePets.add(pet);




        adoptionCenter = adoptionCenterService.getCenter((long)(8));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.CATAHOULA_LEOPARD_DOG);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGILE);

        imageFile = new File("PetImages/CATAHOULALEOPARDDOG.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("CATAHOULALEOPARDDOG.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Bart",Species.DOG,20,CoatLength.SHORT,
                FurType.SILKY, FurColor.BLACK, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.LARGE,2,temperaments,
                Health.GOOD);
        pet.setProfilePicture(image);
        samplePets.add(pet);





        adoptionCenter = adoptionCenterService.getCenter((long)(9));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.GOLDEN_RETRIEVER);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.ACTIVE);

        imageFile = new File("PetImages/GoldenRetreiver.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("GoldenRetreiver.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Monke",Species.DOG,70,CoatLength.LONG,
                FurType.DOUBLE, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.LARGE,5,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);





        adoptionCenter = adoptionCenterService.getCenter((long)(10));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.TOSA);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGGRESSIVE);

        imageFile = new File("PetImages/tosa.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("tosa.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Cola",Species.DOG,50,CoatLength.MEDIUM,
                FurType.SMOOTH, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.LARGE,6,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);


        //CATS
        adoptionCenter = adoptionCenterService.getCenter((long)(1));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.SIAMESE);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.ACTIVE);


        imageFile = new File("PetImages/Siamese.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Siamese.webp");

        image.setImageData(Files.readAllBytes(imageFile.toPath()));


        pet = new Pet("WilburForce",Species.CAT,25,CoatLength.SHORT,
                FurType.SILKY, FurColor.WHITE, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.SMALL,8,temperaments,
                Health.GOOD);
        pet.setProfilePicture(image);
        samplePets.add(pet);


        adoptionCenter = adoptionCenterService.getCenter((long)(2));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.DOMESTIC_SHORTHAIR);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.ACTIVE);

        imageFile = new File("PetImages/cat1.jpg");
        image = new Image();
        image.setType("image/jpeg");
        image.setName("cat1.jpg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Jerome",Species.CAT,52,CoatLength.SHORT,
                FurType.ROUGH, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.MEDIUM,4,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);





        adoptionCenter = adoptionCenterService.getCenter((long)(3));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.DOMESTIC_SHORTHAIR);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGGRESSIVE);

        imageFile = new File("PetImages/cat2.jpg");
        image = new Image();
        image.setType("image/jpg");
        image.setName("cat2.jpg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("jake",Species.CAT,18,CoatLength.SHORT,
                FurType.ROUGH, FurColor.GRAY, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.MEDIUM,6,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);


        adoptionCenter = adoptionCenterService.getCenter((long)(4));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.DOMESTIC_SHORTHAIR);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AFFECTIONATE);

        imageFile = new File("PetImages/cat3.jpeg");
        image = new Image();
        image.setType("image/jpeg");
        image.setName("cat3.jpeg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("jake",Species.CAT,23,CoatLength.SHORT,
                FurType.SMOOTH, FurColor.BLACK, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.SMALL,7,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);


        adoptionCenter = adoptionCenterService.getCenter((long)(5));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.AMERICAN_BOBTAIL);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGGRESSIVE);

        imageFile = new File("PetImages/Bobtail.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Bobtail.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("stewie",Species.CAT,34,CoatLength.SHORT,
                FurType.SMOOTH, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.MEDIUM,4,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);



        adoptionCenter = adoptionCenterService.getCenter((long)(6));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.AMERICAN_CURL);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.PASSIVE);

        imageFile = new File("PetImages/curl.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("curl.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("SETH",Species.CAT,27,CoatLength.MEDIUM,
                FurType.SMOOTH, FurColor.WHITE, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.MEDIUM,4,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);




        adoptionCenter = adoptionCenterService.getCenter((long)(7));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.DEVON_REX);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGGRESSIVE);

        imageFile = new File("PetImages/REX.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("REX.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Wizard",Species.CAT,15,CoatLength.SHORT,
                FurType.SMOOTH, FurColor.WHITE, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.SMALL,3,temperaments,
                Health.FAIR);
        pet.setProfilePicture(image);
        samplePets.add(pet);




        adoptionCenter = adoptionCenterService.getCenter((long)(8));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.MAINE_COON);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGILE);

        imageFile = new File("PetImages/maine.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("maine.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("UltimateDestroyerOfWorlds",Species.CAT,35,CoatLength.LONG,
                FurType.DOUBLE, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.LARGE,2,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);





        adoptionCenter = adoptionCenterService.getCenter((long)(9));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.SIAMESE);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.POSSESSIVE);

        imageFile = new File("PetImages/persian.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("persian.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("John",Species.CAT,30,CoatLength.MEDIUM,
                FurType.DOUBLE, FurColor.WHITE, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.MEDIUM,4,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);





        adoptionCenter = adoptionCenterService.getCenter((long)(10));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.TURKISH_ANGORA);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.ALOOF);

        imageFile = new File("PetImages/Angora.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Angora.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Servine",Species.CAT,50,CoatLength.SHORT,
                FurType.SILKY, FurColor.WHITE, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.SMALL,3,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);




        //DOGS
        adoptionCenter = adoptionCenterService.getCenter((long)(1));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.AFGHAN_HOUND);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.PASSIVE);


        imageFile = new File("PetImages/afghan.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("afghan.webp");

        image.setImageData(Files.readAllBytes(imageFile.toPath()));


        pet = new Pet("Robert",Species.DOG,80,CoatLength.LONG,
                                FurType.SILKY, FurColor.BROWN, adoptionCenter.get(),
                                dogBreeds, catBreeds, Size.EXTRA_LARGE,4,temperaments,
                                Health.EXCELLENT);

        pet.setProfilePicture(image);
        samplePets.add(pet);


        adoptionCenter = adoptionCenterService.getCenter((long)(2));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.ALASKAN_MALAMUTE);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AFFECTIONATE);

        imageFile = new File("PetImages/alaskan.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("alaskan.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Vic",Species.DOG,52,CoatLength.MEDIUM,
                FurType.ROUGH, FurColor.GRAY, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.LARGE,9,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);





        adoptionCenter = adoptionCenterService.getCenter((long)(3));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.AKITA);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.IMPULSIVE);

        imageFile = new File("PetImages/akita.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("akita.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("RandyOrton",Species.DOG,24,CoatLength.SHORT,
                FurType.ROUGH, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.SMALL,4,temperaments,
                Health.GOOD);
        pet.setProfilePicture(image);
        samplePets.add(pet);


        adoptionCenter = adoptionCenterService.getCenter((long)(4));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.AMERICAN_FOXHOUND);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.ADAPTABLE);

        imageFile = new File("PetImages/foxhound.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("foxhound.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("MrStealYoGirl",Species.DOG,60,CoatLength.SHORT,
                FurType.ROUGH, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.LARGE,7,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);


        adoptionCenter = adoptionCenterService.getCenter((long)(5));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.AMERICAN_HAIRLESS_TERRIER);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.ALOOF);

        imageFile = new File("PetImages/hairless.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("hairless.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Quagmire",Species.DOG,22,CoatLength.HAIRLESS,
                FurType.HAIRLESS, FurColor.MIXED_COLOR, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.SMALL,3,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);



        adoptionCenter = adoptionCenterService.getCenter((long)(6));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.POODLE);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.PASSIVE);

        imageFile = new File("PetImages/poodle.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("poodle.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("rolex",Species.DOG,20,CoatLength.MEDIUM,
                FurType.ROUGH, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.SMALL,4,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);




        adoptionCenter = adoptionCenterService.getCenter((long)(7));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.BOXER);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGGRESSIVE);

        imageFile = new File("PetImages/Boxer.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Boxer.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Waller",Species.DOG,55,CoatLength.SHORT,
                FurType.SMOOTH, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.LARGE,7,temperaments,
                Health.GOOD);
        pet.setProfilePicture(image);
        samplePets.add(pet);




        adoptionCenter = adoptionCenterService.getCenter((long)(8));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.CATAHOULA_LEOPARD_DOG);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGILE);

        imageFile = new File("PetImages/CATAHOULALEOPARDDOG.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("CATAHOULALEOPARDDOG.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Bart",Species.DOG,20,CoatLength.SHORT,
                FurType.SILKY, FurColor.BLACK, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.LARGE,2,temperaments,
                Health.GOOD);
        pet.setProfilePicture(image);
        samplePets.add(pet);





        adoptionCenter = adoptionCenterService.getCenter((long)(9));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.GOLDEN_RETRIEVER);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.ACTIVE);

        imageFile = new File("PetImages/GoldenRetreiver.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("GoldenRetreiver.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Monke",Species.DOG,70,CoatLength.LONG,
                FurType.DOUBLE, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.LARGE,5,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);





        adoptionCenter = adoptionCenterService.getCenter((long)(10));

        dogBreeds = new HashSet<>();
        dogBreeds.add(DogBreed.TOSA);
        catBreeds = new HashSet<>();
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGGRESSIVE);

        imageFile = new File("PetImages/tosa.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("tosa.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Cola",Species.DOG,50,CoatLength.MEDIUM,
                FurType.SMOOTH, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.LARGE,6,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);


        //CATS
        adoptionCenter = adoptionCenterService.getCenter((long)(1));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.SIAMESE);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.ACTIVE);


        imageFile = new File("PetImages/Siamese.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Siamese.webp");

        image.setImageData(Files.readAllBytes(imageFile.toPath()));


        pet = new Pet("WilburForce",Species.CAT,25,CoatLength.SHORT,
                FurType.SILKY, FurColor.WHITE, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.SMALL,8,temperaments,
                Health.GOOD);
        pet.setProfilePicture(image);
        samplePets.add(pet);


        adoptionCenter = adoptionCenterService.getCenter((long)(2));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.DOMESTIC_SHORTHAIR);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.ACTIVE);

        imageFile = new File("PetImages/cat1.jpg");
        image = new Image();
        image.setType("image/jpeg");
        image.setName("cat1.jpg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Jerome",Species.CAT,52,CoatLength.SHORT,
                FurType.ROUGH, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.MEDIUM,4,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);





        adoptionCenter = adoptionCenterService.getCenter((long)(3));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.DOMESTIC_SHORTHAIR);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGGRESSIVE);

        imageFile = new File("PetImages/cat2.jpg");
        image = new Image();
        image.setType("image/jpg");
        image.setName("cat2.jpg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("jake",Species.CAT,18,CoatLength.SHORT,
                FurType.ROUGH, FurColor.GRAY, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.MEDIUM,6,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);


        adoptionCenter = adoptionCenterService.getCenter((long)(4));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.DOMESTIC_SHORTHAIR);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AFFECTIONATE);

        imageFile = new File("PetImages/cat3.jpeg");
        image = new Image();
        image.setType("image/jpeg");
        image.setName("cat3.jpeg");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("jake",Species.CAT,23,CoatLength.SHORT,
                FurType.SMOOTH, FurColor.BLACK, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.SMALL,7,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);


        adoptionCenter = adoptionCenterService.getCenter((long)(5));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.AMERICAN_BOBTAIL);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGGRESSIVE);

        imageFile = new File("PetImages/Bobtail.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Bobtail.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("stewie",Species.CAT,34,CoatLength.SHORT,
                FurType.SMOOTH, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.MEDIUM,4,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);



        adoptionCenter = adoptionCenterService.getCenter((long)(6));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.AMERICAN_CURL);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.PASSIVE);

        imageFile = new File("PetImages/curl.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("curl.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("SETH",Species.CAT,27,CoatLength.MEDIUM,
                FurType.SMOOTH, FurColor.WHITE, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.MEDIUM,4,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);




        adoptionCenter = adoptionCenterService.getCenter((long)(7));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.DEVON_REX);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGGRESSIVE);

        imageFile = new File("PetImages/REX.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("REX.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Wizard",Species.CAT,15,CoatLength.SHORT,
                FurType.SMOOTH, FurColor.WHITE, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.SMALL,3,temperaments,
                Health.FAIR);
        pet.setProfilePicture(image);
        samplePets.add(pet);




        adoptionCenter = adoptionCenterService.getCenter((long)(8));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.MAINE_COON);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.AGILE);

        imageFile = new File("PetImages/maine.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("maine.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("UltimateDestroyerOfWorlds",Species.CAT,35,CoatLength.LONG,
                FurType.DOUBLE, FurColor.BROWN, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.LARGE,2,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);





        adoptionCenter = adoptionCenterService.getCenter((long)(9));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.SIAMESE);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.POSSESSIVE);

        imageFile = new File("PetImages/persian.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("persian.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("John",Species.CAT,30,CoatLength.MEDIUM,
                FurType.DOUBLE, FurColor.WHITE, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.MEDIUM,4,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);





        adoptionCenter = adoptionCenterService.getCenter((long)(10));

        dogBreeds = new HashSet<>();
        catBreeds = new HashSet<>();
        catBreeds.add(CatBreed.TURKISH_ANGORA);
        temperaments = new HashSet<>();
        temperaments.add(Temperament.ALOOF);

        imageFile = new File("PetImages/Angora.webp");
        image = new Image();
        image.setType("image/webp");
        image.setName("Angora.webp");
        image.setImageData(Files.readAllBytes(imageFile.toPath()));

        pet = generatePet("Servine",Species.CAT,50,CoatLength.SHORT,
                FurType.SILKY, FurColor.WHITE, adoptionCenter.get(),
                dogBreeds, catBreeds, Size.SMALL,3,temperaments,
                Health.EXCELLENT);
        pet.setProfilePicture(image);
        samplePets.add(pet);

        repository.saveAll(samplePets);
    }

}
