package petadoption.api.endpoint;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.likedPets.LikedPetService;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.recommendationEngine.*;
import petadoption.api.user.UserService;
import petadoption.api.userPreferences.UserPreferences;
import petadoption.api.userPreferences.UserPreferencesService;

import java.util.AbstractMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Log4j2
@RestController
@RequestMapping("/RecEng")
public class RecEngEndpoint {
    private static final long DEFAULT_REC_SAMPLE_SIZE = 100;
    private static final long DEFAULT_REC_DISPLAY_SIZE = 20;

    /*
    @GetMapping("/recommendationEngine")
    public String recEngine_title() {
        return "Welcome to the Recommendation Engine!";
    }
    */
    @Getter
    private final UserService userService;

    @Getter
    private final UserPreferencesService userPreferencesService;

    @Getter
    private final PetService petService;

    @Getter
    private final LikedPetService likedPetService;

    @Getter
    private final RecommendationEngine recommendationEngine;

    RecEngEndpoint() {
        this.userService = new UserService();
        this.userPreferencesService = new UserPreferencesService();
        this.petService = new PetService();
        this.likedPetService = new LikedPetService();
        this.recommendationEngine = new RecommendationEngine();
    }

    public void logSuccessfulSave(UserPreferences up) {
        log.info(
                "User preferences successfully updated: {}",
                up.getUserPreferencesId()
        );
    }

    @GetMapping("/allPets")
    public List<Pet> getAllPets() {
        return petService.getAllPets();
    }

    @GetMapping("/getSample")
    public List<Pet> getRandPets(@RequestParam long numPets) {
        return petService.getRandPets(numPets);
    }

    @GetMapping("/getSampleDefault")
    public List<Pet> getRandPetsDefault() {
        return petService.getRandPets();
    }

    @GetMapping("/likedPets")
    public List<Pet> getLikedPets(@RequestParam Long userId) {
        return likedPetService.getLikedPets(userId);
    }

    @GetMapping("/recommendations")
    public List<Pet> getRecommendations(@RequestBody UserPreferences up) {
        List<Pet> petSample = petService.getRandPets(DEFAULT_REC_SAMPLE_SIZE);

        for (Pet p : petSample) {
            Map.Entry<Pet, Double> ratedPet = new AbstractMap.SimpleEntry<>(p, 0.0);
            ratedPet.setValue(recommendationEngine.calculatePetRating(up, p));
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

    @PutMapping("/ratePet")
    public ResponseEntity<UserPreferences> ratePet(@RequestBody RatePetBody body) {
        try {
            recommendationEngine.ratePet(
                    body.getUserPreferences(),
                    body.getPet(),
                    body.wasLiked()
            );
            UserPreferences result =
                    userPreferencesService
                            .saveUserPreferences(body.getUserPreferences());
            logSuccessfulSave(result);
            //likedPetsService.saveLikedPets()
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Failed to update user preferences", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/rateAdoptedPet")
    public ResponseEntity<UserPreferences> rateAdoptedPet(@RequestBody RatePetBody body) {
        try {
            recommendationEngine.rateAdoptedPet(
                    body.getUserPreferences(),
                    body.getPet()
            );
            UserPreferences result =
                    userPreferencesService
                            .saveUserPreferences(body.getUserPreferences());
            logSuccessfulSave(result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Failed to update user preferences", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/setPreferences")
    public ResponseEntity<UserPreferences> setPreferences(@RequestBody UserPreferences userPreferences) {
        try {
            UserPreferences result =
                    userPreferencesService.saveUserPreferences(userPreferences);
            logSuccessfulSave(result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Failed to update user preferences", e);
            return ResponseEntity.badRequest().build();
        }
    }
}