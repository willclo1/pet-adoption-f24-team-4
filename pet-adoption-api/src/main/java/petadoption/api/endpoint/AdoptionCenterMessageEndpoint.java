package petadoption.api.endpoint;

import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.message.AdoptionCenterMessage;
import petadoption.api.message.AdoptionMessageService;

import java.util.List;

@RestController
@RequestMapping("/adoption-center-messages")
public class AdoptionCenterMessageEndpoint {

    @Autowired
    private AdoptionMessageService adoptionCenterMessageService;

    // Get all messages
    @GetMapping
    public ResponseEntity<List<AdoptionCenterMessage>> getAllMessages() {
        return ResponseEntity.ok(adoptionCenterMessageService.findAll());
    }


    // Create a new message
    @PostMapping
    public ResponseEntity<AdoptionCenterMessage> createMessage(@RequestBody AdoptionCenterMessage message) {
        AdoptionCenterMessage createdMessage = adoptionCenterMessageService.saveMessage(message);
        return ResponseEntity.ok(createdMessage);
    }

    @DeleteMapping("/{id}")
    public void deleteMessage(@PathVariable Long id) {
        adoptionCenterMessageService.deleteById(id);
    }
}