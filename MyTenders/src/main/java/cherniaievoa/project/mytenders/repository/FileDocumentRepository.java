package cherniaievoa.project.mytenders.repository;

import cherniaievoa.project.mytenders.entity.FileDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FileDocumentRepository extends MongoRepository<FileDocument, String> {
}
