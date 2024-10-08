package petadoption.api.adoptionCenter;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.Data;
import petadoption.api.pet.Pet;
import petadoption.api.user.User;

import java.util.Set;

@Data
@Entity
@Table(name = AdoptionCenter.TABLE_NAME)
public class AdoptionCenter {
    public static final String TABLE_NAME = "CENTER";
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "adoptionID")
    private Long adoptionID;

    @Column(name = "Center_Name")
    private String centerName;

    @JsonIgnore
    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL)
    private Set<User> accounts;

    @JsonIgnore
    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL)
    private Set<Pet> pets;

    public AdoptionCenter(String centerName) {
        this.centerName = centerName;
    }
    public AdoptionCenter() {
    }


    public Long getAdoptionID() {
        return adoptionID;
    }

    public void setAdoptionID(Long adoptionID) {
        this.adoptionID = adoptionID;
    }

    public String getCenterName() {
        return centerName;
    }

    public void setCenterName(String centerName) {
        this.centerName = centerName;
    }

    public Set<User> getAccounts() {
        return accounts;
    }

    public void setAccounts(Set<User> accounts) {
        this.accounts = accounts;
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
