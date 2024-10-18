package petadoption.api.pet;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class PetRequest {
    private String firstName;

    private int id;
    private String lastName;
    private String petType;
    private int weight;
    private String furType;
    private Long adoptionID;  // Use this to get the Adoption Center

    private String breed;

    private Size petSize;

    private int age;

    private Temperament temperament;

    private String healthStatus;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    // Getters and setters
}
