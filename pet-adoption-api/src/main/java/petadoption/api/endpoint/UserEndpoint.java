package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.EnumUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.pet.criteria.*;
import petadoption.api.pet.criteria.breed.CatBreed;
import petadoption.api.pet.criteria.breed.DogBreed;
import petadoption.api.user.User;
import petadoption.api.user.UserService;
import petadoption.api.userPreferences.UserPreferences;
import petadoption.api.userPreferences.UserPreferencesService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Log4j2
@RestController
public class UserEndpoint {
    @Autowired
    private UserService userService;

    @Autowired
    private UserPreferencesService userPreferencesService;

    @GetMapping("/users/{id}")
    public User findUserById(@PathVariable Long id) {
        var user = userService.findUser(id).orElse(null);

        if (user == null) {
            log.warn("User not found");
        }

        return user;
    }


    @GetMapping("/users/email/{email}")
    public ResponseEntity<User> findUserByEmailAddress(@PathVariable String email) {
        Optional<User> userOptional = userService.findUserByEmail(email);

        if (userOptional.isPresent()) {
            log.info("User found with email: {}", email);
            return ResponseEntity.ok(userOptional.get());
        } else {
            log.warn("User not found with email: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/users/adoption-center/{email}")
    public Optional<Long> findAdoptionIDByEmail(@PathVariable String email) {
        Optional<User> userOptional = userService.findUserByEmail(email);

        if (userOptional.isPresent()) {
            log.info("User found with email: {}", email);
            Optional<Long> id = userService.findAdoptionIDByEmailAddress(email);
            log.info(id.get());
            return id;
        }
        return null;
    }

//    @GetMapping("/{userId}/preferences")
//    public ResponseEntity<UserPreferences> getUserPreferences(@PathVariable Long userId) {
//        Optional<User> userOpt = userService.findUser(userId);
//
//        if (userOpt.get().getUserPreferences() != null) {
//            User user = userOpt.get();
//            UserPreferences preferences = user.getUserPreferences(); // Get preferences from user
//            return ResponseEntity.ok(preferences);
//        } else {
//            return ResponseEntity.notFound().build(); // Handle user not found
//        }
//    }
@PutMapping("/users/{userId}/preferences")
public ResponseEntity<UserPreferences> updateUserPreferences(
        @PathVariable Long userId,
        @RequestBody Map<String, Map<String, Double>> userPreferenceMap) {

    Optional<User> optionalUser = userService.findUser(userId);
    if (optionalUser.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    User user = optionalUser.get();
    UserPreferences preferences = user.getUserPreferences();

    final UserPreferences finalPreferences = new UserPreferences();

    userPreferenceMap.forEach((category, options) -> {
        switch (category) {
            case "furColor":
                finalPreferences.clearFurColorRating();
                options.forEach((key, value) -> finalPreferences.setFurColorRating(FurColor.valueOf(key), value));
                break;
            case "petType":
                finalPreferences.clearSpeciesRating();
                options.forEach((key, value) -> finalPreferences.setSpeciesRating(Species.valueOf(key), value));
                break;
            case "breed":
                finalPreferences.clearDogBreedRating();
                finalPreferences.clearCatBreedRating();
                options.forEach((key, value) -> {
                    if (EnumUtils.isValidEnum(DogBreed.class, key)) {
                        finalPreferences.setDogBreedRating(DogBreed.valueOf(key), value);
                    } else if (EnumUtils.isValidEnum(CatBreed.class, key)) {
                        finalPreferences.setCatBreedRating(CatBreed.valueOf(key), value);
                    }
                });
                break;
            case "petSize":
                finalPreferences.clearSizeRating();
                options.forEach((key, value) -> finalPreferences.setSizeRating(Size.valueOf(key), value));
                break;
            case "age":
                finalPreferences.clearAgeRating();
                options.forEach((key, value) -> finalPreferences.setAgeRating(Integer.parseInt(key), value));
                break;
            case "temperament":
                finalPreferences.clearTemperamentRating();
                options.forEach((key, value) -> finalPreferences.setTemperamentRating(Temperament.valueOf(key), value));
                break;
            case "healthStatus":
                finalPreferences.clearHealthRating();
                options.forEach((key, value) -> finalPreferences.setHealthRating(Health.valueOf(key), value));
                break;
            default:
                break; // Ignore unknown categories
        }
    });
    user.setUserPreferences(finalPreferences);
    userService.saveUser(user);

    return ResponseEntity.ok(finalPreferences);
}
    @GetMapping("/users")
    public ResponseEntity<List<User>> findAllUsers() {
        List<User> users = userService.findAllUsers();
        if (!users.isEmpty()) {
            return ResponseEntity.ok(users);
        } else {
            log.warn("No users found");
            return ResponseEntity.noContent().build();
        }
    }
//    @PostMapping("/users")
//    public User saveUser(@RequestBody User user) {
//        return userService.saveUser();
//    }

    @GetMapping("/users/non-adoption-center")
    public ResponseEntity<List<User>> findAllNonAdoptionCenterUsers() {
        List<User> nonAdoptionCenterUsers = userService.findNonAdoptionUsers();

        if (!nonAdoptionCenterUsers.isEmpty()) {
            log.info("Found {} non-adoption center users", nonAdoptionCenterUsers.size());
            return ResponseEntity.ok(nonAdoptionCenterUsers);
        } else {
            log.warn("No non-adoption center users found");
            return ResponseEntity.noContent().build();
        }
    }
}
