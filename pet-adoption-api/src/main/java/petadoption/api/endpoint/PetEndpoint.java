package petadoption.api.endpoint;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import petadoption.api.adoptionCenter.AdoptionCenterService;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;

@RestController
public class PetEndpoint {
    PetService petService;
    public PetEndpoint(PetService petService) {
        this.petService = petService;
    }

//    public ResponseEntity<Pet> addPet(@RequestBody Pet pet) {
//
//    }
}
