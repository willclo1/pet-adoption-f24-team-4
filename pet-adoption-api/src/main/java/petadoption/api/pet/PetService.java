package petadoption.api.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterRepository;
import petadoption.api.adoptionCenter.AdoptionCenterService;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {
    @Autowired
    PetRepository repository;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    public Optional<Pet> savePet(Long petID){
        return repository.findById(petID);
    }
    public Pet savePet(Pet pet, Long adoptionID) {
        if(adoptionID != null) {
            Optional<AdoptionCenter> center = adoptionCenterRepository.findById(adoptionID);
            if (center.isPresent()) {
                pet.setCenter(center.get());
            } else {
                throw new RuntimeException("Adoption Center not found.");
            }


        }
        return repository.save(pet);

    }

    public Optional<Pet> getPetById(long petId){
        return repository.findById(petId);
    }

    public List<Pet> getAllPets() {
        return repository.findAll();
    }
    public List<Pet> getAdoptionCenterPets(long adoptionID) {
        return repository.findByCenter_adoptionID(adoptionID);
    }
    public void deletePet(long petID){
        repository.deleteById(petID);
    }
}
