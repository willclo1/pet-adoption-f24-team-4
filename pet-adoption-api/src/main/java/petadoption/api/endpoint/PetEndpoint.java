package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterService;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetRequest;
import petadoption.api.pet.PetService;

import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
public class PetEndpoint {
    private PetService petService;
    private  AdoptionCenterService adoptionCenterService;
    public PetEndpoint(PetService petService, AdoptionCenterService adoptionCenterService) {
        this.petService = petService;
        this.adoptionCenterService = adoptionCenterService;
    }
    @PostMapping("/addPet")
    public ResponseEntity<?> addPet(@RequestBody PetRequest petRequest) {
        try{
            Optional<AdoptionCenter> adoptionCenter = adoptionCenterService.getCenter(petRequest.getAdoptionID());
            Pet pet = new Pet();
            pet.setFirstName(petRequest.getFirstName());
            pet.setLastName(petRequest.getLastName());
            pet.setPetType(petRequest.getPetType());
            pet.setWeight(petRequest.getWeight());
            pet.setFurType(petRequest.getFurType());
            pet.setCenter(adoptionCenter.get());

            petService.savePet(pet, adoptionCenter.get().getAdoptionID());
            log.info("Pet registered to adoption center " + pet.getCenter().getCenterName());
            return ResponseEntity.ok(pet);
        }catch (Exception e){
            log.error("Error adding pet User");
            return ResponseEntity.badRequest().build();
        }

    }
    @GetMapping("/pets")
    public ResponseEntity<?> getAllPets() {
        try {
            List<Pet> pets = petService.getAllPets();
            return ResponseEntity.ok(pets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching pets: " + e.getMessage());
        }
    }
    @GetMapping("/pets/{adoptionID}")
    public ResponseEntity<?> getAdoptionCenterPets() {
        try {
            List<Pet> pets = petService.getAllPets();
            return ResponseEntity.ok(pets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching pets: " + e.getMessage());
        }
    }

}
