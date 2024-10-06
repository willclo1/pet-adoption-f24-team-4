package petadoption.api.adoptionCenter;

import jakarta.persistence.*;
import lombok.Data;
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

    @OneToMany(mappedBy = "center")
    private Set<User> accounts; // or List<User> accounts;

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
}
