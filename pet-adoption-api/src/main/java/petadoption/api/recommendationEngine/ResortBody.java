package petadoption.api.recommendationEngine;

import petadoption.api.pet.Pet;
import petadoption.api.userPreferences.UserPreferences;

import java.util.List;

public class ResortBody {
    public Long userId;
    public List<Pet> sample;
}
