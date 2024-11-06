package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Log4j2
@RestController
public class LoginPageEndpoint {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        String token = userService.verify(user);

        if ("Fail".equals(token)) {
            return ResponseEntity.status(401).body(Collections.singletonMap("message", "Invalid credentials"));
        } else {
            // Find the user to retrieve the adoptionId if available
            Optional<User> userOptional = userService.findUserByEmail(user.getEmailAddress());

            // Prepare response with token and adoptionId if present
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);

            if (userOptional.isPresent() && userOptional.get().getCenter() != null) {
                response.put("adoptionId", userOptional.get().getCenter().getAdoptionID());
            }

            return ResponseEntity.ok(response);
        }
    }
}