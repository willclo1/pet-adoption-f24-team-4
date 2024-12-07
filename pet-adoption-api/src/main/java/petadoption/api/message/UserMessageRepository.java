package petadoption.api.message;

import io.jsonwebtoken.security.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMessageRepository extends JpaRepository<UserMessage, Long> {
    List<UserMessage> findByReceiverID(Long receiverID);
    @Query("SELECT m FROM UserMessage m WHERE m.senderID = :userId OR m.receiverID = :userId")
    List<UserMessage> findMessagesByUserId(@Param("userId") Long userId);

    @Query("SELECT m FROM UserMessage m WHERE (m.senderID = :centerId AND m.receiverID = :userId) OR (m.senderID = :userId AND m.receiverID = :centerId)")
    List<UserMessage> findMessagesBetweenCenterAndUser(Long centerId, Long userId);
    @Query("SELECT m FROM UserMessage m WHERE m.senderID = :centerId OR m.receiverID = :centerId")
    List<UserMessage> findMessagesByCenterId(@Param("centerId") Long centerId);
}
