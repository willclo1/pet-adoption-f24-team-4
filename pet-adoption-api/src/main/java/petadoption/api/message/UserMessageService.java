package petadoption.api.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserMessageService {

    @Autowired
    UserMessageRepository messageRepository;

    public void saveMessage(UserMessage m){
        messageRepository.save(m);
    }
}
