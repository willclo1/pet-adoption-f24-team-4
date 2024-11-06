package petadoption.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAddress(String emailAddress);
    @Query("SELECT u.center.adoptionID FROM User u WHERE u.emailAddress = :emailAddress")
    Optional<Long> findAdoptionIDByEmailAddress(@Param("emailAddress") String emailAddress);
}
