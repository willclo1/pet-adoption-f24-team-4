package petadoption.api.userPreferences;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.user.User;
import petadoption.api.user.UserRepository;

import java.util.Optional;

/**
 * @author Rafe Loya
 */
@Service
public class UserPreferencesService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPreferencesRepository userPreferencesRepository;

    public Optional<UserPreferences> getUserPreferencesById(Long userPreferencesId) {
        return userPreferencesRepository.findById(userPreferencesId);
    }

    public Optional<UserPreferences> getUserPreferencesByUserId(Long userId) {
        Optional<User> u = userRepository.findById(userId);
        return u.map(User::getUserPreferences);
    }

    public UserPreferences saveUserPreferences(UserPreferences userPreferences) {
        return userPreferencesRepository.save(userPreferences);
    }

    public void deleteUserPreferences(UserPreferences userPreferences) {
        userPreferencesRepository.delete(userPreferences);
    }

    public void deleteAllUserPreferences() {
        userPreferencesRepository.deleteAll();
    }
}
