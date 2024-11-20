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

import java.util.ArrayList;
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

    public void deleteAll() {
        userRepository.deleteAll();
    }

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
            user.setPassword(encoder.encode(ucer.getPassword()));
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

    public User register(RegisterRequest registerRequest) {
        registerRequest.setPassword(encoder.encode(registerRequest.getPassword()));
        User user = new User();
        if(registerRequest.getAdoptionId() != null) {
            Optional<AdoptionCenter> center = (adoptionCenterRepository.findById(registerRequest.getAdoptionId()));
            if (center.isPresent()) {
                user.setCenter(center.get());
            }
        }

        user.setEmailAddress(registerRequest.getEmailAddress());

        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setUserType(registerRequest.getUserType());
        user.setPassword(registerRequest.getPassword());
        return userRepository.save(user);
    }

    public String verify(User user) {
        Optional<User> optionalUser = userRepository.findByEmailAddress(user.getEmailAddress());

        if (optionalUser.isPresent()) {
            User foundUser = optionalUser.get();
            if (encoder.matches(user.getPassword(), foundUser.getPassword())) {
                return jwtService.generateToken(user.getEmailAddress());
            }
        }
        return "Fail"; // Or you can throw an exception for better error handling
    }

    public List<User> findNonAdoptionUsers(){
        List<User> users = userRepository.findAll();
        List<User> nonAdoptionUsers = new ArrayList<>();
        for(int i = 0; i < users.size(); i++){
            if(users.get(i).getCenter() == null){
                nonAdoptionUsers.add(users.get(i));
            }
        }
        return nonAdoptionUsers;
    }

    public void deleteAllUsers() {
        userRepository.deleteAll();
    }
}
