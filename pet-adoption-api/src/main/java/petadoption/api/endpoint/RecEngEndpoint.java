package petadoption.api.endpoint;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;
import petadoption.api.pet.PetService;
import petadoption.api.recommendationEngine.RecEngService;
import petadoption.api.user.UserService;

@Log4j2
@RestController
@RequestMapping("/RecEng")
public class RecEngEndpoint {
    /*
    @GetMapping("/recommendationEngine")
    public String recEngine_title() {
        return "Welcome to the Recommendation Engine!";
    }
    */

    @Getter
    private final UserService userService;
    @Getter
    private final RecEngService recEngService;
    @Getter
    private final PetService petService;

    RecEngEndpoint(UserService userService, RecEngService recEngService, PetService petService) {
        this.userService = userService;
        this.recEngService = recEngService;
        this.petService = petService;
    }
}
