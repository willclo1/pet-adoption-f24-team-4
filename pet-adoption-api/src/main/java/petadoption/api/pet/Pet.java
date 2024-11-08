package petadoption.api.pet;

import jakarta.persistence.*;
import lombok.Data;
import petadoption.api.Utility.Image;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.pet.criteria.Size;
import petadoption.api.pet.criteria.Temperament;

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

    @Column(name = "FIRST_NAME")
    String firstName;

    @Column(name = "LAST_NAME")
    String lastName;

    @Column(name = "PET_TYPE")
    String petType;

    @Column(name = "WEIGHT")
    int weight;

    @Column(name = "FUR_TYPE")
    String furType;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "PICTURE_ID", referencedColumnName = "id")
    Image profilePicture;

    @ManyToOne
    @JoinColumn(name = "adoptionID", referencedColumnName = "adoptionID", nullable = true)
    private AdoptionCenter center;


    @Column(name = "BREED") // Added breed column
    private String breed;

    @Enumerated(EnumType.STRING) // Use this annotation if petSize is an enum
    @Column(name = "PET_SIZE") // Added petSize column
    private Size petSize;

    @Column(name = "AGE") // Added age column
    private int age;

    @Enumerated(EnumType.STRING)
    @Column(name = "TEMPERAMENT") // Added temperament column
    private Temperament temperament;

    @Column(name = "HEALTH_STATUS") // Added healthStatus column
    private String healthStatus;

    public Pet(String firstName, String lastName, String petType, int weight,String furType,AdoptionCenter center ,String breed,Size petSize, int age, Temperament temperament, String healthStatus ) {
        this.firstName = firstName;
        this.petType = petType;
        this.weight = weight;
        this.furType = furType;
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
