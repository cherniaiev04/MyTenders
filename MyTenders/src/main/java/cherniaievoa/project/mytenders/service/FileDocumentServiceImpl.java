package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.FileDocument;
import cherniaievoa.project.mytenders.repository.FileDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileDocumentServiceImpl implements FileDocumentService {

  FileDocumentRepository fileDocumentRepository;

  @Autowired
  public FileDocumentServiceImpl(FileDocumentRepository fileDocumentRepository) {
    this.fileDocumentRepository = fileDocumentRepository;
  }

  @Override
  public List<FileDocument> getAllFileDocuments() {
    return fileDocumentRepository.findAll();
  }

  @Override
  public FileDocument getFileDocumentById(String id) {
    return fileDocumentRepository.findById(id).orElse(null);
  }

  @Override
  public FileDocument saveFileDocument(FileDocument fileDocument) {
    return fileDocumentRepository.insert(fileDocument);
  }

  @Override
  public void deleteFileDocumentById(String id) {
    fileDocumentRepository.deleteById(id);
  }
}
