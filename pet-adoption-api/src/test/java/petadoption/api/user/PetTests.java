package petadoption.api.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.Utility.Image;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterRepository;
import petadoption.api.adoptionCenter.AdoptionCenterService;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetRepository;
import petadoption.api.pet.PetService;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb") // Use test database configuration
public class PetTests {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private PetService petService;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    @Autowired
    private AdoptionCenterService adoptionCenterService;

    @BeforeEach
    void setUp() {
        petRepository.deleteAll();
        adoptionCenterRepository.deleteAll();
    }

    @Test
    void testSavePet() {
        Pet pet = new Pet("Buddy", new HashSet<>(Set.of("Species:Dog", "Size:Medium", "Age:2 years")));

        Pet savedPet = petService.savePet(pet);
        assertNotNull(savedPet.getId(), "Pet ID should not be null after saving.");
        assertEquals("Buddy", savedPet.getName(), "Pet name should match.");
    }

    @Test
    void testGetPetById() {
        Pet pet = new Pet("Whiskers", new HashSet<>(Set.of("Species:Cat", "Size:Small", "Age:1 year")));

        Pet savedPet = petService.savePet(pet);
        Optional<Pet> retrievedPet = petService.getPetById(savedPet.getId());

        assertTrue(retrievedPet.isPresent(), "Pet should be retrievable by ID.");
        assertEquals("Whiskers", retrievedPet.get().getName(), "Pet name should match.");
    }

    @Test
    void testGetAllPets() {
        Pet pet1 = new Pet("Buddy", new HashSet<>(Set.of("Species:Dog", "Size:Medium")));
        Pet pet2 = new Pet("Whiskers", new HashSet<>(Set.of("Species:Cat", "Size:Small")));

        petService.savePet(pet1);
        petService.savePet(pet2);

        List<Pet> pets = petService.getAllPets();
        assertEquals(2, pets.size(), "There should be 2 pets in the repository.");
    }

    @Test
    void testDeletePet() {
        Pet pet = new Pet("Buddy", new HashSet<>(Set.of("Species:Dog", "Size:Medium")));

        Pet savedPet = petService.savePet(pet);
        petService.deletePet(savedPet.getId());

        Optional<Pet> retrievedPet = petService.getPetById(savedPet.getId());
        assertTrue(retrievedPet.isEmpty(), "Pet should be deleted and not retrievable.");
    }

    @Test
    void testSavePetWithAdoptionCenter() {
        AdoptionCenter center = new AdoptionCenter();
        center.setCenterName("Happy Paws");
        center.setBuildingAddress("123 Adoption St, Waco, TX");
        center.setDescription("A loving shelter for pets.");

        AdoptionCenter savedCenter = adoptionCenterService.saveCenter(center);

        Pet pet = new Pet("Bella", new HashSet<>(Set.of("Species:Dog", "Size:Large")));
        Pet savedPet = petService.savePet(pet, savedCenter.getAdoptionID());

        assertNotNull(savedPet.getCenter(), "Pet should be associated with an adoption center.");
        assertEquals("Happy Paws", savedPet.getCenter().getCenterName(), "Adoption center name should match.");
    }

    @Test
    void testGetAdoptionCenterPets() {
        AdoptionCenter center = new AdoptionCenter();
        center.setCenterName("Happy Paws");
        center.setBuildingAddress("123 Adoption St, Waco, TX");
        center.setDescription("A loving shelter for pets.");

        AdoptionCenter savedCenter = adoptionCenterService.saveCenter(center);

        Pet pet1 = new Pet("Buddy", new HashSet<>(Set.of("Species:Dog", "Size:Medium")));
        Pet pet2 = new Pet("Whiskers", new HashSet<>(Set.of("Species:Cat", "Size:Small")));

        petService.savePet(pet1, savedCenter.getAdoptionID());
        petService.savePet(pet2, savedCenter.getAdoptionID());

        List<Pet> pets = petService.getAdoptionCenterPets(savedCenter.getAdoptionID());
        assertEquals(2, pets.size(), "There should be 2 pets associated with the adoption center.");
    }

    @Test
    void testRandomPets() {
        for (int i = 0; i < 10; i++) {
            Pet pet = new Pet("Pet" + i, new HashSet<>(Set.of("Species:Dog", "Size:Medium")));
            petService.savePet(pet);
        }

        List<Pet> randomPets = petService.getRandPets(5);
        assertEquals(5, randomPets.size(), "Random pets list size should be 5.");
    }
}