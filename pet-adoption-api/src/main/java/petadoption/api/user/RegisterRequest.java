package petadoption.api.user;

import lombok.Data;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String emailAddress;
    private String password;
    private String userType;
    private Long adoptionId;
}