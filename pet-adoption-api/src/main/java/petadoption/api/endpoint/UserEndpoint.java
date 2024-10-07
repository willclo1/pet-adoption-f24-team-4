package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

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
    public User findUserByEmail(@PathVariable String email) {
        Optional<User> userOptional = userService.findUserByEmail(email);

        if (userOptional.isPresent()) {
            log.info("User found with email: {}", email);
            return userOptional.get();
        } else {
            log.warn("User not found with email: {}", email);
            return null; // Or throw an exception if preferred
        }
    }

//    @PostMapping("/users")
//    public User saveUser(@RequestBody User user) {
//        return userService.saveUser();
//    }
}
