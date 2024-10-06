package petadoption.api.adoptionCenter;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Entity
@Table(name = AdoptionCenter.TABLE_NAME)
public class AdoptionCenter {
    public static final String TABLE_NAME = "CENTER";

    @Getter
    @Setter
    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "CENTER_ID")
    private Long centerId;

    @Getter
    @Setter
    @Column(name = "USER_ID")
    private Long userId;

    @Getter
    @Setter
    @Column(name = "BUILDING_NAME")
    private String buildingName;

    /* Probably needs to have verification for correct formatting in setter, example:
     * "Y-12:00P-5:00P\n (Sunday)
     * M-9:00A-12:00P\n
     * T-9:00A-12:00P\n
     * W-9:00A-12:00P\n
     * R-9:00A-12:00P\n
     * F-9:00A-12:00P\n
     * S-12:00P-5:00P
     * "
     * formatting above occupies 112 chars
     */
    @Getter
    @Setter
    @Column(name = "HOURS")
    private String hours;
}