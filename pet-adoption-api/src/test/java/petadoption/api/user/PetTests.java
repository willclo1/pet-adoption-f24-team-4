package petadoption.api.user;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.pet.*;
import petadoption.api.pet.criteria.Size;
import petadoption.api.pet.criteria.Temperament;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb")  // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional
public class PetTests {

    @Autowired
    private PetService petService;

    @Autowired
    private PetRepository petRepository;

    @BeforeEach
    void setUp() {
        petRepository.deleteAll();
    }

    @Test
    void testSavePetWithoutAdoptionCenter() {
        Pet pet = new Pet();
        pet.setFirstName("Buddy");
        pet.setLastName("Smith");
        pet.setPetType("Dog");
        pet.setWeight(10);
        pet.setFurType("Short");
        pet.setBreed("Beagle");
        pet.setPetSize(Size.SMALL);
        pet.setAge(3);
        pet.setTemperament(Temperament.AGGRESSIVE);
        pet.setHealthStatus("Healthy");

        Pet savedPet = petService.savePet(pet, null);

        assertNotNull(savedPet.getId(), "Pet ID should be generated");
        assertEquals("Buddy", savedPet.getFirstName(), "Pet's first name should be Buddy");
    }

    @Test
    void testGetPetById() {
        Pet pet = new Pet();
        pet.setFirstName("Max");
        pet.setLastName("Johnson");
        pet.setPetType("Cat");
        pet.setWeight(8);
        pet.setFurType("Long");
        pet.setBreed("Maine Coon");
        pet.setPetSize(Size.LARGE);
        pet.setAge(5);
        pet.setTemperament(Temperament.CHILL);
        pet.setHealthStatus("Good");

        Pet savedPet = petService.savePet(pet, null);

        Optional<Pet> retrievedPet = petService.getPetById(savedPet.getId());

        assertTrue(retrievedPet.isPresent(), "Pet should be present");
        assertEquals("Max", retrievedPet.get().getFirstName(), "Pet's first name should be Max");
    }

    @Test
    void testDeletePet() {
        Pet pet = new Pet();
        pet.setFirstName("Bella");
        pet.setLastName("Davis");
        pet.setPetType("Dog");
        pet.setWeight(15);
        pet.setFurType("Curly");
        pet.setBreed("Poodle");
        pet.setPetSize(Size.MEDIUM);
        pet.setAge(4);
        pet.setTemperament(Temperament.AGGRESSIVE);
        pet.setHealthStatus("Excellent");

        Pet savedPet = petService.savePet(pet, null);


        petService.deletePet(savedPet.getId());

        Optional<Pet> deletedPet = petService.getPetById(savedPet.getId());
        assertFalse(deletedPet.isPresent(), "Pet should be deleted");
    }

    @Test
    void testGetAllPets() {
        Pet pet1 = new Pet();
        pet1.setFirstName("Charlie");
        pet1.setLastName("Wilson");
        pet1.setPetType("Dog");
        pet1.setWeight(12);
        pet1.setFurType("Short");
        pet1.setBreed("Labrador");
        pet1.setPetSize(Size.LARGE);
        pet1.setAge(6);
        pet1.setTemperament(Temperament.CHILL);
        pet1.setHealthStatus("Healthy");

        Pet pet2 = new Pet();
        pet2.setFirstName("Lucy");
        pet2.setLastName("Smith");
        pet2.setPetType("Cat");
        pet2.setWeight(9);
        pet2.setFurType("Smooth");
        pet2.setBreed("Siamese");
        pet2.setPetSize(Size.SMALL);
        pet2.setAge(2);
        pet2.setTemperament(Temperament.NEEDY);
        pet2.setHealthStatus("Good");

        petService.savePet(pet1, null);
        petService.savePet(pet2, null);

        List<Pet> pets = petService.getAllPets();

        assertEquals(2, pets.size(), "There should be 2 pets in the database");
    }
}
