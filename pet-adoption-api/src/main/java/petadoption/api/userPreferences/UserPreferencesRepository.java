package petadoption.api.userPreferences;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @author Rafe Loya
 */
@Repository
public interface UserPreferencesRepository extends JpaRepository<UserPreferences, Long> {
    @Query("SELECT up from UserPreferences up JOIN User u "
            + "WHERE up.user_preferences_id = u.userPreferences.user_preferences_id "
            + "AND u.id = ?1")
    public Optional<UserPreferences> findByUserId(Long userId);
}
