package petadoption.api.endpoint;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import petadoption.api.likedPets.LikedPetService;
import petadoption.api.pet.Pet;

import java.util.List;

@Log4j2
@RestController
public class LikedPetsEndpoint {
    @Getter
    @Autowired
    private LikedPetService likedPetService;

    @GetMapping("/likedPets")
    public List<Pet> getLikedPets(@RequestBody long userId) {
        return likedPetService.getLikedPets(userId);
    }
}