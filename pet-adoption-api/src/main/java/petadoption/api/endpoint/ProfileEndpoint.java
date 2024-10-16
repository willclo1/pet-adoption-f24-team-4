package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.ChangePassword;
import petadoption.api.user.RegisterRequest;
import petadoption.api.user.UserService;

@Log4j2
@RestController
public class ProfileEndpoint {

    @Autowired
    UserService userService;

    @RequestMapping(value = "/profile", method = RequestMethod.PUT)
    public ResponseEntity<ChangePassword> ProfileStatement(@RequestBody ChangePassword user) {
        try{

            System.out.println("ROBLOX");
            System.out.println(user.getEmail());
            System.out.println(user.getPassword());

            if(user.getPassword() ==  null){
                System.out.println("JAMES CHARKLES");
                user.setPassword("BOB");
            }
            userService.changePassword(user);
            return ResponseEntity.ok(user);
        } catch (Exception e){
            log.error("Error registering User");
            return ResponseEntity.badRequest().build();
        }

    }


    @RequestMapping(value = "/profile", method = RequestMethod.DELETE)
    public ResponseEntity<ChangePassword> DeleteAccount(@RequestBody ChangePassword user) {
        try{

            System.out.println("ROBLOX");

            userService.deleteUser(user);
            return ResponseEntity.ok(user);
        } catch (Exception e){
            log.error("Error registering User");
            return ResponseEntity.badRequest().build();
        }

    }

}