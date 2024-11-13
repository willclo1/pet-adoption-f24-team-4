package petadoption.api.userPreferences;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @author Rafe Loya
 */
@Repository
public interface UserPreferencesRepository extends JpaRepository<UserPreferences, Long> {
}
