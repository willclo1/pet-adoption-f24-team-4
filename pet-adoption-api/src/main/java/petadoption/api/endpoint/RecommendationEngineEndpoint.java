package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

@Log4j2
@RestController
public class RecommendationEngineEndpoint {
    @GetMapping("/recommendationEngine")
    public String recEngine_title() {
        return "Welcome to the Recommendation Engine!";
    }
}
