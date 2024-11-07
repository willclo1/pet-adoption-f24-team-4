package petadoption.api.recommendationEngine;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetRepository;

import java.util.List;

@Service
public class RecEngService {
    @Autowired
    private PetRepository petRepository;
    private static final long DEFAULT_NUM_PETS = 500;

    public List<Pet> getAllPets() { return petRepository.findAll(); }
    public List<Pet> getSamplePets(long numPets) { return petRepository.getRandom(numPets); }
    public List<Pet> getSamplePets() { return petRepository.getRandom(DEFAULT_NUM_PETS); }
}
