package petadoption.api.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdoptionMessageService {
    @Autowired
    AdoptionCenterMessageRepository messageRepository;

    public void saveMessage(AdoptionCenterMessage m){
        messageRepository.save(m);
    }
}
