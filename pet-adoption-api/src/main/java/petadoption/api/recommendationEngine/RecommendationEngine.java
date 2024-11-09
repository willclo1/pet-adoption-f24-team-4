package petadoption.api.recommendationEngine;

import lombok.extern.log4j.Log4j2;
import petadoption.api.pet.Pet;
import petadoption.api.pet.criteria.FurColor;
import petadoption.api.pet.criteria.Temperament;
import petadoption.api.pet.criteria.breed.CatBreed;
import petadoption.api.pet.criteria.breed.DogBreed;

@Log4j2
public class RecommendationEngine {
    public double calculateBreedRating(UserPreferences up, Pet p) {
        double rating = 0.0;

        switch(p.getSpecies()) {
            case CAT:
                for (CatBreed cb : p.getCatBreed()) {
                    rating += up.getCatBreedRating(cb);
                }
                break;
            case DOG:
                for (DogBreed db : p.getDogBreed()) {
                    rating += up.getDogBreedRating(db);
                }
                break;
            default:
                log.error(
                        "Unknown species encountered: {}",
                        p.getSpecies());
                throw new RuntimeException(
                        "Unknown species encountered: " + p.getSpecies()
                );
        }

        return rating;
    }

    public double calculateFurColorRating(UserPreferences up, Pet p) {
        double rating = 0.0;

        for (FurColor fc : p.getFurColor()) {
            rating += up.getFurColorRating(fc);
        }

        return rating;
    }

    public double calculateTemperamentRating(UserPreferences up, Pet p) {
        double rating = 0.0;

        for (Temperament t : p.getTemperament()) {
            rating += up.getTemperamentRating(t);
        }

        return rating;
    }

    public double calculatePetRating(UserPreferences up, Pet p) {
        double totalRating = 0.0;

        totalRating += up.getSpeciesRating(p.getSpecies());               // Species
        totalRating += calculateBreedRating(up, p);                       // Breed
        totalRating += up.getSizeRating(p.getPetSize());                  // Size
        totalRating += calculateFurColorRating(up, p);                    // Fur Color
        totalRating += up.getFurTypeRating(p.getFurType());               // Fur Type
        totalRating += up.getCoatLengthRating(p.getCoatLength());         // Coat Length
        totalRating += up.getAgeRating(p.getAge());                       // Age
        totalRating += calculateTemperamentRating(up, p);                 // Temperament
        totalRating += up.getHealthRating(p.getHealthStatus());           // Health
        totalRating += up.getSpayedNeuteredRating(p.getSpayedNeutered()); // Spayed / Neutered
        totalRating += up.getSexRating(p.getSex());                       // Sex

        return totalRating;
    }
}
