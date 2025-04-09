package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.HistoryOfOrders;
import cherniaievoa.project.mytenders.entity.Material;
import cherniaievoa.project.mytenders.entity.Provider;

import java.util.List;

public interface HistoryOfOrdersService {

  List<HistoryOfOrders> getAllHistoryOfOrders();
  HistoryOfOrders getHistoryOfOrdersById(Long id);
  HistoryOfOrders saveHistoryOfOrders(HistoryOfOrders historyOfOrders);
  HistoryOfOrders updateHistoryOfOrders(HistoryOfOrders historyOfOrders);
  void deleteHistoryOfOrdersById(Long id);
  List<HistoryOfOrders> getHistoryOfOrdersByMaterial(Material material);
  List<HistoryOfOrders> getHistoryOfOrdersByProvder(Provider provider);
}
