package cherniaievoa.project.mytenders.service;

import cherniaievoa.project.mytenders.entity.FileDocument;

import java.util.List;

public interface FileDocumentService {

  List<FileDocument> getAllFileDocuments();
  FileDocument getFileDocumentById(String id);
  FileDocument saveFileDocument(FileDocument fileDocument);
  void deleteFileDocumentById(String id);
}
