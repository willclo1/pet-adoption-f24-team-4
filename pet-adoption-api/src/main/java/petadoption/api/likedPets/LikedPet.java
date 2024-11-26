package petadoption.api.likedPets;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.pet.Pet;
import petadoption.api.user.User;

@Setter
@Data
@Entity
@Table(name = LikedPet.TABLE_NAME, uniqueConstraints = {@UniqueConstraint(columnNames = {"petID", "USER_ID"})})
public class LikedPet {
    public static final String TABLE_NAME = "liked_pet";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    private Long likedPetId;

    @Getter
    @ManyToOne
    @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID")
    private User user;

    @Getter
    @ManyToOne
    @JoinColumn(name = "petID", referencedColumnName = "petID")
    private Pet pet;

    public LikedPet() {}

    public LikedPet(User u, Pet p) {
        this.user = u;
        this.pet = p;
    }
}
