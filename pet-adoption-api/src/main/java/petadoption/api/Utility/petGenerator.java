package petadoption.api.Utility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.pet.criteria.*;
import petadoption.api.pet.criteria.breed.CatBreed;
import petadoption.api.pet.criteria.breed.DogBreed;

import java.util.*;

import static petadoption.api.pet.criteria.Species.CAT;

/**
 * @author Harrison Hassler
 * @author Rafe Loya
 */
@Component
public class petGenerator {
    public static final int MAX_BREED = 1;
    public static final int MAX_FUR_COLOR = 1;
    public static final int MAX_TEMPERAMENTS = 1;
    public static final String[] NAMES = {
            "Angel",
            "Popeye",
            "Squishy",
            "Abigail",
            "Red",
            "Fern Lily",
            "Akiro",
            "Boots",
            "Swiper",
            "Dora",
            "McFluffin",
            "Iggy",
            "Waggs",
            "Samson",
            "Lucky",
            "Diamond",
            "Zeus",
            "Bella",
            "Casanova",
            "Sketch",
            "Allen",
            "Toot",
            "Gale",
            "Sammy",
            "Marvin",
            "Waffles",
            "Robbie",
            "Houdini",
            "Wayne",
            "Dumplin",
            "Knox",
            "Potato",
            "Bert",
            "Porkchop",
            "Chase",
            "Barbie",
            "Silver",
            "Brody",
            "Raven",
            "Stephen",
            "Sprite",
            "Kate",
            "Mandarin"
    };
    @Autowired
    PetService petService;

    @EventListener(ApplicationReadyEvent.class)
    public void generatePetsOnStartup() {
        int numPets = 20;
        for(Pet p: generateRandomPetsV2(null, numPets)){
            petService.savePet(p);
        }

    }

    public static List<Pet> generateRandomPetsV2(List<AdoptionCenter> adoptionCenters, int numPets) {
        Random random = new Random();
        Species[] speciesValues = Species.values();
        CoatLength[] coatLengthValues = CoatLength.values();
        FurColor[] furColorValues = FurColor.values();
        CatBreed[] catBreeds = CatBreed.values();
        DogBreed[] dogBreeds = DogBreed.values();
        FurType[] furTypeValues = FurType.values();
        Health[] healthValues = Health.values();
        Size[] sizeValues = Size.values();
        Temperament[] temperamentValues = Temperament.values();
        Sex[] sexValues = Sex.values();
        SpayedNeutered[] spayedNeuteredValues = SpayedNeutered.values();
        List<Pet> pets = new ArrayList<Pet>();

        for(int i = 0; i < numPets; i++) {
            Pet p = new Pet();

            p.setName(NAMES[random.nextInt(NAMES.length)]);
            p.setAge(random.nextInt(1, 21));
            p.setSpecies(speciesValues[random.nextInt(speciesValues.length)]);
            p.setWeight(random.nextInt(1, (p.getSpecies() == Species.CAT) ? 21 : 150));
            if (p.getSpecies() == CAT) {
                int numCatBreed = random.nextInt(MAX_BREED);
                Set<CatBreed> cb = new HashSet<>();
                for (int j = 0; j < numCatBreed; j++) {
                    cb.add(catBreeds[random.nextInt(catBreeds.length)]);
                }
                if (random.nextBoolean()) {
                    cb.add(CatBreed.MIX_BREED);
                }
                p.setCatBreed(cb);
            } else {
                int numDogBreed = random.nextInt(MAX_BREED);
                Set<DogBreed> db = new HashSet<>();
                for (int j = 0; j < numDogBreed; j++) {
                    db.add(dogBreeds[random.nextInt(dogBreeds.length)]);
                }
                if (random.nextBoolean()) {
                    db.add(DogBreed.MIX_BREED);
                }
                p.setDogBreed(db);
            }
            p.setFurType(furTypeValues[random.nextInt(furTypeValues.length)]);
            if (p.getFurType() != FurType.HAIRLESS) {
                p.setCoatLength(coatLengthValues[random.nextInt(coatLengthValues.length)]);

                int numFurColors = random.nextInt(MAX_FUR_COLOR);
                Set<FurColor> furColors = new HashSet<>();
                for (int j = 0; j < numFurColors; j++) {
                    furColors.add(furColorValues[random.nextInt(furColorValues.length)]);
                }
                p.setFurColor(furColors);
            } else {
                p.setCoatLength(CoatLength.HAIRLESS);
                Set<FurColor> furColors = new HashSet<>();
                furColors.add(FurColor.NONE);
                p.setFurColor(furColors);
            }

            p.setHealthStatus(healthValues[random.nextInt(healthValues.length)]);

            int numTemperaments = random.nextInt(MAX_TEMPERAMENTS);
            Set<Temperament> temperaments = new HashSet<>();
            for (int j = 0; j < numTemperaments; j++) {
                temperaments.add(temperamentValues[random.nextInt(temperamentValues.length)]);
            }
            p.setTemperament(temperaments);
            p.setPetSize(sizeValues[random.nextInt(sizeValues.length)]);
            p.setSex(sexValues[random.nextInt(sexValues.length)]);
            p.setSpayedNeutered(spayedNeuteredValues[random.nextInt(spayedNeuteredValues.length)]);
            if (adoptionCenters != null) {
                p.setCenter(adoptionCenters.get(random.nextInt(adoptionCenters.size())));
            }

            pets.add(p);
            System.out.println(p);
        }

        return pets;
    }

