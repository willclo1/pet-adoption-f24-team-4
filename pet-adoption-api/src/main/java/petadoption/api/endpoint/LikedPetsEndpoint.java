package petadoption.api.endpoint;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.likedPets.LikedPet;
import petadoption.api.likedPets.LikedPetService;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.recommendationEngine.RateAdoptedPetBody;
import petadoption.api.user.UserService;

import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
@RequestMapping("/likedPets")
public class LikedPetsEndpoint {
    @Getter
    @Autowired
    private LikedPetService likedPetService;

    @Getter
    @Autowired
    private UserService userService;

    @Getter
    @Autowired
    private PetService petService;

    @GetMapping("/getPets/{userID}")
    public List<Pet> getLikedPets(@PathVariable long userID) {
        return likedPetService.getLikedPets(userID);
    }

    /*
     * I know it's using a RatedPetBody, dont worry about it :(
     */
    @PostMapping("/addPet")
    public ResponseEntity<LikedPet> addLikedPet(@RequestBody RateAdoptedPetBody body) {
        try {

            LikedPet result = likedPetService.saveLikedPets(new LikedPet(
                    userService.findUser(body.userId).get(),
                    petService.getPetById(body.petId).get())
            );
            return ResponseEntity.ok(result);
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}