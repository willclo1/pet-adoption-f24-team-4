package petadoption.api.user;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterRepository;

import java.util.Optional;
import java.util.logging.Logger;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    public Optional<User> findUser(Long userId) {
        return userRepository.findById(userId);
    }

    public User saveUser(User user, Long adoptionId) {
        if (adoptionId != null) {
            Optional<AdoptionCenter> adoptionCenter = adoptionCenterRepository.findById(adoptionId);
            if (adoptionCenter.isPresent()) {
                user.setCenter(adoptionCenter.get());
            } else {
                throw new RuntimeException("Adoption Center not found.");
            }
        }


        return userRepository.save(user);

    }

    public Optional<User> findUserByEmail(String emailAddress) {return userRepository.findByEmailAddress(emailAddress);}

    public Optional<Long> findAdoptionIDByEmailAddress(String email) { return userRepository.findAdoptionIDByEmailAddress(email); }
}
