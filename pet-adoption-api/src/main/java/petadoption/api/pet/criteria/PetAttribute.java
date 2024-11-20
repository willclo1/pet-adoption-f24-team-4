package petadoption.api.pet.criteria;

import jakarta.persistence.*;
import lombok.Getter;
import petadoption.api.userPreferences.Preference;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = PetAttribute.TABLE_NAME)
public class PetAttribute {
    public static final String TABLE_NAME = "pet_attribute";

    /**
     * Lists of allowed strings for input
     */
    public static final String[] typesList = {
            "Species",
            "Cat Breed",
            "Dog Breed",
            "Fur Type",
            "Fur Color",
            "Fur Length",
            "Size",
            "Health",
            "Gender",
            "Spayed / Neutered",
            "Temperament",
            "Age",
            "Weight"
    };

    public static final String[] speciesList = {
            "Cat",
            "Dog"
    };

    public static final String[] catBreedsList = {
            "Domestic Shorthair", // Equivalent to mixed / mix-breed
            "Domestic Longhair",

            // A
            "Abyssinian",
            "American Bobtail",
            "American Curl",
            "American Shorthair",
            "American Wirehair",
            "Australian Mist",

            // B
            "Balinese",
            "Bengal",
            "Birman",
            "Bombay",
            "British Longhair",
            "British Shorthair",
            "Burmese",
            "Burmilla",

            // C
            "Chartreux",
            "Chausie",
            "Colorpoint Shorthair",
            "Cornish Rex",

            // D
            "Devon Rex",
            "Donskoy",
            "Domestic Shorthair",
            "Domestic Longhair",

            // E
    };

    public static final String[] dogBreedsList = {
            "Mix-Breed",

            // A
            "Affenpinscher",
            "Afghan Hound",
            "Airedale Terrier",
            "Akita",
            "Alaskan Husky",
            "Alaskan Klee Kai",
            "Alaskan Malamute",
            "American Bulldog",
            "American English Coonhound",
            "American Eskimo Dog",
            "American Foxhound",
            "American Hairless Terrier",
            "American Leopard Hound",
            "American Pitbull Terrier",
            "American Staffordshire Terrier",
            "American Water Spaniel",
            "Anatolian Shepherd Dog",
            "Appenzeller Sennenhund",
            "Australian Cattle Dog",
            "Australian Kelpie",
            "Australian Shepherd",
            "Australian Stumpy Tail Cattle Dog",
            "Australian Terrier",
            "Azawakh",
    };

    public static final String[] furTypeList = {
            "Hairless",
            "Smooth",
            "Silky",
            "Curly",
            "Rough",
            "Wiry",
            "Double",
            "Wavy",
            "Corded"
    };

    public static final String[] furColorList = {
            "White",
            "Black",
            "Brown",
            "Gray",
            "Mixed Color",
    };

    public static final String[] furLengthList = {
            "Hairless",
            "Short",
            "Medium",
            "Long",
    };

    public static final String[] sizeList = {
            "Extra Small",
            "Small",
            "Medium",
            "Large",
            "Extra Large"
    };

    public static final String[] healthList = {
            "Excellent",
            "Good",
            "Fair",
            "Poor"
    };

    public static final String[] genderList = {
            "Male",
            "Female",
    };

    public static final String[] temperamentList = {
            "Chill",      // willclo1
            "Needy",      // willclo1
            "Aggressive", // willclo1
            "Energetic",  // willclo1
            "Friendly",
            "Bold",
            "Lively",
            "Focused",
            "Curious",
            "Skittish",
            "Timid",
    };

    public static final String[] spayedNeuteredList = {
            "Y",
            "N"
    };

    //=======================================================================//

    /**
     * For quick verification / lookups of attributes
     */

