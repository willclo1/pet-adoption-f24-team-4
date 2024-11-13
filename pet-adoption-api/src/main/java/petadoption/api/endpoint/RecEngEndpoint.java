package petadoption.api.endpoint;

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
import petadoption.api.userPreferences.UserPreferences;
import petadoption.api.userPreferences.UserPreferencesService;

import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@RestController
@RequestMapping("/RecEng")
public class RecEngEndpoint {
    private static final long DEFAULT_REC_SAMPLE_SIZE = 100;
    private static final long DEFAULT_REC_DISPLAY_SIZE = 20;

    @Getter
    @Autowired
    private UserService userService;

    @Getter
    @Autowired
    private UserPreferencesService userPreferencesService;

    @Getter
    @Autowired
    private PetService petService;

    @Getter
    @Autowired
    private LikedPetService likedPetService;

    @Getter
    private final RecommendationEngine recommendationEngine = new RecommendationEngine();

    private void logSuccessfulSave(UserPreferences up) {
        log.info(
                "User preferences successfully updated: {}",
                up.getId()
        );
    }

    private ResponseEntity<UserPreferences> failedUserPetRetrieval(long userId, long petId) {
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
    public List<Pet> getRandPets(@RequestParam("numPets") long numPets) {
        return petService.getRandPets(numPets);
    }

    @GetMapping("/getSampleDefault")
    public List<Pet> getRandPetsDefault() {
        return petService.getRandPets();
    }

    @GetMapping("/likedPets")
    public List<Pet> getLikedPets(@RequestParam("userId") Long userId) {
        return likedPetService.getLikedPets(userId);
    }

    @GetMapping("/resort")
    public List<Pet> resortSample(@RequestBody ResortBody body) {
        Optional<User> u =  userService.findUser(body.userId);
        if (u.isPresent() && !body.sample.isEmpty()) {
            return recommendationEngine.resortPetSample(u.get().getUserPreferences(), body.sample);
        }
        log.error("Failure to find user and / or sort empty list");
        return null;
    }

    @GetMapping("/recommendations")
    public List<Pet> getRecommendations(@RequestParam("userId") Long userId) {
        Optional<UserPreferences> up = userPreferencesService.getUserPreferencesByUserId(userId);

        if (up.isPresent()) {
            List<Pet> petSample = petService.getRandPets(DEFAULT_REC_SAMPLE_SIZE);

            for (Pet p : petSample) {
                Map.Entry<Pet, Double> ratedPet = new AbstractMap.SimpleEntry<>(p, 0.0);
                ratedPet.setValue(recommendationEngine.calculatePetRating(up.get(), p));
                recommendationEngine.getRecommendations().add(ratedPet);
            }

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

            return petSample.stream()
                    .limit(DEFAULT_REC_DISPLAY_SIZE).collect(Collectors.toList());
        }

        log.error("Failed to find UserPreferences for user: {}", userId);
        return null;
    }

    @PutMapping("/ratePet")
    public ResponseEntity<UserPreferences> ratePet(
            @RequestParam("userId") long userId,
            @RequestParam("petId") long petId,
            @RequestParam("like") boolean like) {
        Optional<UserPreferences> up = userPreferencesService.getUserPreferencesByUserId(userId);
        Optional<Pet> p = petService.getPetById(petId);
        if (up.isPresent() && p.isPresent()) {
            try {
                recommendationEngine.ratePet(
                        up.get(),
                        p.get(),
                        like
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

        return failedUserPetRetrieval(userId, petId);
    }

    @PutMapping("/rateAdoptedPet")
    public ResponseEntity<UserPreferences> rateAdoptedPet(@RequestBody RateAdoptedPetBody body) {
        Optional<UserPreferences> up = userPreferencesService.getUserPreferencesByUserId(body.userId);
        Optional<Pet> p = petService.getPetById(body.petId);
        Optional<User> u = userService.findUser(body.userId);

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
    }

    @PutMapping("/setPreferences")
    public ResponseEntity<UserPreferences> setPreferences(
            @RequestParam("userId") long userId,
            @RequestBody UserPreferences userPreferences) {

        Optional<User> u = userService.findUser(userId);

        if (u.isPresent() && userPreferences != null) {
            try {
                UserPreferences result
                        = userPreferencesService.saveUserPreferences(userPreferences);

                logSuccessfulSave(result);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                log.error("Failed to update user preferences", e);
                return ResponseEntity.badRequest().build();
            }
        }

        log.error("Failed to find user and / or user preferences was null: {}", userId);
        return ResponseEntity.badRequest().build();
    }
}