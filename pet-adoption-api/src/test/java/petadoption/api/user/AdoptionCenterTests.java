package petadoption.api.user;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterRepository;
import petadoption.api.adoptionCenter.AdoptionCenterService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb")  // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional
public class AdoptionCenterTests {

    @Autowired
    private AdoptionCenterService adoptionCenterService;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    @BeforeEach
    void setUp() {
        adoptionCenterRepository.deleteAll();  // Clear all records before each test
    }

    @Test
    void testSaveAdoptionCenter() {
        AdoptionCenter center = new AdoptionCenter();
        center.setCenterName("Happy Tails Sanctuary");
        center.setBuildingAddress("123 Pet Lane,Cityville,ST");
        center.setDescription("A loving sanctuary for pets of all kinds.");

        AdoptionCenter savedCenter = adoptionCenterService.saveCenter(center);

        assertNotNull(savedCenter.getAdoptionID(), "Adoption center ID should be generated");
        assertEquals("Happy Tails Sanctuary", savedCenter.getCenterName(), "Center name should be Happy Tails Sanctuary");
    }

    @Test
    void testGetAdoptionCenterById() {
        AdoptionCenter center = new AdoptionCenter();
        center.setCenterName("Furry Friends Shelter");
        center.setBuildingAddress("456 Fur Street,PetTown,TX");
        center.setDescription("A friendly shelter for furry friends.");

        AdoptionCenter savedCenter = adoptionCenterService.saveCenter(center);

        Optional<AdoptionCenter> retrievedCenter = adoptionCenterService.getCenter(savedCenter.getAdoptionID());

        assertTrue(retrievedCenter.isPresent(), "Adoption center should be present");
        assertEquals("Furry Friends Shelter", retrievedCenter.get().getCenterName(), "Center name should be Furry Friends Shelter");
    }
    @Test
    void testSaveAdoptionCenterWithLongDescription() {
        AdoptionCenter center = new AdoptionCenter();
        center.setCenterName("Compassionate Critters");
        center.setBuildingAddress("789 Shelter Way, Rescue City, CA");

        String longDescription = "This is an incredibly long description that exceeds the 150 character limit for the description field. "
                + "It should be truncated to meet the length requirements.";
        center.setDescription(longDescription);


        AdoptionCenter savedCenter = adoptionCenterService.saveCenter(center);

        assertEquals(150, savedCenter.getDescription().length(), "Description should be truncated to 150 characters");
    }

    @Test
    void testGetAllAdoptionCenters() {
        AdoptionCenter center1 = new AdoptionCenter();
        center1.setCenterName("Pawtastic Haven");
        center1.setBuildingAddress("123 Main St, Paw City, NY");
        center1.setDescription("A haven for paw-some pets.");

        AdoptionCenter center2 = new AdoptionCenter();
        center2.setCenterName("Cool Center");
        center2.setBuildingAddress("456 Rescue Rd, Fur Town, NJ");
        center2.setDescription("We find forever homes for animals in need.");

        adoptionCenterService.saveCenter(center1);
        adoptionCenterService.saveCenter(center2);


        List<AdoptionCenter> centers = adoptionCenterService.getAllAdoptionCenters();


        assertEquals(2, centers.size(), "There should be 2 adoption centers in the database");
    }
}