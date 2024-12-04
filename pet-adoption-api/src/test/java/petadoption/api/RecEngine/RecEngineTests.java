package petadoption.api.RecEngine;

import org.junit.jupiter.api.Test;
import petadoption.api.pet.Pet;
import petadoption.api.recommendationEngine.RecommendationEngine;
import petadoption.api.user.User;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class RecEngineTests {

    private Pet createValidPet(String species, String breed, String name) {
        Pet pet = new Pet();
        Set<String> attributes = new HashSet<>();

        attributes.add("Species:" + species);             // Species (Cat/Dog)
        if (species.equals("Dog")) {
            attributes.add("Dog Breed:" + breed);         // Valid Dog Breed
        } else if (species.equals("Cat")) {
            attributes.add("Cat Breed:" + breed);         // Valid Cat Breed
        }
        attributes.add("Fur Type:Smooth");                // Fur Type
        attributes.add("Fur Color:Brown");                // Fur Color
        attributes.add("Fur Length:Short");               // Fur Length
        attributes.add("Size:Medium");                    // Size
        attributes.add("Health:Good");                    // Health
        attributes.add("Gender:Male");                    // Gender
        attributes.add("Spayed / Neutered:Y");            // Spayed/Neutered
        attributes.add("Temperament:Friendly");           // Temperament
        attributes.add("Age:3");                    // Age
        attributes.add("Weight:30");                  // Weight

        pet.setName(name);
        pet.setAttributes(attributes);
        return pet;
    }

    @Test
    void testCalculatePetRating() {
        Map<String, Integer> preferences = Map.of(
                "Species:Dog", 10,
                "Size:Medium", 5,
                "Dog Breed:Golden Retriever", 15
        );

        Pet pet = createValidPet("Dog", "Golden Retriever", "Buddy");

        int rating = RecommendationEngine.calculatePetRating(preferences, pet);
        assertEquals(30, rating, "Pet rating should be calculated as 30");
    }

    @Test
    void testSortSample() {
        Map<String, Integer> preferences = Map.of(
                "Species:Cat", 10,
                "Size:Small", 5
        );

        Pet pet1 = createValidPet("Cat", "Siamese", "Whiskers");
        Pet pet2 = createValidPet("Cat", "Persian", "Fluffy");

        List<Pet> sample = new ArrayList<>(List.of(pet2, pet1));
        List<Pet> sortedSample = RecommendationEngine.sortSample(preferences, sample, 0);

        assertEquals("Fluffy", sortedSample.get(0).getName(), "Whiskers should be the highest-rated pet");
        assertEquals("Whiskers", sortedSample.get(1).getName(), "Fluffy should be the second-highest-rated pet");
    }

    @Test
    void testUpdatePreferences() {
        User user = new User();
        Pet pet = createValidPet("Dog", "Beagle", "Max");

        RecommendationEngine.updatePreferences(user, pet, 2);

        assertEquals(2, user.getPreferences().get("Species:Dog"), "Preference for 'Species:Dog' should be updated to 2");
        assertEquals(2, user.getPreferences().get("Dog Breed:Beagle"), "Preference for 'Dog Breed:Beagle' should be updated to 2");
    }

    @Test
    void testRatePet() {
        User user = new User();
        Pet pet = createValidPet("Dog", "Golden Retriever", "Charlie");

        RecommendationEngine.ratePet(user, pet, true);

        assertEquals(1, user.getPreferences().get("Species:Dog"), "Preference for 'Species:Dog' should be incremented by 1");
        assertEquals(1, user.getPreferences().get("Dog Breed:Golden Retriever"), "Preference for 'Dog Breed:Labrador' should be incremented by 1");

        RecommendationEngine.ratePet(user, pet, false);

        assertEquals(0, user.getPreferences().get("Species:Dog"), "Preference for 'Species:Dog' should be decremented to 0");
        assertEquals(0, user.getPreferences().get("Dog Breed:Golden Retriever"), "Preference for 'Dog Breed:Labrador' should be decremented to 0");
    }

    @Test
    void testRateAdoptedPet() {
        User user = new User();
        Pet pet = createValidPet("Cat", "Bengal", "Luna");

        RecommendationEngine.rateAdoptedPet(user, pet);

        assertEquals(50, user.getPreferences().get("Species:Cat"), "Preference for 'Species:Cat' should be incremented by 50");
        assertEquals(50, user.getPreferences().get("Cat Breed:Bengal"), "Preference for 'Cat Breed:Bengal' should be incremented by 50");
    }
}