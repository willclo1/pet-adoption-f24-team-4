package petadoption.api.user;

import lombok.Getter;
import lombok.Setter;

public class ChangeEmail {
    @Getter
    @Setter
    private String email;

    @Getter
    @Setter
    private String newEmail;
}
