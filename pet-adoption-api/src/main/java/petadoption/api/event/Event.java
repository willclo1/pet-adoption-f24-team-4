package petadoption.api.event;

import jakarta.persistence.*;
import lombok.Data;
import petadoption.api.Utility.Image;
import petadoption.api.adoptionCenter.AdoptionCenter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Data
@Entity
@Table(name = Event.TABLE_NAME)
public class Event {
    public static final String TABLE_NAME = "events";
    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "EVENT_ID")
    Long eventID;

    @ManyToOne
    @JoinColumn(name = "adoptionID", referencedColumnName = "adoptionID", nullable = false)
    private AdoptionCenter center;

    @Column(name = "TITLE")
    String title;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "PICTURE_ID", referencedColumnName = "id")
    Image eventPicture;

    @Column(name = "DESCRIPTION")
    String description;

    @Column(name = "LOCATION")
    String location;

    @Column(name = "START_DATE_TIME")
    String startDateTime;  //yyyy-MM-dd HH:mm:ss

    @Column(name = "END_DATE_TIME")
    String endDateTime;

    public Event() {}

    public void setStartDateTime(String sdt) throws IllegalArgumentException {
        if (!isValidDateTime(sdt)) {
            throw new IllegalArgumentException(
                    sdt + " is not a valid start date"
            );
        } else if (this.endDateTime != null &&
                ((LocalDateTime.parse(sdt)).isAfter
                        (LocalDateTime.parse(this.endDateTime)))) {
            throw new IllegalArgumentException(
                    sdt + " comes after endDateTime:"
            );
        } else {
            this.startDateTime = sdt;
        }
    }

    public void setEndDateTime(String edt) throws IllegalArgumentException {
        if (!isValidDateTime(edt)) {
            throw new IllegalArgumentException(
                    edt + " is not a valid start date"
            );
        } else if (this.startDateTime != null &&
                ((LocalDateTime.parse(edt)).isBefore
                        (LocalDateTime.parse(this.startDateTime)))) {
            throw new IllegalArgumentException(
                    edt + " comes before startDateTime:"
            );
        } else {
            this.endDateTime = edt;
        }
    }

    public static boolean isValidDateTime(String dateTime) {
        try {
            DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(dateTime);
        } catch (DateTimeParseException e) {
            return false;
        }
        return true;
    }
}