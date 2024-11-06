package petadoption.api.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import petadoption.api.pet.Pet;

@Repository
public interface AdoptionCenterMessageRepository extends JpaRepository<AdoptionCenterMessage, Long> {
}
