//package petadoption.api.userPreferences;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.ActiveProfiles;
//import petadoption.api.pet.criteria.*;
//import petadoption.api.pet.criteria.breed.CatBreed;
//import petadoption.api.user.User;
//import petadoption.api.user.UserService;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//
//@SpringBootTest
//@ActiveProfiles("testDB")
////@Transactional
//public class UserPreferencesTests {
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private UserPreferencesService userPreferencesService;
//
//    private User BenDoverson;
//
//    @BeforeEach
//    void setup() {
//        userPreferencesService.deleteAllUserPreferences();
//        userService.deleteAllUsers();
//
//        BenDoverson = new User();
//        BenDoverson.setFirstName("Ben");
//        BenDoverson.setLastName("Doverson");
//        BenDoverson.setEmailAddress("ben@doverson.com");
//        BenDoverson.setPassword("BingB0ng!");
//        BenDoverson.setUserPreferences(new UserPreferences());
//        userService.saveUser(BenDoverson);
//    }
//
//    @Test
//    void testSpeciesRating() {
//        UserPreferences up = new UserPreferences();
//
//        // Ensure returning default value
//        assertEquals(
//                0,
//                up.getSpeciesRating(Species.CAT).compareTo(0.0),
//                "Default value not returned"
//        );
//        assertEquals(
//                0,
//                up.getSpeciesRating(Species.DOG).compareTo(0.0),
//                "Default value not returned"
//        );
//
//        // Setting a rating
//        up.setSpeciesRating(Species.CAT, 0.25);
//        up.setSpeciesRating(Species.DOG, 0.32);
//        assertEquals(
//                0,
//                up.getSpeciesRating(Species.CAT).compareTo(0.25),
//                "Cat rating assignment failed"
//        );
//        assertEquals(
//                0,
//                up.getSpeciesRating(Species.DOG).compareTo(0.32),
//                "Dog rating assignment failed"
//        );
//
//        // updating value
//        up.updateSpeciesRating(Species.CAT, 0.25);
//        assertEquals(
//                0,
//                up.getSpeciesRating(Species.CAT).compareTo(0.50),
//                "Cat rating update failed"
//        );
//        up.updateSpeciesRating(Species.DOG, 0.32);
//        assertEquals(
//                0,
//                up.getSpeciesRating(Species.DOG).compareTo(0.64),
//                "Dog rating update failed"
//        );
//
//        // clear ratings
//        up.clearSpeciesRating();
//        assert(up.getSpeciesPreferences().isEmpty());
//    }
//
//    @Test
//    void testLinkingUserPreferences() {
//        double DEFAULT_RATING = 0.25;
//
//        UserPreferences up = new UserPreferences();
//        up.setSpeciesRating(Species.CAT, DEFAULT_RATING);
//        up.setCatBreedRating(CatBreed.RAGAMUFFIN, DEFAULT_RATING);
//        up.setSizeRating(Size.SMALL, DEFAULT_RATING);
//        up.setFurColorRating(FurColor.WHITE, DEFAULT_RATING);
//        up.setFurColorRating(FurColor.TAN, DEFAULT_RATING);
//        up.setFurTypeRating(FurType.SMOOTH, DEFAULT_RATING);
//        up.setCoatLengthRating(CoatLength.LONG, DEFAULT_RATING);
//        up.setAgeRating(12, DEFAULT_RATING);
//        up.setTemperamentRating(Temperament.DEPENDENT, DEFAULT_RATING);
//        up.setTemperamentRating(Temperament.SWEET, DEFAULT_RATING);
//        up.setTemperamentRating(Temperament.AFFECTIONATE, DEFAULT_RATING);
//        up.setHealthRating(Health.EXCELLENT, DEFAULT_RATING);
//        up.setSpayedNeuteredRating(SpayedNeutered.SPAYED_NEUTERED, DEFAULT_RATING);
//        up.setSexRating(Sex.FEMALE, DEFAULT_RATING);
//
//        BenDoverson.setUserPreferences(up);
//        UserPreferences result = userPreferencesService.saveUserPreferences(up);
//        assertEquals(userService.findUser(BenDoverson.getId()).get().getUserPreferences(), result);
//        assertEquals(result, up);
//        System.out.println("Saved user preferences");
//    }
//}