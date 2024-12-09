package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterRequest;
import petadoption.api.adoptionCenter.AdoptionCenterService;

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


    @PostMapping("/add")
    public ResponseEntity<AdoptionCenter> addAdoptionCenter(@RequestBody AdoptionCenterRequest request) {
        System.out.println("2");
        try{
            AdoptionCenter center = new AdoptionCenter();
            center.setCenterName(request.getAdoptionName());
            center.setBuildingAddress(request.getAdoptionAddress());
            center.setDescription(request.getDescription());
            AdoptionCenter savedCenter = adoptionCenterService.saveCenter(center);
            log.info("Center saved!");
            return ResponseEntity.ok(savedCenter);
        }
        catch (Exception e){
            log.info("Center Failed!");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{adoptionID}")
    public Optional<AdoptionCenter> getAdoptionCenter(@PathVariable Long adoptionID) {
        System.out.println("3");
        return adoptionCenterService.getCenter(adoptionID);
    }

    @PutMapping("/updateAdoptionCenter")
    public ResponseEntity<AdoptionCenter> updateAdoptionCenter(@RequestBody AdoptionCenter ACRequest) {
        try {
            System.out.println("4");
            Optional<AdoptionCenter> ACOpt = adoptionCenterService.getCenter(ACRequest.getAdoptionID());
            if (!ACOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            AdoptionCenter AC = ACOpt.get();

            AC.setCenterName(ACRequest.getCenterName());
            AC.setBuildingAddress(ACRequest.getBuildingAddress());
            AC.setDescription(ACRequest.getDescription());

            adoptionCenterService.saveCenter(AC);

            log.info(
                    "AdoptionCenter successfully updated: {} {}",
                    AC.getAdoptionID(),
                    AC.getCenterName()
            );

            return ResponseEntity.ok(AC);
        } catch (Exception e) {
            log.error(
                    "Failed to update AdoptionCenter: {} {}\n{}",
                    ACRequest.getAdoptionID(),
                    ACRequest.getCenterName(),
                    e.getMessage()
            );
            return ResponseEntity.badRequest().build();
        }
    }
}
