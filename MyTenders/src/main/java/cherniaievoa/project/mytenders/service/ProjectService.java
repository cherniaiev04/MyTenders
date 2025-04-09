package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.Project;

import java.util.List;

public interface ProjectService {

  List<Project> getAllProjects();
  Project getProjectById(Long id);
  Project getProjectByIdOnWebSite(String id);
  Project saveProject(Project project);
  Project updateProject(Project project);
  Boolean existedById(Long id);
  void deleteProjectById(Long id);

}

