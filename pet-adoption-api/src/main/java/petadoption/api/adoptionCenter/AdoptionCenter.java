package petadoption.api.adoptionCenter;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import petadoption.api.pet.Pet;
import petadoption.api.user.User;

import java.util.Set;

@Data
@Entity
@Log4j2
@Table(name = AdoptionCenter.TABLE_NAME)
public class AdoptionCenter {
    public static final String TABLE_NAME = "CENTER";
    @Setter
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "adoptionID")
    private Long adoptionID;

    @Setter
    @Getter
    @Column(name = "Center_Name")
    private String centerName;

    @Getter
    @Column(name = "Building_Address")
    private String buildingAddress;

    @Getter
    @Column(name = "Description")
    private String description;

    @Setter
    @Getter
    @JsonIgnore
    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL,  fetch = FetchType.LAZY)
    private Set<User> accounts;

    @JsonIgnore

    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Pet> pets;

    public AdoptionCenter(String centerName, String buildingAddress, String description) {
        this.centerName = centerName;
        setBuildingAddress(buildingAddress);
        this.description = description;

    }
    public AdoptionCenter() {
    }

    /* buildingAddress must follow format: address,city,state */
    public void setBuildingAddress(String buildingAddress) {
        //this.buildingAddress = buildingAddress;
        String[] parser = buildingAddress.split(",");
        if (parser.length == 3) {
            this.buildingAddress = buildingAddress;
        }
        else {
            log.error(
                    "ERR: Improper formatting for AdoptionCenter.buildingAddress, " +
                            "must be of the form: <street address>,<city>,<state>" +
                            "\ngiven address: {}",
                    buildingAddress
            );
            this.buildingAddress = "";
            throw new IllegalArgumentException();
        }
    }

    public void setDescription(String description) {
        if (description.length() > 150) {
            log.error("ERR: Description length exceeds 150 characters");
            this.description = description.substring(0, 150);
        } else {
            this.description = description;
        }
    }

    @Override
    public int hashCode() {
        return adoptionID != null ? adoptionID.hashCode() : 0;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof AdoptionCenter)) return false;
        AdoptionCenter other = (AdoptionCenter) obj;
        return adoptionID != null && adoptionID.equals(other.adoptionID);
    }
}
