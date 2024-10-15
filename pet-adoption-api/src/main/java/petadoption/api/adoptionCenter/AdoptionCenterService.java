package petadoption.api.adoptionCenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class AdoptionCenterService {
    @Autowired
    AdoptionCenterRepository repository;
    public AdoptionCenterService(AdoptionCenterRepository repository) {
        this.repository = repository;
    }

    public Optional<AdoptionCenter> getCenter(Long centerID){
        return repository.findById(centerID);
    }

    public AdoptionCenter saveCenter(AdoptionCenter center) {
        return repository.save(center);
    }

    public List<AdoptionCenter> getAllAdoptionCenters() {
        return repository.findAll();
    }


    public void addSampleAdoptionCenters() {
        // Create a list of sample adoption centers
        List<AdoptionCenter> sampleCenters = Arrays.asList(
                new AdoptionCenter("Happy Paws Rescue"),
                new AdoptionCenter("Furry Friends Shelter"),
                new AdoptionCenter("Pawtastic Haven"),
                new AdoptionCenter("Animal Lovers Alliance"),
                new AdoptionCenter("Compassionate Critters"),
                new AdoptionCenter("Safe Haven Animal Shelter"),
                new AdoptionCenter("Forever Home Animal Rescue"),
                new AdoptionCenter("Loving Paws Sanctuary"),
                new AdoptionCenter("Whiskers and Wags Shelter"),
                new AdoptionCenter("Hopeful Hearts Animal Rescue")
        );

        // Save all sample centers to the repository
        repository.saveAll(sampleCenters);
    }
}
