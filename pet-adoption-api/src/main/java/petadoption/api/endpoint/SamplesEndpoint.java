package petadoption.api.endpoint;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterService;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;

import java.util.List;
import java.util.Random;

/**
 * @author Rafe Loya
 */
@Log4j2
@RestController
@RequestMapping("/samples")
public class SamplesEndpoint {
    @Getter
    private AdoptionCenterService adoptionCenterService;
    @Getter
    private PetService petService;

    public SamplesEndpoint() {
        this.adoptionCenterService = new AdoptionCenterService();
        this.petService = new PetService();
    }

    @GetMapping("/adoptionCenters")
    public String addSampleAdoptionCenters() {
        adoptionCenterService.addSampleAdoptionCenters();
        log.info("Sample Adoption Centers added");
        return "Sample Adoption Centers added";
    }

    @GetMapping("/petRandom")
    public String addRandomSamplePets(@RequestParam long numPets) {
        Random random = new Random();
        List<Pet> pets = petService.getRandPets(numPets);
        addPets(random, pets);

        log.info("Sample randomized Pets added: {}", numPets);
        return "Sample randomized Pets added: " + numPets;
    }

    @GetMapping("/petRandomDefault")
    public String addRandomPetsDefault() {
        Random random = new Random();
        List<Pet> pets = petService.getRandPets();
        addPets(random, pets);

        log.info("Sample randomized Pets added");
        return "Sample randomized Pets added";
    }

    @GetMapping("/petCurated")
    public String addCuratedPets() {
        try {
            petService.addSamplePets(adoptionCenterService);
        } catch (Exception e) {
            log.error("Failed to load curated pets:\n{}", e.getMessage());
            return "Failed to load curated pets:\n" + e.getMessage();
        }
        return "Curated sample pets added";
    }

    /**
     * Helper function for <code>addRandomPets()</code> and
     * <code>addRandomPetsDEfault()</code>
     *
     * @param random assigns <code>Pet</code> to random
     *               <code>AdoptionCenter</code>
     * @param pets   list of sample pets
     */
    private void addPets(Random random, List<Pet> pets) {
        List<AdoptionCenter> ac;

        // if no AdoptionCenters found, populate db w/ sample adoption centers
        if ((ac = adoptionCenterService.getAllAdoptionCenters()).isEmpty()) {
            addSampleAdoptionCenters();
            ac = adoptionCenterService.getAllAdoptionCenters();
        }

        for (Pet p : pets) {
            petService.savePet(
                    p,
                    ac.get(random.nextInt(ac.size())).getAdoptionID()
            );
        }
    }
}
