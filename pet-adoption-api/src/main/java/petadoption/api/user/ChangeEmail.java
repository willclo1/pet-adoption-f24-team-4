package petadoption.api.user;

import lombok.Getter;

public class ChangeEmail
{

    // Getters and setters
    @Getter
    private String email;
    private String newEmail;


    public void setFirstName(String email) {
        this.email = email;
    }

    public String getPassword() {
        return newEmail;
    }

    public void setPassword(String newEmail) {
        this.newEmail = newEmail;
    }

}
