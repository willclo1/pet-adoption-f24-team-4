package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Log4j2
@RestController
public class LoginPageEndpoint {

    @Autowired
    private UserService userService;

    // Use the BCryptPasswordEncoder to compare passwords
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");  // Use "email" instead of "emailAddress"
        String password = credentials.get("password");

        log.info("Received login attempt for email: {}", email);

        // Find user by email
        Optional<User> userOptional = userService.findUserByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Validate the password using BCrypt
            if (passwordEncoder.matches(password, user.getPassword())) {
                // Successful login
                log.info("User successfully logged in: {}, User Type: {}", user.getEmailAddress(), user.getUserType());

                return ResponseEntity.ok(Map.of("message", "Login successful!", "userType", user.getUserType()));
            } else {
                // Incorrect password
                log.warn("Incorrect password for user: {}", email);
                return ResponseEntity.status(401).body(Collections.singletonMap("message", "Invalid credentials."));
            }
        } else {
            // User not found
            log.warn("User not found: {}", email);
            return ResponseEntity.status(404).body(Collections.singletonMap("message", "User not found."));
        }
    }
}
