package petadoption.api.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.adoptionCenter.AdoptionCenterRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    public Optional<Event> getEventById(Long eventId) {
        return eventRepository.findById(eventId);
    }

    public List<Event> getAllEvents() { return eventRepository.findAll(); }

    public List<Event> getEventsFromCenter(Long adoptionID) {
        return eventRepository.findAllByCenter_AdoptionID(adoptionID);
    }

    public Event saveEvent(Event event) {
        boolean centerFound = adoptionCenterRepository.existsById(
                event.getCenter().getAdoptionID()
        );

        if (centerFound) {
            return eventRepository.save(event);
        } else {
            return null;
        }
    }

    public void deleteEvent(Long eventID) { eventRepository.deleteById(eventID); }
}