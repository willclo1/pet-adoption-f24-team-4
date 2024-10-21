package petadoption.api.endpoint;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.Utility.Image;
import petadoption.api.Utility.ImageService;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import javax.imageio.plugins.jpeg.JPEGQTable;
import java.io.IOException;
import java.util.Optional;

import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;


@RestController
@RequestMapping("/pet/pet-image")
public class PetImageEndpoint {


    private final ImageService imageService;
    private final PetService petService;

    public PetImageEndpoint(ImageService imageService, PetService petService) {
        this.imageService = imageService;
        this.petService = petService;
    }

    @PostMapping("/{petId}")
    public ResponseEntity<?> updatePetImage(@PathVariable long petId,
                                                @RequestParam("image") MultipartFile file) throws IOException {
        Optional<Pet> userOptional = petService.getPetById(petId);
        if (userOptional.isPresent()) {
            Pet pet = userOptional.get();
            long adoptionId = pet.getCenter().getAdoptionID();

            if (pet.getProfilePicture() != null) {

                Long oldImageId = pet.getProfilePicture().getId();

                imageService.deleteImage(oldImageId);
            }

            // Create a new profile image
            Image profileImage = new Image();
            profileImage.setName(file.getOriginalFilename());
            profileImage.setType(file.getContentType());
            profileImage.setImageData(file.getBytes());

            pet.setProfilePicture(profileImage);
            petService.savePet(pet,adoptionId);

            return ResponseEntity.status(HttpStatus.OK).body("Profile image uploaded successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        /* Optional<Pet> existingPetOpt = petService.getPetById(petID);
        if (!existingPetOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Pet existingPet = existingPetOpt.set;
        */

    }
    @GetMapping("/{petId}")
    public ResponseEntity<?> downloadProfileImage(@PathVariable long petId) throws IOException {

        Optional<Pet> userOptional = petService.getPetById(petId);
        if (userOptional.isPresent() && userOptional.get().getProfilePicture() != null) {
            byte[] imageData = userOptional.get().getProfilePicture().getImageData();
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.valueOf(IMAGE_PNG_VALUE))
                    .body(imageData);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pet or profile image not found.");
        }
    }

}
