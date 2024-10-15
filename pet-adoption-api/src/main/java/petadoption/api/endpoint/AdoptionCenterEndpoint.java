package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterService;
import petadoption.api.pet.Pet;
import petadoption.api.user.User;

import java.util.List;
import java.util.Optional;

@Log4j2
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

    @PutMapping("/updateAdoptionCenter")
    public ResponseEntity<AdoptionCenter> updateAdoptionCenter(@RequestBody AdoptionCenter ACRequest) {
        try {
            Optional<AdoptionCenter> ACOpt = adoptionCenterService.getCenter(ACRequest.getAdoptionID());
            if (!ACOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            AdoptionCenter AC = ACOpt.get();

            //AC.setAdoptionID(ACRequest.getAdoptionID());
            AC.setCenterName(ACRequest.getCenterName());
            AC.setBuildingAddress(ACRequest.getBuildingAddress());
            AC.setDescription(ACRequest.getDescription());

            adoptionCenterService.saveCenter(AC);

            log.info("AdoptionCenter successfully updated: "
                    + AC.getAdoptionID()
                    + AC.getCenterName()
            );

            return ResponseEntity.ok(AC);
        } catch (Exception e) {
            log.error("Failed to update AdoptionCenter: "
                    + ACRequest.getAdoptionID() + " "
                    + ACRequest.getCenterName()
                    + "\n" + e.getMessage()
            );
            return ResponseEntity.badRequest().build();
        }
    }
}
