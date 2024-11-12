package petadoption.api.recommendationEngine;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.pet.Pet;
import petadoption.api.userPreferences.UserPreferences;

@Data
public class RatePetBody {
    @Getter
    @Setter
    private UserPreferences userPreferences;

    @Getter
    @Setter
    private Pet pet;

    @Setter
    private boolean like;

    public boolean wasLiked() {
        return like;
    }
}