package cherniaievoa.project.mytenders.repository;

import cherniaievoa.project.mytenders.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
  Project findProjectsByNumberOfProject(String numberOfProject);
}
