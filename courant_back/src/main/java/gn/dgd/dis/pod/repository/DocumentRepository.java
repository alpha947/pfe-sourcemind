package gn.dgd.dis.pod.repository;

import gn.dgd.dis.pod.constant.Constants;
import gn.dgd.dis.pod.dto.api.IDocument;
import gn.dgd.dis.pod.entity.DocumentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

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

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {
    @Query(countQuery = Constants.SELECT_COUNT_DOCUMENTS_QUERY, value = Constants.SELECT_DOCUMENTS_QUERY, nativeQuery = true)
    Page<IDocument> findDocuments(Pageable pageable);

    @Query(countQuery = Constants.SELECT_COUNT_DOCUMENTS_BY_NAME_QUERY, value = Constants.SELECT_DOCUMENTS_BY_NAME_QUERY, nativeQuery = true)
    Page<IDocument> findDocumentsByName(@Param("documentName") String documentName, Pageable pageable);

    @Query(value = Constants.SELECT_DOCUMENT_QUERY, nativeQuery = true)
    Optional<IDocument> findDocumentByDocumentId(String documentId);

    Optional<DocumentEntity> findByDocumentId(String documentId);
}


















