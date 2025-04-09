package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.MaterialsForProject;

import java.util.List;

public interface MaterialsForProjectService {

  List<MaterialsForProject> getAllMaterialsForProject();

  List<MaterialsForProject> getMaterialsByProjectID(Long ID);

  MaterialsForProject getMaterialsByProject(Long ID);

  MaterialsForProject save(MaterialsForProject materialsForProject);

  MaterialsForProject update(MaterialsForProject materialsForProject);

  void deleteMaterialsForProjectById(Long id);

  List<MaterialsForProject> getMaterialsByMaterialID(Long ID);
}
