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
}
