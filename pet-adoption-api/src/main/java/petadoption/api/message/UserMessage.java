package petadoption.api.message;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.checkerframework.checker.units.qual.C;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.user.User;

@Data
@Entity
@Table(name = UserMessage.TABLE_NAME)
public class UserMessage {
    public static final String TABLE_NAME = "UserMessage";
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MessageID")
    Long id;

    @Setter
    @Getter
    @Column(name = "content")
    String content;

    @Setter
    @Getter
    @OneToOne
    @JoinColumn(name = "adoptionID", referencedColumnName = "adoptionID")
    AdoptionCenter receiver;

    @Setter
    @Getter
    @OneToOne
    @JoinColumn(name = "userID", referencedColumnName = "USER_ID")
    User sender;
}
