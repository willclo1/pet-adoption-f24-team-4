package petadoption.api.userPreferences;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.pet.criteria.PetAttribute;

@Entity
@Table(name = Preference.TABLE_NAME)
public class Preference {
    public static final String TABLE_NAME = "preferences";

    @Id
    @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID", nullable = false)
    private Long id;

    @Getter
    @Column(name = "type")
    private String type;

    @Getter
    @Column(name = "attribute")
    private String attribute; // key

    @Getter
    @Setter
    @Column(name = "rating")
    public Double rating;    // value

    public Preference() {}

    public Preference(String type, String attribute, Double rating) {
        if (PetAttribute.verifyPetAttribute(type, attribute)) {
            this.type = type;
            this.attribute = attribute;
            this.rating = rating;
        }
    }

    public void setType(String type) {
        if (PetAttribute.verifyType(type)) {
            this.type = type;
        }
        throw new RuntimeException();
    }

    public void setAttribute(String attribute) {
        if (PetAttribute.verifyPetAttribute(this.type, attribute)) {
            this.attribute = attribute;
        }
        throw new RuntimeException();
    }

    public boolean compare(Preference p) {
        return (this.type != null && this.type.equals(p.getType())
                && this.attribute != null && this.attribute.equals(p.getAttribute()));
    }

    public boolean comparePetAttribute(PetAttribute pa) {
        return (this.type != null && this.type.equals(pa.getType())
                && this.attribute != null && this.attribute.equals(pa.getAttribute()));
    }

    @Override
    public String toString() {
        StringBuilder str = new StringBuilder();

        str.append("[user id] ").append(this.id).append("\n");
        str.append("[type] ").append(this.type).append("\n");
        str.append("[attribute] ").append(this.attribute).append("\n");
        str.append("[rating] ").append(this.rating).append("\n");

        return str.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Preference preference = (Preference) o;
        return (this.type != null && this.type.equals(preference.type)
                && this.attribute != null && this.attribute.equals(preference.attribute)
                && this.rating != null && this.rating.compareTo(preference.rating) == 0);
    }
}