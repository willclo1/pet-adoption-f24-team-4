package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Log4j2
@RestController
public class UserEndpoint {
    @Autowired
    private UserService userService;

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
    @GetMapping("/users/{userId}/getPref")
    public ResponseEntity<Map<String, Integer>> getUserPreferences(@PathVariable Long userId) {
        Optional<User> optionalUser = userService.findUser(userId);
        if (optionalUser.isEmpty()) {
            log.error("[getUserPreferences] User with ID:{} not found", userId);
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Collections.emptyMap());
        }

        User user = optionalUser.get();
        Map<String, Integer> preferences = user.getPreferences();

        log.info("[getUserPreferences] Retrieved preferences for user ID:{}: {}", userId, preferences);

        return ResponseEntity.ok(preferences);
    }
    @PutMapping("/users/{userId}/preferences")
    public ResponseEntity<String> updatePreferences(
            @PathVariable Long userId,
            @RequestBody Map<String, Integer> preferences) {

        Optional<User> optionalUser = userService.findUser(userId);
        if (optionalUser.isEmpty()) {
            log.error("[updatePreferences] User with ID:{} not found", userId);
            return ResponseEntity
                    .status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body("User not found");
        }

        log.info("[updatePreferences] Received preferences for user ID:{}: {}", userId, preferences);

        for (Map.Entry<String, Integer> entry : preferences.entrySet()) {
            if (entry.getValue() == null || entry.getValue() < 0 || entry.getValue() > 1) {
                log.error("[updatePreferences] Invalid rating for key: {}. Value: {}", entry.getKey(), entry.getValue());
                return ResponseEntity
                        .badRequest()
                        .body("Invalid rating for key: " + entry.getKey());
            }
        }

        User user = optionalUser.get();

        log.info("[updatePreferences] Preferences before update: {}", user.getPreferences());
        user.setPreferences(preferences);
        userService.saveUser(user);
        log.info("[updatePreferences] Preferences after update: {}", user.getPreferences());

        return ResponseEntity.ok("Successfully updated user preferences");
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
