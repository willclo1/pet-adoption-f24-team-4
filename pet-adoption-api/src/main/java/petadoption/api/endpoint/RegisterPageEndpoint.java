package petadoption.api.endpoint;

import org.springframework.beans.factory.annotation.Autowired;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import java.util.Collections;
import java.util.Map;

@Log4j2
@RestController
public class RegisterPageEndpoint {

    @Autowired
    UserService userService;
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        try {
            User saveUser = userService.saveUser(user);
            log.info("User Registered: " + saveUser.getEmailAddress());
            return ResponseEntity.ok(saveUser);

        } catch (Exception e){
            log.error("Error registering User");
            return ResponseEntity.badRequest().build();
        }
    }

}