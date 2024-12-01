package petadoption.api.recommendationEngine;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import petadoption.api.pet.Pet;
import petadoption.api.user.User;

import java.util.*;

/**
 * @author Rafe Loya
 *
 * @see Pet
 * @see PetComparator
 * @see User
 */
@Setter
@Getter
@Log4j2
public class RecommendationEngine {
    /**
     * Default value used to increment / decrement
     */
    public static final int DEFAULT_VAL = 1;

    /**
     * Default value for incrementing after attempting to adopt pet
     */
    public static final int DEFAULT_ADOPT_VAL = 50;

    public static Integer calculatePetRating(Map<String, Integer> prefs, Pet p) {
        Integer rating = 0;

        for (String pa : p.getAttributes()) {
            if (prefs.containsKey(pa)) {
                rating += prefs.get(pa);
            }
        }

        return rating;
    }

    public static List<Pet> sortSample(
            Map<String, Integer> preferences, List<Pet> sample, int numPetsSeen) {
        if (sample == null || numPetsSeen < 0 || numPetsSeen > sample.size()) {
            return sample;
        }

        // get sublist of remaining pets, use stream to sort by
        // calculated pet rating, then return stream as list
        return sample.subList(numPetsSeen, sample.size()).stream()
                .sorted(Comparator.comparingInt(
                        (Pet p) -> calculatePetRating(preferences, p)).reversed())
                .toList();
    }

    /**
     * Changes a given <code>User</code>'s preferences
     * according to a passed <code>double</code>.
     * <p>
     * This function is intended to be a helper function for
     * <code>ratePet()</code></code> and <code>rateAdoptedPet()</code>,
     * but can be called directly for custom increment / decrement values.
     *
     * @param u         User
     * @param p         <code>Pet</code> to reference criteria from
     * @param updateVal value to increment / decrement criteria ratings by
     */
    public static void updatePreferences(User u, Pet p, int updateVal) {
        // Initialize preferences if null
        if (u.getPreferences() == null) {
            u.setPreferences(new HashMap<>());
        }

        for (String pa : p.getAttributes()) {
            // Add new preference if it doesn't exist, or update existing one
            u.getPreferences().put(pa, u.getPreferences().getOrDefault(pa, 0) + updateVal);
        }
    }
    /**
     * Increments / decrements the ratings in the given <code>User</code>'s
     * preferences mapped by the criteria contained in a passed
     * <code>Pet</code> instance.
     *
     * @param u    User
     * @param p    <code>Pet</code> to reference criteria from
     * @param like If the <code>User</code> liked the pet
     */
    public static void ratePet(User u, Pet p, boolean like) {
        int updateVal;

        if (like) updateVal = DEFAULT_VAL;
        else updateVal = -(DEFAULT_VAL);

        updatePreferences(u, p, updateVal);
    }

    /**
     * Increments the ratings in the given <code>UserPreferences</code>
     * mapped by the criteria contained in a passed <code>Pet</code>
     * instance. The amount that the criteria ratings will be incremented by
     * is significantly larger than <code>ratePet()</code>.
     * <p/>
     * This function is intended to be used when a <code>User</code>
     * contacts the <code>AdoptionCenter</code> associated with the given
     * <code>Pet</code>.
     *
     * @param u <code>User</code>'s specific preferences
     * @param p  <code>Pet</code> to reference criteria from
     */
    public static void rateAdoptedPet(User u, Pet p) {
        updatePreferences(u, p, DEFAULT_ADOPT_VAL);
    }
}