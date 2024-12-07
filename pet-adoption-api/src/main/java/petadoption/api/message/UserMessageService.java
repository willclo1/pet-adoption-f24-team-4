package petadoption.api.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserMessageService {

    @Autowired
    UserMessageRepository messageRepository;

    public UserMessage saveMessage(UserMessage m){
        messageRepository.save(m);
        return m;
    }

    public List<UserMessage> findAll() {
        return messageRepository.findAll();
    }

    public void deleteById(Long id) {
        messageRepository.deleteById(id);
    }

    public List<UserMessage> findMessagesByReceiverId(Long centerId) {
        return messageRepository.findByReceiverID(centerId);
    }

    public List<UserMessage> findMessagesBetweenCenterAndUser(Long centerId, Long userId) {
        return messageRepository.findMessagesBetweenCenterAndUser(centerId,userId);
    }
    public List<UserMessage> findMessagesByUser(Long userId) {
        return messageRepository.findMessagesByUserId(userId);
    }

    public List<UserMessage> findMessagesByCenterId(Long centerId) {
        return messageRepository.findMessagesByCenterId(centerId);
    }
}
