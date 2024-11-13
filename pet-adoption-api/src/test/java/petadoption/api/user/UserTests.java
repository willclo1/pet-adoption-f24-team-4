//package petadoption.api.user;
//
//import jakarta.transaction.Transactional;
//import net.minidev.json.JSONUtil;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.ActiveProfiles;
//import petadoption.api.userPreferences.UserPreferences;
//import petadoption.api.userPreferences.UserPreferencesService;
//
//import java.util.List;
//import java.util.Objects;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest
//@ActiveProfiles("testdb")  // make these tests use the H2 in-memory DB instead of your actual DB
//@Transactional             // make these tests revert their DB changes after the test is complete
//public class UserTests {
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    UserPreferencesService service;
//
//
//    @Test
//    void testUserCreate() {
//        User newUser = new User();
//        newUser.userType = "PETOWNER";
//        newUser.emailAddress = "example@example.com";
//        newUser.password = "password";
//
//        User savedUser = userService.saveUser(newUser);
//        assertNotNull(savedUser.id);
//
//        Optional<User> foundUserOpt = userService.findUser(savedUser.id);
//        assertTrue(foundUserOpt.isPresent());
//        User foundUser = foundUserOpt.get();
//
//        assertEquals(newUser.userType, foundUser.userType);
//        assertEquals(newUser.emailAddress, foundUser.emailAddress);
//        assertEquals(newUser.password, foundUser.password);
//    }
//    @Test
//    void testUserPreferences(){
//        UserPreferences userPreferences = new UserPreferences();
//        service.saveUserPreferences(userPreferences);
//    }
//
//    @Test
//    void testUserFind() {
//        Optional<User> user1 = userService.findUser(1L);
//        assertTrue(user1.isEmpty());
//    }
//    @BeforeEach
//    void setUp(){
//        userRepository.deleteAll();
//    }
//    @Test
//    void testUserCreation(){
//        for(int i = 0; i < 10; i++){
//            User user = new User();
//            user.setUserType("User");
//            user.setEmailAddress("testEmail@test.com");
//            user.setPassword("password");
//            user.setLastName("Test");
//            user.setFirstName("Test");
//            userRepository.save(user);
//        }
//        List<User> userList = userRepository.findAll();
//        assertEquals(10, userList.size(), "There should be 10 in the database");
//    }
//
//    @Test
//    void testSaveUser(){
//        User user = new User();
//        User userSave = userService.saveUser(user);
//        assertEquals(userSave, userService.findUser(1L).get(), "Users are equal");
//    }
//
//    @Test
//    void deleteUser(){
//        User user = new User();
//        user.setId(5L);
//        user.setEmailAddress("test@test");
//        user.setPassword("Hello");
//        userService.saveUser(user);
//
//        System.out.println("hi");
//        System.out.println(userService.findUser(5L));
//
//        ChangePassword userSave = new ChangePassword();
//        userSave.setFirstName("test@test");
//        userSave.setPassword("Hello");
//
//
//        userService.deleteUser(userSave);
//
//        assertNotEquals(user, userService.findUser(5L));
//    }
//
////    @Test
////    void changePassword(){
////
////
////        User user = new User();
////        user.setEmailAddress("test@test");
////        user.setPassword("hi");
////        userService.saveUser(user);
////
////
////        ChangePassword userSave = new ChangePassword();
////        userSave.setFirstName("test@test");
////        userSave.setPassword("Hello");
////        userService.changePassword(userSave);
////
////        Optional<User> test =  userService.findUserByEmail("test@test");
////
////        User testUser = test.orElse(new User());
////
////        assertEquals("Hello", testUser.getPassword());
////    }
//
//    @Test
//    void findUser(){
//        User user = new User();
//        user.setUserType("User");
//        user.setEmailAddress("testEmail@test.com");
//        user.setPassword("password");
//        user.setLastName("Test");
//        user.setFirstName("Test");
//        userService.saveUser(user);
//        assertEquals(user, userService.findUserByEmail("testEmail@test.com").get());
//    }
//}
