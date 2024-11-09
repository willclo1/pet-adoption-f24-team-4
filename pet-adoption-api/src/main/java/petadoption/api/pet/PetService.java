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
//
//    public Pet generatePet(String name, Species species, int weight,
//                           CoatLength coatLength, FurType furType, FurColor furColor,
//                           AdoptionCenter adoptionCenter,Set<DogBreed> dogBreeds,
//                           Set<CatBreed> catBreeds, Size size,int age,
//                           Set<Temperament> temperaments, Health health) throws IOException {
//
//        Pet pet = new Pet(name,species,weight,coatLength,furType,furColor,adoptionCenter,dogBreeds,catBreeds,size,age,temperaments,health);
//        return pet;
//    }
//    public void addSamplePets(AdoptionCenterService adoptionCenterService) throws IOException {
//
//        List<Pet> samplePets = new ArrayList<>();
//        Optional<AdoptionCenter> adoptionCenter = adoptionCenterService.getCenter((long)(1));
//
//        Set<DogBreed> dogBreeds = new HashSet<>();
//        dogBreeds.add(DogBreed.GREYHOUND);
//        Set<CatBreed> catBreeds = new HashSet<>();
//        Set<Temperament> temperaments = new HashSet<>();
//        temperaments.add(Temperament.ACTIVE);
//
//
//        File imageFile = new File("PetImages/GreyHound.jpg");
//        Image image = new Image();
//        image.setType("image/jpeg");
//        image.setName("GreyHound.jpg");
//
//        image.setImageData(Files.readAllBytes(imageFile.toPath()));
//
//
//        Pet pet = new Pet("wilson",Species.DOG,50,CoatLength.MEDIUM, FurType.SMOOTH, FurColor.BLACK, adoptionCenter.get(), dogBreeds, catBreeds, Size.LARGE,4,temperaments, Health.GOOD);
//        pet.setProfilePicture(image);
//        samplePets.add(pet);
//
//
//        adoptionCenter = adoptionCenterService.getCenter((long)(1));
//
//        dogBreeds = new HashSet<>();
//        dogBreeds.add(DogBreed.GERMAN_SHEPHERD_DOG);
//        catBreeds = new HashSet<>();
//        temperaments = new HashSet<>();
//        temperaments.add(Temperament.ACTIVE);
//
//        imageFile = new File("PetImages/german-shepherd-dog.jpeg");
//        image = new Image();
//        image.setType("image/jpeg");
//        image.setName("german-shepherd-dog.jpg");
//        image.setImageData(Files.readAllBytes(imageFile.toPath()));
//
//        pet = generatePet("Axel",Species.DOG,52,CoatLength.MEDIUM,
//                                    FurType.SMOOTH, FurColor.BROWN, adoptionCenter.get(),
//                                    dogBreeds, catBreeds, Size.LARGE,4,temperaments,
//                                    Health.EXCELLENT);
//        pet.setProfilePicture(image);
//        samplePets.add(pet);
//
//        samplePets.add(pet);
//
//        repository.saveAll(samplePets);
//    }

}
