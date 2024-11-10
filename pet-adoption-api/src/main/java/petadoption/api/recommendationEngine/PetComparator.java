package petadoption.api.recommendationEngine;

import petadoption.api.pet.Pet;

import java.util.Comparator;
import java.util.Map;

public class PetComparator implements Comparator<Map.Entry<Pet, Double>> {
    @Override
    public int compare(Map.Entry<Pet, Double> o1, Map.Entry<Pet, Double> o2) {
        return o1.getValue().compareTo(o2.getValue());
    }
}
