package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.Material;

import java.util.List;

public interface MaterialService {

  List<Material> getAllMaterials();
  Material getMaterialById(Long id);
  Material saveMaterial(Material material);
  Material updateMaterial(Material material);
  Boolean existedById(Long id);
  void deleteMaterialById(Long id);
}
