package petadoption.api.adoptionCenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdoptionCenterService {
    @Autowired
    AdoptionCenterRepository repository;

    public AdoptionCenterService() {}

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

    public  void addSampleAdoptionCenters() {
        try {
            List<AdoptionCenter> sampleCenters = List.of(
                    new AdoptionCenter("Happy Paws Center", "123 Main St, Austin, TX", "A friendly place for pets."),
                    new AdoptionCenter("Forever Home Haven", "456 Elm St, Dallas, TX", "Providing forever homes to pets."),
                    new AdoptionCenter("Tail Waggers Shelter", "789 Oak St, Houston, TX", "Dedicated to rescuing pets in need."),
                    new AdoptionCenter("Purr Paradise", "101 Maple Ave, San Antonio, TX", "Specialized in cat adoptions."),
                    new AdoptionCenter("Furry Friends Refuge", "202 Birch Rd, Fort Worth, TX", "Helping furry friends find new families.")
            );

            List<AdoptionCenter> savedCenters = sampleCenters.stream()
                    .map(repository::save)
                    .toList();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
