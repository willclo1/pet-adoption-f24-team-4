package petadoption.api.adoptionCenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdoptionCenterService {
    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    public Optional<AdoptionCenter> findByCenterId(Long id) { return adoptionCenterRepository.findById(id); }

    public AdoptionCenter save(AdoptionCenter adoptionCenter) { return adoptionCenterRepository.save(adoptionCenter); }

    public Optional<AdoptionCenter> findByUserId(Long id) { return adoptionCenterRepository.findByUserId(id); }

}
