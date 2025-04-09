package cherniaievoa.project.mytenders.repository;

import cherniaievoa.project.mytenders.entity.HistoryOfOrders;
import cherniaievoa.project.mytenders.entity.Material;
import cherniaievoa.project.mytenders.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryOfOrdersRepository extends JpaRepository<HistoryOfOrders, Long> {

  List<HistoryOfOrders> getHistoryOfOrdersByMaterial(Material material);

  List<HistoryOfOrders> getHistoryOfOrdersByProvider(Provider provider);
}
