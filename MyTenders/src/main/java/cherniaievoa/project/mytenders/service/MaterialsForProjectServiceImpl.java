package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.Material;
import cherniaievoa.project.mytenders.entity.MaterialsForProject;
import cherniaievoa.project.mytenders.entity.Project;
import cherniaievoa.project.mytenders.repository.MaterialRepository;
import cherniaievoa.project.mytenders.repository.MaterialsForProjectRepository;
import cherniaievoa.project.mytenders.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaterialsForProjectServiceImpl implements MaterialsForProjectService{

  private MaterialsForProjectRepository repository;
  private ProjectRepository projectRepository;
  private MaterialRepository materialRepository;

  @Autowired
  public MaterialsForProjectServiceImpl(MaterialsForProjectRepository repository, ProjectRepository projectRepository, MaterialRepository materialRepository) {
    this.repository = repository;
    this.projectRepository = projectRepository;
    this.materialRepository = materialRepository;
  }
  @Override
  public List<MaterialsForProject> getAllMaterialsForProject() {
    return repository.findAll();
  }

  @Override
  public List<MaterialsForProject> getMaterialsByProjectID(Long projectId) {
    Optional<Project> project = projectRepository.findById(projectId);
    if (project.isPresent()) {
      return repository.getMaterialsForProjectByProject(project.get());
    }
    return null;
  }

  @Override
  public MaterialsForProject getMaterialsByProject(Long ID) {
    return repository.findById(ID).orElse(null);
  }

  @Override
  public MaterialsForProject save(MaterialsForProject materialsForProject) {
    return repository.save(materialsForProject);
  }

  @Override
  public MaterialsForProject update(MaterialsForProject materialsForProject) {
    Optional<MaterialsForProject> existingMaterialsForProject = repository.findById(materialsForProject.getId());
    if (existingMaterialsForProject.isPresent()) {
      MaterialsForProject updatedMaterialsForProject = existingMaterialsForProject.get();

      updatedMaterialsForProject.setMaterial(materialsForProject.getMaterial());
      updatedMaterialsForProject.setAmount(materialsForProject.getAmount());
      updatedMaterialsForProject.setProject(materialsForProject.getProject());

      return repository.save(updatedMaterialsForProject);
    }
    return null;
  }

  @Override
  public void deleteMaterialsForProjectById(Long id) {
    repository.deleteById(id);
  }

  @Override
  public List<MaterialsForProject> getMaterialsByMaterialID(Long ID) {
    Optional<Material> material = materialRepository.findById(ID);
    if (material.isPresent()) {
      return repository.getMaterialsForProjectByMaterial(material.get());
    }
    return null;
  }
}
