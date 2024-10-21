package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.User;
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
    public ResponseEntity<User> findUserByEmail(@PathVariable String email) {
        Optional<User> userOptional = userService.findUserByEmail(email);

        if (userOptional.isPresent()) {
            log.info("User found with email: {}", email);
            return ResponseEntity.ok(userOptional.get()); // Return user with 200 OK status
        } else {
            log.warn("User not found with email: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Return 404 NOT FOUND
        }
    }


    @GetMapping("/users/adoption-center/{email}")
    public Optional<Long> findAdoptionIDByEmail(@PathVariable String email) {
        Optional<User> userOptional = userService.findUserByEmail(email);

        if (userOptional.isPresent()) {
            log.info("User found with email: {}", email);
            return userService.findAdoptionIDByEmailAddress(email);
        }
        return null;
    }

    @GetMapping("register/users/all")
    public ResponseEntity<List<User>> findAllUsers() {
        List<User> users = userService.findAllUsers();

        if (users.isEmpty()) {
            log.warn("No users found in the database");
            return ResponseEntity.noContent().build(); // Returns a 204 No Content response
        }

        log.info("Retrieved {} users from the database", users.size());
        return ResponseEntity.ok(users); // Returns a 200 OK response with the users
    }

//    @PostMapping("/users")
//    public User saveUser(@RequestBody User user) {
//        return userService.saveUser();
//    }
}
