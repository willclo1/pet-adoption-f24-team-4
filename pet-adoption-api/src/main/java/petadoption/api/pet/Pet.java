package petadoption.api.pet;

import jakarta.persistence.*;
import lombok.Data;
import petadoption.api.Utility.Image;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.pet.criteria.*;
import petadoption.api.pet.criteria.breed.CatBreed;
import petadoption.api.pet.criteria.breed.DogBreed;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = Pet.TABLE_NAME)
public class Pet {
    public static final String TABLE_NAME = "Pets";
    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "petID")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany
    @Column(name = "attributes")
    private HashSet<PetAttribute> attributes;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "PICTURE_ID", referencedColumnName = "id")
    private Image profilePicture;

    @ManyToOne
    @JoinColumn(name = "adoptionID", referencedColumnName = "adoptionID", nullable = true)
    private AdoptionCenter center;

    public Pet(String name, HashSet<PetAttribute> attributes) {
        this.name = name;
        this.attributes = attributes;
    }

    public Pet() {}

    public void setAttributes(HashSet<PetAttribute> attributes) {
        boolean species = false,
                catBreed = false,
                dogBreed = false,
                furType = false,
                furColor = false,
                furLength = false,
                size = false,
                health = false,
                gender = false,
                spayedNeutered = false,
                temperament = false,
                age = false,
                weight = false;
        String speciesType = "";

        /* Although a set would prohibit multiple elements,
         * this attribute checking is intended to ensure the following:
         *      - There is at least one occurrence of necessary attributes
         *      - Attributes that can only appear a single time do not
         *          have multiple entries (ex. age, gender, species, etc.)
         *      - Species only have breeds that are relevant to them
         *          (i.e. a cat does not contain dog breeds, v.v.)
         */
        for (PetAttribute attribute : attributes) {
            switch (attribute.getType()) {
                case "Species":
                    if (species) {
                        throw new RuntimeException("Multiple species records found");
                    }
                    speciesType = attribute.getAttribute();
                    species = true;
                    break;
                case "Cat Breed":
                    catBreed = true;
                    break;
                case "Dog Breed":
                    dogBreed = true;
                    break;
                case "Fur Type":
                    if (furType) {
                        throw new RuntimeException("Multiple fur type records found");
                    }
                    furType = true;
                    break;
                case "Fur Color":
                    furColor = true;
                    break;
                case "Fur Length":
                    if (furLength) {
                        throw new RuntimeException("Multiple fur length records found");
                    }
                    furLength = true;
                    break;
                case "Size":
                    if (size) {
                        throw new RuntimeException("Multiple size records found");
                    }
                    size = true;
                    break;
                case "Health":
                    if (health) {
                        throw new RuntimeException("Multiple health records found");
                    }
                    health = true;
                    break;
                case "Gender":
                    if (gender) {
                        throw new RuntimeException("Multiple gender records found");
                    }
                    gender = true;
                    break;
                case "Spayed / Neutered":
                    if (spayedNeutered) {
                        throw new RuntimeException("Multiple spayed neutered records found");
                    }
                    spayedNeutered = true;
                    break;
                case "Temperament":
                    temperament = true;
                    break;
                case "Age":
                    if (age) {
                        throw new RuntimeException("Multiple age records found");
                    }
                    age = true;
                    break;
                case "Weight":
                    if (weight) {
                        throw new RuntimeException("Multiple weight records found");
                    }
                    weight = true;
            }
        }
        if (!species) {
            throw new RuntimeException("Species was not specified in attributes");
        }
        if (speciesType.equals("Cat")) {
            if (!catBreed) {
                throw new RuntimeException("No cat breeds found for cat");
            }
            if (dogBreed) {
                throw new RuntimeException("Dog breeds detected for cat");
            }
        }
        if (speciesType.equals("Dog")) {
            if (!dogBreed) {
                throw new RuntimeException("No dog breeds found for dog");
            }
            if (catBreed) {
                throw new RuntimeException("Cat breeds detected for dog");
            }
        }
        if (!furType) {
            throw new RuntimeException("No fur type records found for pet");
        }
        if (!furColor) {
            throw new RuntimeException("No fur color records found for pet");
        }
        if (!size) {
            throw new RuntimeException("No size records found for pet");
        }
        if (!health) {
            throw new RuntimeException("No health records found for pet");
        }
        if (!gender) {
            throw new RuntimeException("No gender records found for pet");
        }
        if (!spayedNeutered) {
            throw new RuntimeException("No spayed neutered records found for pet");
        }
        if (!temperament) {
            throw new RuntimeException("No temperament records found for pet");
        }
        if (!age) {
            throw new RuntimeException("No age records found for pet");
        }
        if (!weight) {
            throw new RuntimeException("No weight records found for pet");
        }

        this.attributes = attributes;
    }

    public String toString() {
        StringBuilder str = new StringBuilder();

        str.append("//==============================================//\n");
        str.append("[id]   ").append(this.id).append("\n");
        str.append("[name] ").append(this.name).append("\n");
        str.append("[attributes]\n");
        for (PetAttribute attr : this.attributes) {
            str.append("\t [").append(attr.getType()).append("] ")
                    .append(attr.getAttribute()).append("\n");
        }
        str.append("[Adoption Center] ").append(this.center).append("\n");

        return str.toString();
    }
    /*
    @Enumerated(EnumType.STRING)
    @Column(name = "SPECIES")
    private Species species;

    @Column(name = "WEIGHT")
    private int weight;

    @Enumerated(EnumType.STRING)
    @Column(name = "COAT_LENGTH")
    private CoatLength coatLength;

    @Enumerated(EnumType.STRING)
    @Column(name = "FUR_TYPE")
    private FurType furType;

    @Enumerated(EnumType.STRING)
    @Column(name = "FUR_COLOR")
    private Set<FurColor> furColor;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "PICTURE_ID", referencedColumnName = "id")
    private Image profilePicture;

    @ManyToOne
    @JoinColumn(name = "adoptionID", referencedColumnName = "adoptionID", nullable = true)
    private AdoptionCenter center;

    @Enumerated(EnumType.STRING)
    @Column(name = "DOG_BREED") // Added breed column
    private Set<DogBreed> dogBreed;

    @Enumerated(EnumType.STRING)
    @Column(name = "CAT_BREED") // Added breed column
    private Set<CatBreed> catBreed;

    @Enumerated(EnumType.STRING) // Use this annotation if petSize is an enum
    @Column(name = "PET_SIZE") // Added petSize column
    private Size petSize;

    @Column(name = "AGE") // Added age column
    private int age;

    @Enumerated(EnumType.STRING)
    @Column(name = "TEMPERAMENT") // Added temperament column
    private Set<Temperament> temperament;

    @Enumerated(EnumType.STRING)
    @Column(name = "HEALTH_STATUS") // Added healthStatus column
    private Health healthStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "SPAYED_NEUTERED")
    private SpayedNeutered spayedNeutered;

    @Enumerated(EnumType.STRING)
    @Column(name = "SEX")
    private Sex sex;

    public Pet(
            String firstName,
            Species species,
            int weight,
            CoatLength coatLength,
            FurType furType,
            Set<FurColor> furColor,
            AdoptionCenter center ,
            Set<DogBreed> dogBreeds,
            Set<CatBreed> catBreeds,
            Size petSize, int age,
            Set<Temperament> temperament,
            Health healthStatus,
            SpayedNeutered spayedNeutered,
            Sex sex) {
        this.name = firstName;
        this.species = species;
        this.weight = weight;
        this.coatLength = coatLength;
        this.furType = furType;
        this.furColor = furColor;
        this.center = center;
        this.dogBreed = dogBreeds;
        this.catBreed = catBreeds;
        this.petSize = petSize;
        this.age = age;
        this.temperament = temperament;
        this.healthStatus = healthStatus;
        this.spayedNeutered = spayedNeutered;
        this.sex = sex;
    }

    public Pet() {}

    public String toString() {
        StringBuilder str = new StringBuilder();

        // [id] : name
        str.append("[" + id + "] : " + name + "\n");
        str.append(
                "adoption center: "
                + (center == null || center.getCenterName().isEmpty() ? "NULL" : center.getCenterName())
                + "\n"
        );
        str.append("species: " + species.getDisplayName() + "\n");
        str.append("sex: " + sex.getDisplayName() + "\n");
        if (species.ordinal() == 0) {
            str.append("dog breed(s):\n");
            for (DogBreed db : dogBreed) {
                str.append("\t" + db.getDisplayName() + "\n");
            }
        } else {
            str.append("cat breed(s):\n");
            for (CatBreed cb : catBreed) {
                str.append("\t" + cb.getDisplayName() + "\n");
            }
        }
        str.append("weight: " + weight + "\n");
        str.append("size: " + petSize + "\n");
        str.append("fur type: " + furType + "\n");
        str.append("coat length: " + coatLength + "\n");
        str.append("fur color(s):\n");
        for (FurColor fc : furColor) {
            str.append("\t" + fc + "\n");
        }
        str.append("temperament(s):\n");
        for (Temperament t : temperament) {
            str.append("\t" + t.getDisplayName() + "\n");
        }
        str.append("health status: " + healthStatus + "\n");
        str.append("spayed / neutered?: " + (spayedNeutered.ordinal() == 0 ? "Y" : "N") + "\n");

        return str.toString();
    }
    */
}
