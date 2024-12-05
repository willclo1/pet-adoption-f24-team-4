package petadoption.api.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.adoptionCenter.AdoptionCenter;
import petadoption.api.adoptionCenter.AdoptionCenterRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb")
public class UserTests {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        adoptionCenterRepository.deleteAll();
    }

    @Test
    void testSaveUser() {
        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmailAddress("john.doe@example.com");
        user.setPassword(encoder.encode("password123"));
        user.setUserType("Adopter");

        User savedUser = userService.saveUser(user);
        assertNotNull(savedUser, "User was not saved");
        assertNotNull(savedUser.getId(), "Saved user ID is null");
    }

    @Test
    void testSaveUserWithAdoptionCenter() {
        AdoptionCenter center = new AdoptionCenter();
        center.setCenterName("Test Center");
        center.setBuildingAddress("123 Test St, Waco, TX");
        adoptionCenterRepository.save(center);

        User user = new User();
        user.setFirstName("Jane");
        user.setLastName("Smith");
        user.setEmailAddress("jane.smith@example.com");
        user.setPassword(encoder.encode("password456"));
        user.setUserType("Staff");

        User savedUser = userService.saveUser(user, center.getAdoptionID());
        assertNotNull(savedUser.getCenter(), "User center association failed");
        assertEquals("Test Center", savedUser.getCenter().getCenterName(), "Center name mismatch");
    }

    @Test
    void testFindUserById() {
        User user = new User();
        user.setFirstName("Alice");
        user.setLastName("Brown");
        user.setEmailAddress("alice.brown@example.com");
        user.setPassword(encoder.encode("mypassword"));
        user.setUserType("Adopter");

        User savedUser = userService.saveUser(user);
        Optional<User> retrievedUser = userService.findUser(savedUser.getId());

        assertTrue(retrievedUser.isPresent(), "Failed to retrieve user by ID");
        assertEquals("Alice", retrievedUser.get().getFirstName(), "First name mismatch");
    }

    @Test
    void testChangePassword() {
        User user = new User();
        user.setFirstName("Bob");
        user.setLastName("Martin");
        user.setEmailAddress("bob.martin@example.com");
        user.setPassword(encoder.encode("oldpassword"));
        user.setUserType("Adopter");

        userService.saveUser(user);

        ChangePassword changePassword = new ChangePassword();
        changePassword.setEmail("bob.martin@example.com");
        changePassword.setPassword("newpassword");

        userService.changePassword(changePassword);
        User updatedUser = userRepository.findByEmailAddress("bob.martin@example.com").get();

        assertTrue(encoder.matches("newpassword", updatedUser.getPassword()), "Password was not updated");
    }

    @Test
    void testDeleteUser() {
        User user = new User();
        user.setFirstName("Chris");
        user.setLastName("Taylor");
        user.setEmailAddress("chris.taylor@example.com");
        user.setPassword(encoder.encode("securepassword"));
        user.setUserType("Adopter");

        userService.saveUser(user);

        ChangePassword deleteRequest = new ChangePassword();
        deleteRequest.setEmail("chris.taylor@example.com");
        userService.deleteUser(deleteRequest);

        Optional<User> deletedUser = userService.findUserByEmail("chris.taylor@example.com");
        assertTrue(deletedUser.isEmpty(), "User was not deleted");
    }

    @Test
    void testRegisterUser() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setFirstName("David");
        registerRequest.setLastName("Green");
        registerRequest.setEmailAddress("david.green@example.com");
        registerRequest.setPassword("registerpass");
        registerRequest.setUserType("Adopter");

        User registeredUser = userService.register(registerRequest);

        assertNotNull(registeredUser, "Failed to register user");
        assertTrue(encoder.matches("registerpass", registeredUser.getPassword()), "Password does not match");
    }

    @Test
    void testFindNonAdoptionUsers() {
        User user1 = new User();
        user1.setFirstName("Eve");
        user1.setLastName("White");
        user1.setEmailAddress("eve.white@example.com");
        user1.setPassword(encoder.encode("password"));
        user1.setUserType("Adopter");

        User user2 = new User();
        user2.setFirstName("Frank");
        user2.setLastName("Black");
        user2.setEmailAddress("frank.black@example.com");
        user2.setPassword(encoder.encode("password"));
        user2.setUserType("Staff");

        AdoptionCenter center = new AdoptionCenter();
        center.setCenterName("Adoption Center");
        center.setBuildingAddress("456 Adoption Rd, Waco, TX");
        adoptionCenterRepository.save(center);

        user2.setCenter(center);

        userService.saveUser(user1);
        userService.saveUser(user2);

        List<User> nonAdoptionUsers = userService.findNonAdoptionUsers();
        assertEquals(1, nonAdoptionUsers.size(), "Incorrect number of non-adoption users");
        assertEquals("Eve", nonAdoptionUsers.get(0).getFirstName(), "Non-adoption user mismatch");
    }
}
