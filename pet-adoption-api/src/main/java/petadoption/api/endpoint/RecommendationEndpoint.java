package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
public class RecommendationEndpoint {
    @GetMapping("/Recommendation")
    public String recommendationTitle() {
        return "RECOMMENDATION! - pulled from endpoint";
    }
}
