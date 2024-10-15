package petadoption.api.endpoint;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.Utility.Image;
import petadoption.api.Utility.ImageService;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import java.io.IOException;
import java.util.Optional;

import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/user/profile-image")
public class UserImageEndpoint {

    private final ImageService imageService;
    private final UserService userService;

    public UserImageEndpoint(ImageService imageService, UserService userService) {
        this.imageService = imageService;
        this.userService = userService;
    }

    @PostMapping("/{email}")
    public ResponseEntity<?> uploadProfileImage(@PathVariable String email,
                                                @RequestParam("image") MultipartFile file) throws IOException {
        Optional<User> userOptional = userService.findUserByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (user.getProfilePicture() != null) {

                Long oldImageId = user.getProfilePicture().getId();

                // Delete the old image
                imageService.deleteImage(oldImageId);
            }

            // Create a new profile image
            Image profileImage = new Image();
            profileImage.setName(file.getOriginalFilename());
            profileImage.setType(file.getContentType());
            profileImage.setImageData(file.getBytes());

            // Set the new profile image
            user.setProfilePicture(profileImage);
            userService.saveUser(user);

            return ResponseEntity.status(HttpStatus.OK).body("Profile image uploaded successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }
    @GetMapping("/{email}")
    public ResponseEntity<?> downloadProfileImage(@PathVariable String email) {

        Optional<User> userOptional = userService.findUserByEmail(email);
        if (userOptional.isPresent() && userOptional.get().getProfilePicture() != null) {
            byte[] imageData = userOptional.get().getProfilePicture().getImageData();
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.valueOf(IMAGE_PNG_VALUE))
                    .body(imageData);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or profile image not found.");
        }
    }
}