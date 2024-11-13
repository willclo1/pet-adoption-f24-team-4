package petadoption.api.Utility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterService;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.pet.criteria.*;
import petadoption.api.pet.criteria.breed.CatBreed;
import petadoption.api.pet.criteria.breed.DogBreed;

import java.util.*;

import static petadoption.api.pet.criteria.Species.CAT;
import static petadoption.api.pet.criteria.Species.DOG;

@Component
public class petGenerator {

    private static final int DEFAULT_NUM_PETS = 50;
    private static final String[] NAMES = {
            "Angel", "Popeye", "Squishy", "Abigail", "Red", "Fern Lily", "Akiro", "Boots", "Swiper",
            "Dora", "McFluffin", "Iggy", "Waggs", "Samson", "Lucky", "Diamond", "Zeus", "Bella",
            "Casanova", "Sketch", "Allen", "Toot", "Gale", "Sammy", "Marvin", "Waffles", "Robbie",
            "Houdini", "Wayne", "Dumplin", "Knox", "Potato", "Bert", "Porkchop", "Chase", "Barbie",
            "Silver", "Brody", "Raven", "Stephen", "Sprite", "Kate", "Mandarin"
    };

    @Autowired
    private PetService petService;

    @Autowired
    private AdoptionCenterService adoptionCenterService;

    @EventListener(ApplicationReadyEvent.class)
    public void generatePetsOnStartup() {

        List<AdoptionCenter> adoptionCenters = createAndSaveAdoptionCenters();
        if(adoptionCenterService.getAllAdoptionCenters().isEmpty()){
            generateAndSavePets(DEFAULT_NUM_PETS, adoptionCenters);
        }

    }

    private List<AdoptionCenter> createAndSaveAdoptionCenters() {
        List<AdoptionCenter> adoptionCenters = Arrays.asList(
                new AdoptionCenter("Happy Paws Adoption Center", "123 Main St, Houston, TX", "Providing loving homes to pets in need. Open 7 days a week!"),
                new AdoptionCenter("Forever Friends Shelter", "456 Elm St, Austin, TX", "A no-kill shelter with a variety of pets ready for adoption."),
                new AdoptionCenter("Houston Humane Society", "789 Oak St, Houston, TX", "Rescue, care, and adoption of homeless pets. Serving the community for over 50 years."),
                new AdoptionCenter("Pet Haven", "1010 Birch St, Dallas, TX", "Specializing in pet rescues and providing forever homes to abandoned pets."),
                new AdoptionCenter("Furry Friends Foundation", "111 Pine St, San Antonio, TX", "Dedicated to helping pets find loving families and supporting pet owners in need.")
        );

        adoptionCenters.forEach(adoptionCenterService::saveCenter); // Save each center to the database
        return adoptionCenters;
    }

    public void generateAndSavePets(int numPets, List<AdoptionCenter> adoptionCenters) {
        List<Pet> pets = generateRandomPets(numPets, adoptionCenters);
        pets.forEach(petService::savePet);
    }

    private List<Pet> generateRandomPets(int numPets, List<AdoptionCenter> adoptionCenters) {
        Random random = new Random();
        List<Pet> pets = new ArrayList<>();

        for (int i = 0; i < numPets; i++) {
            Pet pet = new Pet();
            pet.setName(NAMES[random.nextInt(NAMES.length)]);
            pet.setAge(random.nextInt(1, 21));
            pet.setSpecies(randomSpecies(random));
            pet.setWeight(generateWeight(pet.getSpecies(), random));
            pet.setCatBreed(generateCatBreeds(pet.getSpecies(), random));
            pet.setDogBreed(generateDogBreeds(pet.getSpecies(), random));
            pet.setFurType(randomEnum(FurType.class, random));
            pet.setCoatLength(pet.getFurType() == FurType.HAIRLESS ? CoatLength.HAIRLESS : randomEnum(CoatLength.class, random));
            pet.setFurColor(generateFurColors(pet.getFurType(), random));
            pet.setHealthStatus(randomEnum(Health.class, random));
            pet.setTemperament(generateTemperaments(random));
            pet.setPetSize(randomEnum(Size.class, random));
            pet.setSex(randomEnum(Sex.class, random));
            pet.setSpayedNeutered(randomEnum(SpayedNeutered.class, random));

            // Randomly assign an adoption center to the pet
            if (adoptionCenters != null && !adoptionCenters.isEmpty()) {
                pet.setCenter(adoptionCenters.get(random.nextInt(adoptionCenters.size())));
            }
            pets.add(pet);
        }
        return pets;
    }

    private Species randomSpecies(Random random) {
        return random.nextBoolean() ? CAT : DOG;
    }

    private int generateWeight(Species species, Random random) {
        return random.nextInt(1, species == CAT ? 21 : 150);
    }

    private Set<CatBreed> generateCatBreeds(Species species, Random random) {
        Set<CatBreed> breeds = new HashSet<>();
        if (species == CAT) {
            breeds.add(randomEnum(CatBreed.class, random));
            if (random.nextBoolean()) breeds.add(CatBreed.MIX_BREED);
        }
        return breeds;
    }

    private Set<DogBreed> generateDogBreeds(Species species, Random random) {
        Set<DogBreed> breeds = new HashSet<>();
        if (species == DOG) {
            breeds.add(randomEnum(DogBreed.class, random));
            if (random.nextBoolean()) breeds.add(DogBreed.MIX_BREED);
        }
        return breeds;
    }

    private Set<FurColor> generateFurColors(FurType furType, Random random) {
        Set<FurColor> colors = new HashSet<>();
        if (furType != FurType.HAIRLESS) {
            colors.add(randomEnum(FurColor.class, random));
        } else {
            colors.add(FurColor.NONE);
        }
        return colors;
    }

    private Set<Temperament> generateTemperaments(Random random) {
        Set<Temperament> temperaments = new HashSet<>();
        temperaments.add(randomEnum(Temperament.class, random));
        return temperaments;
    }

    private <T extends Enum<?>> T randomEnum(Class<T> enumClass, Random random) {
        T[] enumValues = enumClass.getEnumConstants();
        return enumValues[random.nextInt(enumValues.length)];
    }
}