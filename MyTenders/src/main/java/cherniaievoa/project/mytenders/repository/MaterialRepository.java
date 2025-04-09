package cherniaievoa.project.mytenders.repository;

import cherniaievoa.project.mytenders.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
}
