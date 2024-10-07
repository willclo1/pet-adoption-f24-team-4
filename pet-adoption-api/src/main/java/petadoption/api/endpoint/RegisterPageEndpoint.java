package petadoption.api.endpoint;

import org.springframework.beans.factory.annotation.Autowired;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.RegisterRequest;
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
    public ResponseEntity<RegisterRequest> register(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = new User();
            user.setFirstName(registerRequest.getFirstName());
            user.setLastName(registerRequest.getLastName());
            user.setEmailAddress(registerRequest.getEmailAddress());
            user.setPassword(registerRequest.getPassword());
            user.setUserType(registerRequest.getUserType());
            Long adoptionId = registerRequest.getAdoptionId();
            User saveUser = userService.saveUser(user, adoptionId);

            log.info("User Registered: " + saveUser.getEmailAddress());

            return ResponseEntity.ok(registerRequest);

        } catch (Exception e){
            log.error("Error registering User");
            return ResponseEntity.badRequest().build();
        }
    }

}