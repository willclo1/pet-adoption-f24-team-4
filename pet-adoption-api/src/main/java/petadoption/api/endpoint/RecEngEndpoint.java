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
    private PetService petService;

    @Getter
    @Autowired
    private LikedPetService likedPetService;

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

    @GetMapping("/resortSample")
    public List<Pet> resortSample(@RequestBody ResortBody body) {
        if (body == null || body.sample == null || body.userId == null) {
            log.error("[sortSample] Invalid request body.");
            return Collections.emptyList();
        }

        if (body.numPetsSeen < 0 || body.numPetsSeen > body.sample.size()) {
            log.error(
                    "[sortSample] Number of seen pets ({}) is larger than the sample size ({}).",
                    body.numPetsSeen,
                    body.sample.size()
            );
            return Collections.emptyList();
        }

        Optional<User> optUser = userService.findUser(body.userId);
        if (optUser.isEmpty()) {
            log.error(
                    "[sortSample] User with ID {} not found.",
                    body.userId
            );
            return body.sample.subList(body.numPetsSeen, body.sample.size());
        }

        User user = optUser.get();
        if (body.sample.isEmpty()) {
            log.warn("[sortSample] Pet sample list is empty.");
            return body.sample;
        }

        Map<String, Integer> preferences;
        if ((preferences = user.getPreferences()).isEmpty()) {
            user.setPreferences(new HashMap<>());
            userService.saveUser(user);

            log.info("[sortSample] User's preferences were empty, returning list w/o seen pets.");
            return body.sample.subList(body.numPetsSeen, body.sample.size());
        }

        return RecommendationEngine.sortSample(preferences, body.sample, body.numPetsSeen);
    }

    @PostMapping("/recommendations")
    public List<Pet> getRecommendations(@RequestBody Long userId) {
        Optional<User> optUser = userService.findUser(userId);

        if (optUser.isEmpty()) {
            log.error("[getRecommendations] User with ID {} not found.", userId);
            return Collections.emptyList();
        }

        User user = optUser.get();

        List<Pet> likedPets = likedPetService.getLikedPets(userId);
        Set<Long> likedPetIds = new HashSet<>();
        likedPets.forEach(pet -> likedPetIds.add(pet.getId()));

        List<Pet> allPets = petService.getRandPets(DEFAULT_REC_SAMPLE_SIZE);
        List<Pet> filteredPets = allPets.stream()
                .filter(pet -> !likedPetIds.contains(pet.getId()))
                .toList();

        return RecommendationEngine.sortSample(user.getPreferences(), filteredPets, 0);
    }

    @PutMapping("/ratePet")
    @Transactional
    public ResponseEntity<User> ratePet(@RequestBody RatePetBody body) {
        Optional<User> u = userService.findUser(body.userId);

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
                    log.error("[ratePet] Failed to update user preferences", e);
                    return ResponseEntity.badRequest().build();
                }
            } else {
                return failedUserPetRetrieval(body.userId, body.petId);
            }
        }

        return failedUserPetRetrieval(body.userId, body.petId);
    }

    @PutMapping("/rateAdoptedPet")
    @Transactional
    public ResponseEntity<User> rateAdoptedPet(@RequestBody RateAdoptedPetBody body) {
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
    }

    // NEEDS WORK
    @PutMapping("/setPreferences")
    @Transactional
    public ResponseEntity<User> setPreferences(@RequestParam("userId") long userId) {
        Optional<User> u = userService.findUser(userId);
        User result;

        if (u.isPresent()) {
            if (u.get().getPreferences().isEmpty()) {
                u.get().setPreferences(new HashMap<>());
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
        }

        log.error("Failed to find user and / or user preferences was null: {}", userId);
        return ResponseEntity.badRequest().build();
    }
}