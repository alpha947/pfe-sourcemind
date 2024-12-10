package gn.dgd.dis.pod.service.impl;

import gn.dgd.dis.pod.constant.Constants;
import gn.dgd.dis.pod.dto.Document;
import gn.dgd.dis.pod.dto.api.IDocument;
import gn.dgd.dis.pod.entity.DocumentEntity;
import gn.dgd.dis.pod.service.DocumentService;
import gn.dgd.dis.pod.service.UserService;
import gn.dgd.dis.pod.utils.DocumentUtils;
import gn.dgd.dis.pod.exception.ApiException;
import gn.dgd.dis.pod.repository.DocumentRepository;
import gn.dgd.dis.pod.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
import static org.apache.commons.io.FileUtils.byteCountToDisplaySize;
import static org.apache.commons.io.FilenameUtils.getExtension;
import static org.springframework.data.domain.PageRequest.of;
import static org.springframework.util.StringUtils.cleanPath;

/**
 * Description : C'est une description standard de EAAD
 *
 * @Author Alpha_Amadou_DIALLO
 * @Version 1.0
 * @Date 28/05/2024
 * @LastModified 28/06/2024
 * @Email dialloalphaamadou947@gmail.com
 * @GitHub: https://github.com/alpha947
 */

@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Override
    public Page<IDocument> getDocuments(int page, int size) {
        return documentRepository.findDocuments(of(page, size, Sort.by("name")));
    }

    @Override
    public Page<IDocument> getDocuments(int page, int size, String name) {
        return documentRepository.findDocumentsByName(name, of(page, size, Sort.by("name")));
    }

    @Override
    public Collection<Document> saveDocuments(String userId, List<MultipartFile> documents) {
        List<Document> newDocuments = new ArrayList<>();
        var userEntity = userRepository.findUserByUserId(userId).get();
        var storage = Paths.get(Constants.FILE_STORAGE).toAbsolutePath().normalize();
        try {
            for(MultipartFile document : documents) {
                var filename = cleanPath(Objects.requireNonNull(document.getOriginalFilename()));
                if("..".contains(filename)) { throw new ApiException(String.format("Nom du fichier invalide: %s", filename)); }
                var documentEntity = DocumentEntity
                        .builder()
                        .documentId(UUID.randomUUID().toString())
                        .name(filename)
                        .owner(userEntity)
                        .extension(getExtension(filename))
                        .uri(DocumentUtils.getDocumentUri(filename))
                        .formattedSize(byteCountToDisplaySize(document.getSize()))
                        .icon(DocumentUtils.setIcon((getExtension(filename))))
                        .build();
                var savedDocument = documentRepository.save(documentEntity);
                Files.copy(document.getInputStream(), storage.resolve(filename), REPLACE_EXISTING);
                Document newDocument = DocumentUtils.fromDocumentEntity(savedDocument, userService.getUserById(savedDocument.getCreatedBy()), userService.getUserById(savedDocument.getUpdatedBy()));
                newDocuments.add(newDocument);
            }
            return newDocuments;
        } catch (Exception exception) {
            throw new ApiException("Impossible d'enregistrer le documents");
        }
    }

    @Override
    public IDocument updateDocument(String documentId, String name, String description) {
        try {
            var documentEntity = getDocumentEntity(documentId);
            var document = Paths.get(Constants.FILE_STORAGE).resolve(documentEntity.getName()).toAbsolutePath().normalize();
            Files.move(document, document.resolveSibling(name), REPLACE_EXISTING);
            documentEntity.setName(name);
            documentEntity.setDescription(description);
            documentRepository.save(documentEntity);
            return getDocumentByDocumentId(documentId);
        } catch (Exception exception) {
            throw new ApiException("Impossible de mettre a jour le documents");
        }
    }

    private DocumentEntity getDocumentEntity(String documentId) {
        return documentRepository.findByDocumentId(documentId).orElseThrow(() -> new ApiException("Documents non trouvé."));
    }

    @Override
    public void deleteDocument(String documentId) {

    }

    @Override
    public IDocument getDocumentByDocumentId(String documentId) {
        return documentRepository.findDocumentByDocumentId(documentId).orElseThrow(() -> new ApiException("Documents non trouvé."));
    }

    @Override
    public Resource getResource(String documentName) {
        try {
            var filePath = Paths.get(Constants.FILE_STORAGE).toAbsolutePath().normalize().resolve(documentName);
            if(!Files.exists(filePath)) { throw new ApiException("Documents non trouvé."); }
            return new UrlResource(filePath.toUri());
        } catch (Exception exception) {
            throw new ApiException("Impossible de telecharger le documents");
        }
    }
}