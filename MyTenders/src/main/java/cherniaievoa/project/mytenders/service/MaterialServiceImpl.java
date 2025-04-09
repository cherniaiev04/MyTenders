package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.Material;
import cherniaievoa.project.mytenders.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaterialServiceImpl implements MaterialService {

  MaterialRepository materialRepository;

  @Autowired
  public MaterialServiceImpl(MaterialRepository materialRepository) {
    this.materialRepository = materialRepository;
  }

  @Override
  public List<Material> getAllMaterials() {
    return materialRepository.findAll();
  }

  @Override
  public Material getMaterialById(Long id) {
    return materialRepository.findById(id).orElse(null);
  }

  @Override
  public Material saveMaterial(Material material) {
    return materialRepository.save(material);
  }

  @Override
  public Material updateMaterial(Material material) {
    Optional<Material> existingMaterial = materialRepository.findById(material.getId());

    if(existingMaterial.isPresent()) {
      Material updatedMaterial = existingMaterial.get();

      updatedMaterial.setName(material.getName());
      updatedMaterial.setType(material.getType());
      updatedMaterial.setAmount(material.getAmount());

      return materialRepository.save(updatedMaterial);
    }
    return null;
  }

  @Override
  public Boolean existedById(Long id) {
    return materialRepository.existsById(id);
  }

  @Override
  public void deleteMaterialById(Long id) {
    materialRepository.deleteById(id);
  }
}
