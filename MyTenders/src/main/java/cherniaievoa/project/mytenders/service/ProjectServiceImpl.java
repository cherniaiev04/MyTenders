package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.Project;
import cherniaievoa.project.mytenders.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectServiceImpl implements ProjectService{


  private ProjectRepository projectRepository;

  @Autowired
  public ProjectServiceImpl(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  @Override
  public List<Project> getAllProjects() {
    List<Project> projects = projectRepository.findAll();

    return projectRepository.findAll();
  }

  @Override
  public Project getProjectById(Long id) {
    return projectRepository.findById(id).orElse(null);
  }

  @Override
  public Project getProjectByIdOnWebSite(String id) {
    return projectRepository.findProjectsByNumberOfProject(id);
  }

  @Override
  public Project saveProject(Project project) {
    return projectRepository.save(project);
  }

  @Override
  public Project updateProject(Project project) {
    Optional<Project> existingProject = projectRepository.findById(project.getId());
    if (existingProject.isPresent()) {
      Project updatedProject = existingProject.get();

      updatedProject.setName(project.getName());
      updatedProject.setDate(project.getDate());
      updatedProject.setStatus(project.getStatus());
      updatedProject.setNumberOfProject(project.getNumberOfProject());
      updatedProject.setAdditionalInformation(project.getAdditionalInformation());
      updatedProject.setParticipate(project.isParticipate());
      updatedProject.setStatus(project.getStatus());
      updatedProject.setDocuments(project.getDocuments());
      updatedProject.setUsers(project.getUsers());
      return projectRepository.save(updatedProject);
    }
    return null;
  }

  @Override
  public Boolean existedById(Long id) {
    return projectRepository.existsById(id);
  }

  @Override
  public void deleteProjectById(Long id) {
   projectRepository.deleteById(id);
  }
}
