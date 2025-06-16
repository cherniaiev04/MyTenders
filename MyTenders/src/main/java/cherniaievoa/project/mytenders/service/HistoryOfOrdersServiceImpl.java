package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.HistoryOfOrders;
import cherniaievoa.project.mytenders.entity.Material;
import cherniaievoa.project.mytenders.entity.Provider;
import cherniaievoa.project.mytenders.repository.HistoryOfOrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HistoryOfOrdersServiceImpl implements HistoryOfOrdersService {

  HistoryOfOrdersRepository historyRepository;

  @Autowired
  public HistoryOfOrdersServiceImpl(HistoryOfOrdersRepository historyRepository) {
    this.historyRepository = historyRepository;
  }

  @Override
  public List<HistoryOfOrders> getAllHistoryOfOrders() {
    return historyRepository.findAll();
  }

  @Override
  public HistoryOfOrders getHistoryOfOrdersById(Long id) {
    return historyRepository.findById(id).orElse(null);
  }

  @Override
  public HistoryOfOrders saveHistoryOfOrders(HistoryOfOrders historyOfOrders) {
    return historyRepository.save(historyOfOrders);
  }

  @Override
  public HistoryOfOrders updateHistoryOfOrders(HistoryOfOrders historyOfOrders) {
    Optional<HistoryOfOrders> existingHistoryOfOrders = historyRepository.findById(historyOfOrders.getId());

    if(existingHistoryOfOrders.isPresent()) {
      HistoryOfOrders updatedHistoryOfOrders = existingHistoryOfOrders.get();

      updatedHistoryOfOrders.setMaterial(historyOfOrders.getMaterial());
      updatedHistoryOfOrders.setProvider(historyOfOrders.getProvider());
      updatedHistoryOfOrders.setDate(historyOfOrders.getDate());
      updatedHistoryOfOrders.setAmount(historyOfOrders.getAmount());
      updatedHistoryOfOrders.setPrice(historyOfOrders.getPrice());

      return historyRepository.save(updatedHistoryOfOrders);
    }
    return null;
  }

  @Override
  public void deleteHistoryOfOrdersById(Long id) {
    historyRepository.deleteById(id);
  }

  @Override
  public List<HistoryOfOrders> getHistoryOfOrdersByMaterial(Material material) {
    return historyRepository.getHistoryOfOrdersByMaterial(material);
  }

  @Override
  public List<HistoryOfOrders> getHistoryOfOrdersByProvder(Provider provider) {
    return historyRepository.getHistoryOfOrdersByProvider(provider);
  }

  @Override
  public boolean existedById(Long id) {
    return historyRepository.existsById(id);
  }
}
