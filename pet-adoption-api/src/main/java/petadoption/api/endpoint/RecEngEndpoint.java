package petadoption.api.endpoint;

import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.likedPets.LikedPetService;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.recommendationEngine.*;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import java.util.*;
import java.util.stream.Collectors;

import static petadoption.api.recommendationEngine.RecommendationEngine.calculatePetRating;

@Log4j2
@RestController
@RequestMapping("/RecEng")
public class RecEngEndpoint {
    private static final long DEFAULT_REC_SAMPLE_SIZE = 100;
    private static final long DEFAULT_REC_DISPLAY_SIZE = 20;

    @Getter
    @Autowired
    private UserService userService;

    /*
    @Getter
    @Autowired
    private UserPreferencesService userPreferencesService;
    */

    @Getter
    @Autowired
    private PetService petService;

    @Getter
    @Autowired
    private LikedPetService likedPetService;

    @Getter
    private final RecommendationEngine recommendationEngine = new RecommendationEngine();

    private void logSuccessfulSave(User u) {
        log.info(
                "User preferences successfully updated: {}",
                u.getId()
        );
    }

    private ResponseEntity<User> failedUserPetRetrieval(long userId, long petId) {
        log.error("""
                Failed to find user's preferences and / or pet:
                user:  {}
                pet:   {}""", userId, petId);
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/allPets")
    public List<Pet> getAllPets() {
        return petService.getAllPets();
    }

    @GetMapping("/getSample")
    public List<Pet> getRandPets(@RequestBody long numPets) {
        return petService.getRandPets(numPets);
    }

    @GetMapping("/getSampleDefault")
    public List<Pet> getRandPetsDefault() {
        return petService.getRandPets();
    }

    @GetMapping("/likedPets")
    public List<Pet> getLikedPets(@RequestBody Long userId) {
        return likedPetService.getLikedPets(userId);
    }

    /*
    @GetMapping("/resort")
    public List<Pet> resortSample(@RequestBody ResortBody body) {
        Optional<User> u =  userService.findUser(body.userId);
        Optional<UserPreferences> up;

        if (u.isPresent() && !body.sample.isEmpty()) {
            if ((up = userPreferencesService.getUserPreferencesByUserId(u.get().getId())).isEmpty()) {
                u.get().setUserPreferences(new UserPreferences());
                userPreferencesService.saveUserPreferences(u.get().getUserPreferences());
                up = userPreferencesService.getUserPreferencesByUserId(body.userId);
            }
            return recommendationEngine.resortPetSample(u.get().getUserPreferences(), body.sample);
        }

        log.error("Failure to find user and / or sort empty list");
        return null;
    }
    */

    @GetMapping("/recommendations")
    public Set<Pet> getRecommendations(@RequestBody Long userId) {
        //Optional<UserPreferences> up = userPreferencesService.getUserPreferencesByUserId(userId);
        Optional<User> user = userService.findUser(userId);

        //if (up.isPresent()) {
        if (user.isPresent()) {
            List<Pet> petSample = petService.getRandPets(DEFAULT_REC_SAMPLE_SIZE);
            SortedSet<Map.Entry<Pet, Integer>> sortedSample = new TreeSet<>(new PetComparator());

            for (Pet p : petSample) {
                Map.Entry<Pet, Integer> ratedPet = new AbstractMap.SimpleEntry<>(p, 0);

                ratedPet.setValue(
                        calculatePetRating(
                                user.get().getPreferences(),
                                p
                        )
                );

                //recommendationEngine.getRecommendations().add(ratedPet);
                sortedSample.add(ratedPet);
            }

            // Only sorted pets are needed by frontend, don't need to include ratings
            return sortedSample.stream()
                    .limit(DEFAULT_REC_DISPLAY_SIZE)
                    .map(Map.Entry::getKey).collect(Collectors.toSet());
            //return sortedSample;

            /*
            for (int i = 0; i < petSample.size(); i++) {
                try {
                    petSample.set(
                            i,
                            Objects.requireNonNull(
                                    recommendationEngine
                                            .getRecommendations().poll()).getKey()
                    );
                } catch (Exception e) {
                    log.error("Failed to grab pet(???)");
                }
            }
            */
            //return petSample.stream().limit(DEFAULT_REC_DISPLAY_SIZE).collect(Collectors.toList());
        }

        log.error("Failed to find UserPreferences for user: {}", userId);
        return null;
    }

    @PutMapping("/ratePet")
    @Transactional
    public ResponseEntity<User> ratePet(@RequestBody RatePetBody body) {
        Optional<User> u = userService.findUser(body.userId);
        //Optional<UserPreferences> up = userPreferencesService.getUserPreferencesByUserId(body.userId);
        //Optional<Pet> p = petService.getPetById(body.petId);

        if (u.isPresent()) {
            if (u.get().getPreferences().isEmpty()) {
                u.get().setPreferences(new HashMap<>());
                userService.saveUser(u.get());
            }

            Optional<Pet> p = petService.getPetById(body.petId);
            if (p.isPresent()) {
                try {
                    RecommendationEngine.ratePet(u.get(), p.get(), body.like);
                    User result = userService.saveUser(u.get());
                    logSuccessfulSave(result);

                    return ResponseEntity.ok(result);
                } catch (Exception e) {
                    log.error("Failed to update user preferences [ratePet()]", e);
                    return ResponseEntity.badRequest().build();
                }
            } else {
                return failedUserPetRetrieval(body.userId, body.petId);
            }
        }

        return failedUserPetRetrieval(body.userId, body.petId);
        /*
        if (u.isPresent()) {
            if (up.isEmpty()) {
                u.get().setUserPreferences(new UserPreferences());
                userPreferencesService.saveUserPreferences(u.get().getUserPreferences());
                up = userPreferencesService.getUserPreferencesByUserId(body.userId);
            }
        } else {

        }

        if (up.isPresent() && p.isPresent()) {
            try {
                recommendationEngine.ratePet(
                        up.get(),
                        p.get(),
                        body.like
                );

                UserPreferences result =
                        userPreferencesService.saveUserPreferences(up.get());
                logSuccessfulSave(result);

                return ResponseEntity.ok(result);
            } catch(Exception e) {
                log.error("Failed to update user preferences [ratePet()]", e);
                return ResponseEntity.badRequest().build();
            }
        }

        return failedUserPetRetrieval(body.userId, body.petId);
        */
    }

    @PutMapping("/rateAdoptedPet")
    @Transactional
    public ResponseEntity<User> rateAdoptedPet(@RequestBody RateAdoptedPetBody body) {
        //Optional<UserPreferences> up = userPreferencesService.getUserPreferencesByUserId(body.userId);
        //Optional<Pet> p = petService.getPetById(body.petId);
        Optional<User> u = userService.findUser(body.userId);

        if (u.isPresent()) {
            if (u.get().getPreferences().isEmpty()) {
                u.get().setPreferences(new HashMap<>());
                userService.saveUser(u.get());
            }

            Optional<Pet> p = petService.getPetById(body.petId);
            if (p.isPresent()) {
                RecommendationEngine.rateAdoptedPet(u.get(), p.get());
                User result = userService.saveUser(u.get());
                logSuccessfulSave(result);

                return ResponseEntity.ok(result);
            } else {
                return failedUserPetRetrieval(body.userId, body.petId);
            }
        }

        return failedUserPetRetrieval(body.userId, body.petId);
        /*
        if (u.isPresent()) {
            if (up.isEmpty()) {
                u.get().setUserPreferences(new UserPreferences());
                userPreferencesService.saveUserPreferences(u.get().getUserPreferences());
                up = userPreferencesService.getUserPreferencesByUserId(body.userId);
            }
        }

        if (up.isPresent() && p.isPresent()) {
            try {
                recommendationEngine.rateAdoptedPet(
                        up.get(),
                        p.get()
                );
                UserPreferences result =
                        userPreferencesService.saveUserPreferences(up.get());
                logSuccessfulSave(result);

                return ResponseEntity.ok(result);
            } catch(Exception e) {
                log.error("Failed to update user preferences [rateAdoptedPet()]", e);
                return ResponseEntity.badRequest().build();
            }
        }

        return failedUserPetRetrieval(body.userId, body.petId);
        */
    }

    // NEEDS WORK
    @PutMapping("/setPreferences")
    @Transactional
    public ResponseEntity<User> setPreferences(@RequestParam("userId") long userId) {
        Optional<User> u = userService.findUser(userId);
        User result = null;

        if (u.isPresent()) {
            if (u.get().getPreferences().isEmpty()) {
                u.get().setPreferences(new HashMap<>());
                //result = userService.saveUser(u.get());
            }
            try {
                result = userService.saveUser(u.get());
                if (result != null) {
                    logSuccessfulSave(result);
                    return ResponseEntity.ok(result);
                } else {
                    log.error("Failed to save user on update preferences");
                    return ResponseEntity.badRequest().build();
                }
            } catch (Exception e) {
                log.error("Failed to update user preferences", e);
                return ResponseEntity.badRequest().build();
            }
            /*
            try {
                UserPreferences result
                        = userPreferencesService.saveUserPreferences(userPreferences);

                logSuccessfulSave(result);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                log.error("Failed to update user preferences", e);
                return ResponseEntity.badRequest().build();
            }
            */
        }

        log.error("Failed to find user and / or user preferences was null: {}", userId);
        return ResponseEntity.badRequest().build();
    }
}