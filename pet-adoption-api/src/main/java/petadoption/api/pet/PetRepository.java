package petadoption.api.pet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByCenter_adoptionID(long adoptionID);

    @Query("SELECT p from Pet p ORDER BY RAND() LIMIT ?1")
    List<Pet> getRandom(long numPets);
}
