package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.*;

import java.util.HashMap;
import java.util.Map;

@Log4j2
@RestController
public class ProfileEndpoint {

    @Autowired
    UserService userService;

    @RequestMapping(value = "/profile", method = RequestMethod.PUT)
    public ResponseEntity<ChangePassword> ProfileStatement(@RequestBody ChangePassword user) {
        try{
            userService.changePassword(user);
            return ResponseEntity.ok(user);
        } catch (Exception e){
            log.error("Error registering User");
            return ResponseEntity.badRequest().build();
        }

    }
    @RequestMapping(value = "/changeFirstName", method = RequestMethod.PUT)
    public ResponseEntity<String> changeFirstName(@RequestBody Map<String,String> values) {

        String email = values.get("email");
        String firstName = values.get("firstName");
        User user;
        try{

            if(userService.findUserByEmail(email).isPresent()){
                user = userService.findUserByEmail(email).get();
                user.setFirstName(firstName);
            }
            else throw new Exception();

            userService.change(user);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("hi");
    }
    @RequestMapping(value = "/changeLastName", method = RequestMethod.PUT)
    public ResponseEntity<String> changeLastName(@RequestBody Map<String,String> values) {

        String email = values.get("email");
        String firstName = values.get("lastName");
        User user;
        try{

            if(userService.findUserByEmail(email).isPresent()){
                user = userService.findUserByEmail(email).get();
                user.setLastName(firstName);
            }
            else throw new Exception();

            userService.change(user);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("hi");
    }

        @RequestMapping(value = "/changeEmail", method = RequestMethod.PUT)
    public ResponseEntity<Map<String, Object>> changeEmail(@RequestBody Map<String,String> emails) {


        System.out.println("hello");
            String email = emails.get("email");
        String newEmail = emails.get("newEmail");

        System.out.println(email);
        System.out.println(newEmail);
        User user;
        Map<String, Object> response = new HashMap<>();
            try{

                if(userService.findUserByEmail(email).isPresent()){
                    user = userService.findUserByEmail(email).get();
                    user.setEmailAddress(newEmail);
                }
                else throw new Exception();

                userService.change(user);

            } catch (Exception e) {
                throw new RuntimeException(e);
            }

        String token = userService.verify(user);
        response.put("token", token);
            return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/profile", method = RequestMethod.DELETE)
    public ResponseEntity<ChangePassword> DeleteAccount(@RequestBody ChangePassword user) {
        try{
            userService.deleteUser(user);
            return ResponseEntity.ok(user);

        } catch (Exception e){
            log.error("Error registering User");
            return ResponseEntity.badRequest().build();
        }

    }

}