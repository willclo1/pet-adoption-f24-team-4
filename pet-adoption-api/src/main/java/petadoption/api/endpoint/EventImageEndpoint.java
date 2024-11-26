package petadoption.api.endpoint;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.Utility.Image;
import petadoption.api.Utility.ImageService;
import petadoption.api.event.Event;
import petadoption.api.event.EventService;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/event/event-image")
public class EventImageEndpoint {
    private final ImageService imageService;
    private final EventService eventService;

    public EventImageEndpoint(ImageService imageService, EventService eventService) {
        this.imageService = imageService;
        this.eventService = eventService;
    }

    @PostMapping("/{eventID}")
    public ResponseEntity<String> updateEventImage(
            @PathVariable Long eventID,
            @RequestParam("image") MultipartFile file) throws IOException {

        Optional<Event> eventOpt = eventService.getEventById(eventID);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();

            if (event.getEventPicture() != null) {
                long oldImageId = event.getEventPicture().getId();
                imageService.deleteImage(oldImageId);
            }

            Image eventPicture = new Image();
            eventPicture.setName(file.getOriginalFilename());
            eventPicture.setType(file.getContentType());
            eventPicture.setImageData(file.getBytes());

            event.setEventPicture(eventPicture);
            eventService.saveEvent(event);

            return ResponseEntity.ok("Image updated");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
