package petadoption.api.adoptionCenter;

import lombok.Data;

@Data
public class AdoptionCenterRequest {
    String adoptionName;
    String description;
    String adoptionAddress;
}

