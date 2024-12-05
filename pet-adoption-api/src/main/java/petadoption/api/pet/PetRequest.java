package petadoption.api.pet;

import lombok.Data;

import java.util.Set;

@Data
public class PetRequest {
    public String name;
    public Long id;
    public Long adoptionID;
    public Set<String> attributes;
}
