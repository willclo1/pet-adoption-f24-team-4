package petadoption.api.endpoint;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.likedPets.LikedPet;
import petadoption.api.likedPets.LikedPetService;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.recommendationEngine.RateAdoptedPetBody;
import petadoption.api.user.User;
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
    public ResponseEntity<String> addLikedPet(@RequestBody RateAdoptedPetBody body) {
        Optional<User> u = userService.findUser(body.userId);
        Optional<Pet> p = petService.getPetById(body.petId);
        if (u.isEmpty()) {
            log.error("[addLikedPet] Failed to find user: {}", body.userId);
            return ResponseEntity
                    .status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body("User not found");
        }
        if (p.isEmpty()) {
            log.error("[addLikedPet] Failed to find pet: {}", body.petId);
            return ResponseEntity
                    .status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body("Pet not found");
        }

        boolean alreadyLiked = likedPetService.existsByUserAndPet(u.get(), p.get());
        if (alreadyLiked) {
            log.info("[addLikedPet] Pet already liked by user: {}", body.userId);
            return ResponseEntity.ok("Pet already liked. No further action needed.");
        }

        LikedPet pet = new LikedPet(u.get(), p.get());
        LikedPet result
                = likedPetService.saveLikedPet(pet);

        if (result.equals(pet)) {
            return ResponseEntity.ok("Successfully added pet");
        }
        return ResponseEntity.internalServerError().body("Failed to add pet");
    }
}