package cherniaievoa.project.mytenders.repository;

import cherniaievoa.project.mytenders.entity.Material;
import cherniaievoa.project.mytenders.entity.MaterialsForProject;
import cherniaievoa.project.mytenders.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialsForProjectRepository extends JpaRepository<MaterialsForProject, Long> {
  List<MaterialsForProject> getMaterialsForProjectByProject(Project project);

  List<MaterialsForProject> getMaterialsForProjectByMaterial(Material material);
}
