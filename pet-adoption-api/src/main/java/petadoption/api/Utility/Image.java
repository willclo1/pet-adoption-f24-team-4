package petadoption.api.Utility;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;


@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "IMAGES")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageData;
}