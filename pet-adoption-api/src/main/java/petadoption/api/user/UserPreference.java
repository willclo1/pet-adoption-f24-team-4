//package petadoption.api.user;
//
//import jakarta.persistence.*;
//import lombok.Data;
//import petadoption.api.pet.criteria.Size;
//import petadoption.api.pet.criteria.Temperament;
//
//@Data
//@Entity
//@Table(name = "USER_PREFERENCES")
//public class UserPreference {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String furColor;
//    private String petType;
//    private String breed;
//    private Size petSize;
//    private int age;
//    private Temperament temperament;
//    private String healthStatus;
//
//}