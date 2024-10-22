package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.event.Event;
import petadoption.api.event.EventService;

import java.util.List;
import java.util.Optional;

@Log4j2
@RestController
@RequestMapping("/events")
public class EventEndpoint {
    private final EventService eventService;

    public EventEndpoint(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<Event> getEvents() { return eventService.getAllEvents(); }

    @PostMapping("/add")
    public ResponseEntity<Event> addEvent(@RequestBody Event request) {
        try {
            Event e = new Event();
            copyRequestToEvent(request, e);

            Event result = eventService.saveEvent(e);
            log.info("Successfully saved event");
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (Exception e) {
            log.info("Failed to save event", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{eventID}")
    public Optional<Event> getEvent(@PathVariable long eventID) {
        return eventService.getEventById(eventID);
    }

    @GetMapping("/adoption-center/{adoptionID}")
    public List<Event> getEventsFromCenter(@PathVariable long adoptionID) {
        return eventService.getEventsFromCenter(adoptionID);
    }

    @PutMapping("/updateEvent")
    public ResponseEntity<Event> updateEvent(@RequestBody Event request) {
        try {
            Optional<Event> result = eventService.getEventById(request.getEventID());
            if (result.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Event e = result.get();

            copyRequestToEvent(request, e);
            Event saveResult = eventService.saveEvent(e);
            log.info("Event successfully updated: " + saveResult.getEventID());
            return ResponseEntity.ok(saveResult);
        } catch (Exception e) {
            log.error("Failed to update Event", e);
            return ResponseEntity.badRequest().build();
        }
    }

    private void copyRequestToEvent(@RequestBody Event request, Event e) {
        e.setCenter(request.getCenter());
        e.setTitle(request.getTitle());
        e.setEventPicture(request.getEventPicture());
        e.setDescription(request.getDescription());
        e.setLocation(request.getLocation());
        e.setStartDateTime(request.getStartDateTime());
        e.setEndDateTime(request.getEndDateTime());
    }
}
