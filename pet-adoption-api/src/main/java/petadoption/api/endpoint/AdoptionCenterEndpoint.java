package petadoption.api.endpoint;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterService;
import petadoption.api.pet.Pet;
import petadoption.api.user.User;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/adoption-centers")
public class AdoptionCenterEndpoint {

    private final AdoptionCenterService adoptionCenterService;

    public AdoptionCenterEndpoint(AdoptionCenterService adoptionCenterService) {
        this.adoptionCenterService = adoptionCenterService;
    }

    @GetMapping
    public List<AdoptionCenter> displayCenters() {
        return adoptionCenterService.getAllAdoptionCenters();
    }

    @GetMapping("/sample")
    public String addSampleCenters() {
        adoptionCenterService.addSampleAdoptionCenters();
        return "Sample adoption centers added successfully.";
    }

    //
    @GetMapping("/{adoptionID}")
    public Optional<AdoptionCenter> getAdoptionCenter(@PathVariable Long adoptionID) {
        return adoptionCenterService.getCenter(adoptionID);
    }
}