    public static final Set<String> types
            = new HashSet<>(Arrays.asList(typesList));
    public static final Set<String> species
            = new HashSet<>(Arrays.asList(speciesList));
    public static final Set<String> catBreeds
            = new HashSet<>(Arrays.asList(catBreedsList));
    public static final Set<String> dogBreeds
            = new HashSet<>(Arrays.asList(dogBreedsList));
    public static final Set<String> furTypes
            = new HashSet<>(Arrays.asList(furTypeList));
    public static final Set<String> furColors
            = new HashSet<>(Arrays.asList(furColorList));
    public static final Set<String> furLengths
            = new HashSet<>(Arrays.asList(furLengthList));
    public static final Set<String> sizes
            = new HashSet<>(Arrays.asList(sizeList));
    public static final Set<String> health
            = new HashSet<>(Arrays.asList(healthList));
    public static final Set<String> gender
            = new HashSet<>(Arrays.asList(genderList));
    public static final Set<String> temperament
            = new HashSet<>(Arrays.asList(temperamentList));
    public static final Set<String> spayedNeutered
            = new HashSet<>(Arrays.asList(spayedNeuteredList));

    //=======================================================================//

    /**
     * Data members
     */

    @Id
    @JoinColumn(name = "petID", referencedColumnName = "petID", nullable = false)
    private Long id;

    @Getter
    @Column(name = "type")
    private String type;

    @Getter
    @Column(name = "attribute")
    private String attribute;

    //=======================================================================//

    /**
     * Functions
     */

    public PetAttribute() {}

    public PetAttribute(String type, String attribute) {
        if (PetAttribute.verifyPetAttribute(type, attribute)) {
            this.type = type;
            this.attribute = attribute;
        }
    }

    public boolean compare(PetAttribute pa) {
        return (this.type != null && this.type.equals(pa.getType())
                && this.attribute != null && this.attribute.equals(pa.getAttribute()));
    }

    public boolean comparePreference(Preference p) {
        return (this.type != null && this.type.equals(p.getType())
                && this.attribute != null && this.attribute.equals(p.getAttribute()));
    }

    /**
     * Static / Utility functions
     */

    public static boolean verifyType(String type) {
        return types.contains(type);
    }

    public static boolean verifyPetAttribute(PetAttribute pa) {
        if (types.contains(pa.type)) {
            return switch (pa.type) {
                case "Species" -> species.contains(pa.attribute);
                case "Cat Breed" -> catBreeds.contains(pa.attribute);
                case "Dog Breed" -> dogBreeds.contains(pa.attribute);
                case "Fur Type" -> furTypes.contains(pa.attribute);
                case "Fur Color" -> furColors.contains(pa.attribute);
                case "Fur Length" -> furLengths.contains(pa.attribute);
                case "Size" -> sizes.contains(pa.attribute);
                case "Health" -> health.contains(pa.attribute);
                case "Gender" -> gender.contains(pa.attribute);
                case "Temperament" -> temperament.contains(pa.attribute);
                case "Spayed / Neutered" -> spayedNeutered.contains(pa.attribute);
                case "Age" ->
                    // 1-99
                    (pa.attribute.matches("^([1-9][0-9]?)$"));
                case "Weight" ->
                    // 1-999
                    (pa.attribute.matches("^([1-9][0-9]{0,2})$"));
                default -> false;
            };
        }

        return false;
    }

    public static boolean verifyPetAttribute(String type, String attribute) {
        if (types.contains(type)) {
            return switch (type) {
                case "Species" -> species.contains(attribute);
                case "Cat Breed" -> catBreeds.contains(attribute);
                case "Dog Breed" -> dogBreeds.contains(attribute);
                case "Fur Type" -> furTypes.contains(attribute);
                case "Fur Color" -> furColors.contains(attribute);
                case "Fur Length" -> furLengths.contains(attribute);
                case "Size" -> sizes.contains(attribute);
                case "Health" -> health.contains(attribute);
                case "Gender" -> gender.contains(attribute);
                case "Temperament" -> temperament.contains(attribute);
                case "Spayed / Neutered" -> spayedNeutered.contains(attribute);
                case "Age" ->
                    // 1-99
                    (attribute.matches("^([1-9][0-9]?)$"));
                case "Weight" ->
                    // 1-999
                    (attribute.matches("^([1-9][0-9]{0,2})$"));
                default -> false;
            };
        }

        return false;
    }
}