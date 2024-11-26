package petadoption.api.user;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.Utility.Image;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.pet.criteria.Attribute;

import java.util.Arrays;
import java.util.Map;

@Data
@Entity
@Table(name = User.TABLE_NAME)
public class User {
    public static final String TABLE_NAME = "USERS";

    @Getter
    @Setter
    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "USER_ID")
    Long id;

    @Getter
    @Setter
    @Column(name = "FIRST_NAME")
    String firstName;

    @Getter
    @Setter
    @Column(name = "LAST_NAME")
    String lastName;

    @Getter
    @Setter
    @Column(name = "EMAIL_ADDRESS")
    String emailAddress;

    @Getter
    @Setter
    @Column(name = "PASSWORD")
    String password;

    @Getter
    @Setter
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "PICTURE_ID", referencedColumnName = "id")
    Image profilePicture;

    @Getter
    @Setter
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "preferences", joinColumns = @JoinColumn(name = "USER_ID"))
    @MapKeyColumn(name = "pet_attribute")
    @Column(name = "rating")
    private Map<String, Integer> preferences;

    @Getter
    @Setter
    @Column(name = "USER_TYPE")
    String userType;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "adoptionID", referencedColumnName = "adoptionID", nullable = true)
    private AdoptionCenter center;

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof User)) return false;
        User other = (User) obj;
        return id != null && id.equals(other.id);
    }

    public void clearPreferences() {
        preferences.clear();
    }

    public boolean clearSpeciesPreferences() {
        return preferences.keySet().removeIf(key -> key.contains("Species"));
    }

    public boolean clearCatBreedPreferences() {
        return preferences.keySet().removeIf(key -> key.contains("Cat Breed"));
    }

    public boolean clearDogBreedPreferences() {
        return preferences.keySet().removeIf(key -> key.contains("Dog Breed"));
    }

    public boolean clearFurTypePreferences() {
        return preferences.keySet().removeIf(key -> key.contains("Fur Type"));
    }

    public boolean clearFurColorPreferences() {
        return preferences.keySet().removeIf(key -> key.contains("Fur Color"));
    }

    public boolean clearFurLengthPreferences() {
        return preferences.keySet().removeIf(key -> key.contains("Fur Length"));
    }

    public boolean clearSizePreferences() {
        return preferences.keySet().removeIf(key -> key.contains("Size"));
    }

    public boolean clearHealthPreferences() {
        return preferences.keySet().removeIf(key -> key.contains("Health"));
    }

    public boolean clearGenderPreferences() {
        return preferences.keySet().removeIf(key -> key.contains("Gender"));
    }

    public boolean clearTemperamentPreferences() {
        return preferences.keySet().removeIf(key -> key.contains("Temperament"));
    }

    public boolean clearSpayedNeuteredPreferences() {
        return preferences.keySet().removeIf(key -> key.contains("Spayed / Neutered"));
    }

    public boolean clearAgePreferences() {
        return preferences.keySet().removeIf(key -> key.contains("Age"));
    }

    public boolean clearWeightPreferences() {
        return preferences.keySet().removeIf(key -> key.contains("Weight"));
    }
}
