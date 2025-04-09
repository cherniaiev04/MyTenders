package cherniaievoa.project.mytenders.controller;

import cherniaievoa.project.mytenders.dto.OrderDto;
import cherniaievoa.project.mytenders.entity.HistoryOfOrders;
import cherniaievoa.project.mytenders.entity.Material;
import cherniaievoa.project.mytenders.entity.Provider;
import cherniaievoa.project.mytenders.service.HistoryOfOrdersServiceImpl;
import cherniaievoa.project.mytenders.service.MaterialServiceImpl;
import cherniaievoa.project.mytenders.service.ProviderServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin
@RequestMapping("/providers")
public class ProviderController {

  private final ProviderServiceImpl providerService;
  private final HistoryOfOrdersServiceImpl historyOfOrdersService;
  private final MaterialServiceImpl materialService;

  @Autowired
  public ProviderController(ProviderServiceImpl providerService, HistoryOfOrdersServiceImpl historyOfOrdersService, MaterialServiceImpl materialService) {
    this.providerService = providerService;
    this.historyOfOrdersService = historyOfOrdersService;
    this.materialService = materialService;
  }

  @GetMapping
  public ResponseEntity<List<Provider>> getAllProviders() {
    return ResponseEntity.ok(providerService.getAllProviders());
  }

  @PostMapping("/add")
  public ResponseEntity<Provider> add(@RequestBody Provider provider) {
    Provider newProvider = providerService.saveProvider(provider);
    return ResponseEntity.ok(newProvider);
  }

  @PutMapping("/{id}")
  public ResponseEntity updateProvider(@PathVariable Long id, @RequestBody Provider providerDetails) {
    Provider updatedProvider = providerService.getProviderById(id);
    updatedProvider.setCompanyName(providerDetails.getCompanyName());
    updatedProvider.setName(providerDetails.getName());
    updatedProvider.setSurname(providerDetails.getSurname());
    updatedProvider.setPhone(providerDetails.getPhone());
    updatedProvider.setEmail(providerDetails.getEmail());
    providerService.updateProvider(updatedProvider);

    return ResponseEntity.ok(updatedProvider);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Provider> getProviderById(@PathVariable Long id) {
    return ResponseEntity.ok(providerService.getProviderById(id));
  }

  @GetMapping("/{id}/orders")
  public ResponseEntity<List<HistoryOfOrders>> getHistoryOfOrders(@PathVariable Long id) {
    Provider provider = providerService.getProviderById(id);
    List<HistoryOfOrders> orders = historyOfOrdersService.getHistoryOfOrdersByProvder(provider);
    return ResponseEntity.ok(orders);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity deleteProviderById(@PathVariable Long id) {
    providerService.deleteProviderById(id);
    return ResponseEntity.ok().build();
  }
}