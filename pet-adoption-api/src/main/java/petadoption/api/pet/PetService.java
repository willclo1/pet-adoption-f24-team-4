package petadoption.api.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterRepository;

import java.util.Optional;

@Service
public class PetService {
    @Autowired
    PetRepository repository;

    public Optional<Pet> getCenter(Long petID){
        return repository.findById(petID);
    }
    public Pet saveCenter(Pet pet) {
        return repository.save(pet);
    }
}
