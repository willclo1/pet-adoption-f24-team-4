package petadoption.api.likedPets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LikedPetService {
    @Autowired
    private LikedPetRepository likedPetRepository;

    @Autowired
    private PetRepository petRepository;

    public List<Pet> getLikedPets(Long userId) {
        List<LikedPet> likedPets = likedPetRepository.findAllByUserId(userId);
        List<Pet> petList = new ArrayList<>();

        for (LikedPet likedPet : likedPets) {
            Optional<Pet> pet = petRepository.findById(likedPet.getPet().getId());
            pet.ifPresent(petList::add);
        }

        return petList;
    }

    public LikedPet saveLikedPet(LikedPet likedPet) {
        return likedPetRepository.save(likedPet);
    }
}
