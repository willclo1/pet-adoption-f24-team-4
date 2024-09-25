package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@Log4j2
@RestController
public class LoginPageEndpoint {
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        log.info("Received login attempt for user: {}", username);
        return ResponseEntity.ok(Collections.singletonMap("message", "Login data = " + username +" " + password));
    }

}


