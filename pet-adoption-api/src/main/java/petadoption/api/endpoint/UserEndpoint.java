package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.User;
import petadoption.api.user.UserPreference;
import petadoption.api.user.UserService;

import java.util.List;
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

    @GetMapping("/{userId}/preferences")
    public ResponseEntity<UserPreference> getUserPreferences(@PathVariable Long userId) {
        Optional<User> userOpt = userService.findUser(userId);

        if (userOpt.get().getUserPreference() != null) {
            User user = userOpt.get();
            UserPreference preferences = user.getUserPreference(); // Get preferences from user
            return ResponseEntity.ok(preferences);
        } else {
            return ResponseEntity.notFound().build(); // Handle user not found
        }
    }
    @PutMapping("/users/{userId}/preferences")
    public ResponseEntity<UserPreference> updateUserPreferences(
            @PathVariable Long userId,
            @RequestBody UserPreference userPreference) {

        Optional<User> optionalUser = userService.findUser(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setUserPreference(userPreference); // Update user preference
            userService.saveUser(user); // Save updated user
            return ResponseEntity.ok(userPreference);
        }
        return ResponseEntity.notFound().build();
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
