package petadoption.api.recommendationEngine;

import lombok.Data;

@Data
public class RatePetBody {
    public long userId;

    public long petId;

    public boolean like;
}