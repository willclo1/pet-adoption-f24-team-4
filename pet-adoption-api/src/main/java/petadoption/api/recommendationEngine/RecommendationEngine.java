package petadoption.api.recommendationEngine;

import petadoption.api.pet.Pet;

public class RecommendationEngine {
    public double calculateBreedRating(UserPreferences up, Pet p) {
        double rating = 0.0;

        /*
        for (Map.Entry<Breed, Double> entry : p.getBreed()) {
            if (up.breed.containsKey(entry.getKey())) {
                rating += entry.getValue()
            }
        }
        */

        return rating;
    }

    public double calculateFurRating(UserPreferences up, Pet p) {
        double rating = 0.0;

        /*
        for (Map.Entry<FurColor, Double> entry : p.getFurColor()) {
            if (up.furColor.containsKey(entry.getKey())) {
                rating += entry.getValue();
            }
        }
        */

        return rating;
    }

    public double calculateTemperamentRating(UserPreferences up, Pet p) {
        double rating = 0.0;

        /*
        for (Map.Entry<Temperament, Double> entry : p.getTemperament()) {
            if (up.temperament.containsKey(entry.getKey())) {
                rating += entry.getValue();
            }
        }
        */

        return rating;
    }

    public double calculateTotalRating(UserPreferences up, Pet p) {
        double totalRating = 0.0;

        /*
        totalRating += up.getSpeciesRating(p.Species);
        totalRating += calculateBreedRating(up, p);
        totalRating += up.getSizeRating(p.size);
        totalRating += calculateFurColorRating(up, p);
        totalRating += up.getCoatLengthRating(p.coatLength);
        totalRating += up.getAgeRating(p.age);
        totalRating += calculateTemperamentRating(up, p);
        totalRating += up.getHealthRating(p.health);
        */

        /*
        for (int i = 0; i < Criteria.numCriteria; i++) {
            /*
            for (Map.Entry<Criteria, Double> entry
                    : up.preferences.get(i).entrySet()) {

            }
            */

            // ! Pet Criteria as List<List<Criteria>> / List<Set<Criteria>>
            /*
            for (Criteria petC : p.criteria.get(i)) {
                if (up.preferences.get(i).ContainsKey(petC)) {
                    totalRating += up.preferences.getRating(petC);
                }
            }
        }
        */

        return totalRating;
    }
}
