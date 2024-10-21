package petadoption.api.user;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterRepository;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private JWTService jwtService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

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
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findUserByEmail(String emailAddress) {return userRepository.findByEmailAddress(emailAddress);}


    public void changePassword(ChangePassword ucer) {
        User user = userRepository.findByEmailAddress(ucer.getEmail()).get();
        if(!user.getPassword().equals(ucer.getPassword())) {
            user.setPassword(ucer.getPassword());
            userRepository.save(user);
        }
    }
    public void deleteUser(ChangePassword ucer) {
        User user = userRepository.findByEmailAddress(ucer.getEmail()).get();
        if(user.getEmailAddress().equals(ucer.getEmail())) {
            userRepository.delete(user);
        }
    }


    public Optional<Long> findAdoptionIDByEmailAddress(String email) {
        return userRepository.findAdoptionIDByEmailAddress(email);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public String verify(User user){
        Authentication authentication =
                authManager.authenticate((new UsernamePasswordAuthenticationToken(user.getEmailAddress(), user.getPassword())));
        if(authentication.isAuthenticated())
            return jwtService.generateToken(user.getEmailAddress());

        return "Fail";
    }
}
