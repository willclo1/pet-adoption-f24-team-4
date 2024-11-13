package petadoption.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetRepository;
import petadoption.api.pet.PetService;

import java.util.Scanner;


@SpringBootApplication
public class PetAdoptionApplication {
	public static void main(String[] args) {

		SpringApplication.run(PetAdoptionApplication.class, args);
	}
}
