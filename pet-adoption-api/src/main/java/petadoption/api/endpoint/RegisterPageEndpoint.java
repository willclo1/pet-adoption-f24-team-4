package petadoption.api.endpoint;

import org.springframework.beans.factory.annotation.Autowired;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.adoptionCenter.AdoptionCenterService;
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
    public User register(@RequestBody RegisterRequest registerRequest){
        return userService.register(registerRequest);
    }

}