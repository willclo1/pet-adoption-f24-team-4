package petadoption.api.pet;

import jakarta.persistence.*;
import lombok.Data;
import petadoption.api.Utility.Image;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.pet.criteria.*;
import petadoption.api.pet.criteria.breed.AnimalBreed;
import petadoption.api.pet.criteria.breed.CatBreed;
import petadoption.api.pet.criteria.breed.DogBreed;

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
    Long id;

    @Column(name = "name")
    String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "SPECIES")
    Species species;

    @Column(name = "WEIGHT")
    int weight;

    @Enumerated(EnumType.STRING)
    @Column(name = "COAT_LENGTH")
    CoatLength coatLength;

    @Enumerated(EnumType.STRING)
    @Column(name = "FUR_TYPE")
    FurType furType;

    @Enumerated(EnumType.STRING)
    @Column(name = "FUR_COLOR")
    FurColor furColor;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "PICTURE_ID", referencedColumnName = "id")
    Image profilePicture;

    @ManyToOne
    @JoinColumn(name = "adoptionID", referencedColumnName = "adoptionID", nullable = true)
    private AdoptionCenter center;

    @Enumerated(EnumType.STRING)
    @Column(name = "BREED") // Added breed column
    private DogBreed breed;

    @Enumerated(EnumType.STRING) // Use this annotation if petSize is an enum
    @Column(name = "PET_SIZE") // Added petSize column
    private Size petSize;

    @Column(name = "AGE") // Added age column
    private int age;

    @Enumerated(EnumType.STRING)
    @Column(name = "TEMPERAMENT") // Added temperament column
    private Temperament temperament;

    @Enumerated(EnumType.STRING)
    @Column(name = "HEALTH_STATUS") // Added healthStatus column
    private Health healthStatus;

    public Pet(String firstName, Species species, int weight, CoatLength coatLength, FurType furType, FurColor furColor, AdoptionCenter center , DogBreed breed, Size petSize, int age, Temperament temperament, Health healthStatus ) {
        this.name = firstName;
        this.species = species;
        this.weight = weight;
        this.coatLength = coatLength;
        this.furType = furType;
        this.furColor = furColor;
        this.center = center;
        this.breed = breed;
        this.petSize = petSize;
        this.age = age;
        this.temperament = temperament;
        this.healthStatus = healthStatus;


    }
    public Pet(){


    }

}
