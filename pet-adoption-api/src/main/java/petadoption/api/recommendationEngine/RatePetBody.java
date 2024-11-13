package petadoption.api.recommendationEngine;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.pet.Pet;
import petadoption.api.userPreferences.UserPreferences;

@Data
public class RatePetBody {
    public long userId;

    public long pet;

    public boolean like;
}