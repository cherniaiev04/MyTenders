package cherniaievoa.project.mytenders.controller;

import cherniaievoa.project.mytenders.dto.OrderDto;
import cherniaievoa.project.mytenders.entity.*;
import cherniaievoa.project.mytenders.service.HistoryOfOrdersServiceImpl;
import cherniaievoa.project.mytenders.service.MaterialServiceImpl;
import cherniaievoa.project.mytenders.service.MaterialsForProjectServiceImpl;
import cherniaievoa.project.mytenders.service.ProviderServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Controller
@CrossOrigin
@RequestMapping("/materials")
public class MaterialControllers {

  private final MaterialServiceImpl materialService;
  private final MaterialsForProjectServiceImpl materialsForProjectService;
  private final HistoryOfOrdersServiceImpl historyOfOrdersService;
  private final ProviderServiceImpl providerService;
  @Autowired
  public MaterialControllers(MaterialServiceImpl materialService, MaterialsForProjectServiceImpl materialsForProjectService, HistoryOfOrdersServiceImpl historyOfOrdersService, ProviderServiceImpl providerService) {
    this.materialService = materialService;
    this.materialsForProjectService = materialsForProjectService;
    this.historyOfOrdersService = historyOfOrdersService;
    this.providerService = providerService;
  }

  @GetMapping
  public ResponseEntity<List<Material>> getAllMaterials() {
    return ResponseEntity.ok(materialService.getAllMaterials());
  }

  @PostMapping("/add")
  public ResponseEntity<Material> add(@RequestBody Material material) {
    Material newMaterial = materialService.saveMaterial(material);
    return ResponseEntity.ok(newMaterial);
  }

  @PutMapping("/{id}")
  public ResponseEntity updateAmount(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
    Material updatedMaterial = materialService.getMaterialById(id);
    updatedMaterial.setAmount(Math.toIntExact(payload.get("amount")));
    materialService.updateMaterial(updatedMaterial);

    return ResponseEntity.ok(updatedMaterial);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Material> getMaterialById(@PathVariable Long id) {
    return ResponseEntity.ok(materialService.getMaterialById(id));
  }
  @GetMapping("/{id}/orders")
  public ResponseEntity<List<HistoryOfOrders>> getHistoryOfOrders(@PathVariable Long id) {
    Material material = materialService.getMaterialById(id);
    List<HistoryOfOrders> orders = historyOfOrdersService.getHistoryOfOrdersByMaterial(material);
    return ResponseEntity.ok(orders);
  }

  @GetMapping("/{id}/usedAmount")
  public ResponseEntity<Integer> getUsedAmount(@PathVariable Long id) {
    int amount = 0;

    List<MaterialsForProject> materialsForProjects = materialsForProjectService.getMaterialsByMaterialID(id);
    for(MaterialsForProject material : materialsForProjects) {
      amount += material.getAmount();
    }

    return ResponseEntity.ok(amount);
  }
  @GetMapping("/forProjects")
  public ResponseEntity<Map<Long, Integer>> getMaterialForProjects() {
    Map<Long, Integer> materials = new HashMap<>();
    List<MaterialsForProject> materialsForProjects = materialsForProjectService.getAllMaterialsForProject();
    for(MaterialsForProject material : materialsForProjects) {
      if(!materials.containsKey(material.getId())) {
        materials.put(material.getMaterial().getId(), material.getAmount());
      } else {
        int amount = materials.get(material.getId());
        materials.remove(material.getMaterial().getId());
        materials.put(material.getMaterial().getId(), amount + material.getAmount());
      }
    }

    return ResponseEntity.ok(materials);
  }

  @PostMapping("/{id}/addOrder")
  public ResponseEntity<HistoryOfOrders> addOrder(@PathVariable Long id,
                                                  @RequestBody OrderDto orderDto,
                                                  @RequestParam boolean addToTotal) {
    Material materialToOrder = materialService.getMaterialById(id);
    HistoryOfOrders historyOfOrders = new HistoryOfOrders();
    historyOfOrders.setMaterial(materialToOrder);
    historyOfOrders.setPrice(orderDto.getPrice());
    historyOfOrders.setAmount(orderDto.getQuantity());
    historyOfOrders.setDate(orderDto.getDate());
    Provider providerOrder = providerService.getProviderById(orderDto.getProviderId());
    historyOfOrders.setProvider(providerOrder);

    if(addToTotal) {
      int totalAmount = materialToOrder.getAmount() + orderDto.getQuantity();
      materialToOrder.setAmount(totalAmount);
      materialService.updateMaterial(materialToOrder);
    }

    return ResponseEntity.ok(historyOfOrdersService.saveHistoryOfOrders(historyOfOrders));
  }

}
