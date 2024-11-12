package petadoption.api.likedPets;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikedPetRepository extends JpaRepository<LikedPet, Long> {
    public List<LikedPet> findAllByUserId(long userId);
}
