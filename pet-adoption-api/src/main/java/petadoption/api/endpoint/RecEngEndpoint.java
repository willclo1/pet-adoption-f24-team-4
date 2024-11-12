package petadoption.api.endpoint;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.recommendationEngine.*;
import petadoption.api.user.UserService;
import petadoption.api.userPreferences.UserPreferences;
import petadoption.api.userPreferences.UserPreferencesService;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/RecEng")
public class RecEngEndpoint {
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
    private final RecommendationEngine recommendationEngine;

    RecEngEndpoint() {
        this.userService = new UserService();
        this.userPreferencesService = new UserPreferencesService();
        this.petService = new PetService();
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