    private static void generateRandomPets(int count) {
        Random random = new Random();
        Species[] speciesValues = Species.values();
        CoatLength[] coatLengthValues = CoatLength.values();
        FurColor[] furColorValues = FurColor.values();
        FurType[] furTypeValues = FurType.values();
        Health[] healthValues = Health.values();
        Size[] sizeValues = Size.values();
        Temperament[] temperamentValues = Temperament.values();
        Sex[] sexValues = Sex.values();
        SpayedNeutered[] spayedNeuteredValues = SpayedNeutered.values();

        for (int i = 0; i < count; i++) {
            Species randomSpecies = speciesValues[random.nextInt(speciesValues.length)];
            CoatLength randomCoatLength = coatLengthValues[random.nextInt(coatLengthValues.length)];
            FurColor randomFurColor = furColorValues[random.nextInt(furColorValues.length)];
            FurType randomFurType = furTypeValues[random.nextInt(furTypeValues.length)];
            Health randomHealth = healthValues[random.nextInt(healthValues.length)];
            Size randomSize = sizeValues[random.nextInt(sizeValues.length)];
            Temperament randomTemperament = temperamentValues[random.nextInt(temperamentValues.length)];
            Sex randomSex = sexValues[random.nextInt(sexValues.length)];
            SpayedNeutered randomSpayed = spayedNeuteredValues[random.nextInt(spayedNeuteredValues.length)];


            String randomBreed;
            if (randomSpecies == CAT) {
                CatBreed[] catBreeds = CatBreed.values();
                randomBreed = catBreeds[random.nextInt(catBreeds.length)].getDisplayName();
            } else if (randomSpecies == Species.DOG) {
                DogBreed[] dogBreeds = DogBreed.values();
                randomBreed = dogBreeds[random.nextInt(dogBreeds.length)].getDisplayName();
            } else {
                randomBreed = "Unknown Breed";
            }
            System.out.println(randomSpecies.getDisplayName() + "," + randomBreed + "," +
                    randomCoatLength.getDisplayName() + "," + randomFurColor.getDisplayName() + "," +
                    randomFurType.getDisplayName() + "," + randomHealth.getDisplayName() + "," +
                    randomSize.getDisplayName() + "," + randomTemperament.getDisplayName() + "," + randomSex.getDisplayName()
                    + "," + randomSpayed.getDisplayName()
            );
        }
    }
}