package petadoption.api.adoptionCenter;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = AdoptionCenter.TABLE_NAME)
public class AdoptionCenter {
    public static final String TABLE_NAME = "CENTER";
    @Id
    private Long centerID;




    public void setCenterID(Long centerID) {
        this.centerID = centerID;
    }

    public Long getCenterID() {
        return centerID;
    }
}