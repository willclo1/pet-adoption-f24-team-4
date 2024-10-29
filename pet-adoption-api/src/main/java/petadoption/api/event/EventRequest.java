package petadoption.api.event;

import lombok.Data;

@Data
public class EventRequest {
    private Long adoptionID;
    private Long imageID;
    private String title;
    private String description;
    private String location;
    private String startDateTime;
    private String endDateTime;
}
