package petadoption.api.message;

import aj.org.objectweb.asm.commons.Remapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdoptionMessageService {
    @Autowired
    AdoptionCenterMessageRepository messageRepository;

    public AdoptionCenterMessage saveMessage(AdoptionCenterMessage m) {
        return messageRepository.save(m);

    }

    public List<AdoptionCenterMessage> findAll() {
        return messageRepository.findAll();
    }


    public void deleteById(Long id) {
        messageRepository.deleteById(id);
    }
}
