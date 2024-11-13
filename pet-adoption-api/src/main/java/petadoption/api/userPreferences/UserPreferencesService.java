package petadoption.api.userPreferences;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserPreferencesService {
    @Autowired
    private UserPreferencesRepository userPreferencesRepository;

    public Optional<UserPreferences> getUserPreferencesById(Long userPreferencesId) {
        return userPreferencesRepository.findById(userPreferencesId);
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
