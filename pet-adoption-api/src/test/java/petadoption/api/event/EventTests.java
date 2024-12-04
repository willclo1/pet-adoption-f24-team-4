package petadoption.api.event;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterRepository;
import petadoption.api.adoptionCenter.AdoptionCenterService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb")  // Use H2 in-memory DB for testing
@Transactional
public class EventTests {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventService eventService;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    @Autowired
    private AdoptionCenterService adoptionCenterService;

    @BeforeEach
    void setUp() {
        eventRepository.deleteAll();
        adoptionCenterRepository.deleteAll();
    }

    @Test
    void testSaveEvent() {
        AdoptionCenter center = new AdoptionCenter();
        center.setCenterName("Test Center");
        center.setBuildingAddress("123 Test St, Waco, TX");
        center.setDescription("A test center for adoptions");

        AdoptionCenter savedCenter = adoptionCenterService.saveCenter(center);
        assertNotNull(savedCenter, "Adoption center was not saved.");

        Event event = new Event();
        event.setCenter(savedCenter);
        event.setTitle("Test Event");
        event.setDescription("This is a test event.");
        event.setStartDateTime(LocalDateTime.now());
        event.setEndDateTime(LocalDateTime.now().plusHours(1));

        Event savedEvent = eventService.saveEvent(event);
        assertNotNull(savedEvent, "Event was not saved.");
        assertEquals("Test Event", savedEvent.getTitle(), "Event title does not match.");
    }

    @Test
    void testGetEventById() {
        AdoptionCenter center = new AdoptionCenter();
        center.setCenterName("Test Center");
        center.setBuildingAddress("123 Test St, Waco, TX");
        center.setDescription("A test center for adoptions");

        AdoptionCenter savedCenter = adoptionCenterService.saveCenter(center);
        Event event = new Event();
        event.setCenter(savedCenter);
        event.setTitle("Test Event");
        event.setDescription("This is a test event.");
        event.setStartDateTime(LocalDateTime.now());
        event.setEndDateTime(LocalDateTime.now().plusHours(1));

        Event savedEvent = eventService.saveEvent(event);
        Optional<Event> retrievedEvent = eventService.getEventById(savedEvent.getEventID());

        assertTrue(retrievedEvent.isPresent(), "Event not found by ID.");
        assertEquals("Test Event", retrievedEvent.get().getTitle(), "Event title does not match.");
    }

    @Test
    void testDeleteEvent() {
        AdoptionCenter center = new AdoptionCenter();
        center.setCenterName("Test Center");
        center.setBuildingAddress("123 Test St, Waco, TX");
        center.setDescription("A test center for adoptions");

        AdoptionCenter savedCenter = adoptionCenterService.saveCenter(center);
        Event event = new Event();
        event.setCenter(savedCenter);
        event.setTitle("Test Event");
        event.setDescription("This is a test event.");
        event.setStartDateTime(LocalDateTime.now());
        event.setEndDateTime(LocalDateTime.now().plusHours(1));

        Event savedEvent = eventService.saveEvent(event);
        eventService.deleteEvent(savedEvent.getEventID());

        Optional<Event> deletedEvent = eventService.getEventById(savedEvent.getEventID());
        assertTrue(deletedEvent.isEmpty(), "Event was not deleted.");
    }

    @Test
    void testGetEventsFromCenter() {
        AdoptionCenter center = new AdoptionCenter();
        center.setCenterName("Test Center");
        center.setBuildingAddress("123 Test St, Waco, TX");
        center.setDescription("A test center for adoptions");

        AdoptionCenter savedCenter = adoptionCenterService.saveCenter(center);

        for (int i = 1; i <= 3; i++) {
            Event event = new Event();
            event.setCenter(savedCenter);
            event.setTitle("Test Event " + i);
            event.setDescription("This is test event " + i);
            event.setStartDateTime(LocalDateTime.now());
            event.setEndDateTime(LocalDateTime.now().plusHours(1));
            eventService.saveEvent(event);
        }

        List<Event> events = eventService.getEventsFromCenter(savedCenter.getAdoptionID());
        assertEquals(3, events.size(), "Number of events retrieved does not match.");
        for (int i = 0; i < events.size(); i++) {
            assertEquals("Test Event " + (i + 1), events.get(i).getTitle(), "Event title does not match.");
        }
    }

    @Test
    void testInvalidDateTimeAssignment() {
        Event event = new Event();

        LocalDateTime startDate = LocalDateTime.now().plusHours(2);
        LocalDateTime endDate = LocalDateTime.now().plusHours(1);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            event.setStartDateTime(startDate);
            event.setEndDateTime(endDate);
        });

        assertEquals("End date-time cannot be before start date-time.", exception.getMessage(), "Exception message does not match.");
    }
}
