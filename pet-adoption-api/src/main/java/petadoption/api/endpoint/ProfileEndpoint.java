package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
public class ProfileEndpoint {
    @CrossOrigin(origins = "http://localhost:3000")  // Enable CORS for this endpoint
    @GetMapping("/ProfEndpoint")
    public String ProfileStatement() {
        return "I really Loooooooove your mom!";
    }

}