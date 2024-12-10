import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Query } from '../../models/IDocument';
import { documentAPI } from '../../services/DocumentService';
import Document from './Acte';
import DocumentLoader from './ActeLoader';
// mes propres dependances  
import 'react-datepicker/dist/react-datepicker.css';

const Actes = () => {
  const inputRef = React.useRef<HTMLInputElement>();
  const [query, setQuery] = React.useState<Query>({ page: 0, size: 4, name: '' });
  const { data: documentData, error, isSuccess, isLoading, refetch } = documentAPI.useFetchDocumentsQuery(query);
  // const [uploadDocuments, { data: uploadData, isLoading: uploadLoading, error: uploadError, isSuccess: uploadSuccess }] = documentAPI.useUploadDocumentsMutation();
  const [uploadDocuments] = documentAPI.useUploadDocumentsMutation();
  const selectDocuments = () => inputRef.current.click();

  const goToPage = async (direction: string) => {
    direction === 'back' ? setQuery((prev) => { return { ...prev, page: prev.page - 1 }}) : setQuery((prev) => { return { ...prev, page: prev.page + 1 }});
  };

  const onUploadDocuments = async (documents: FileList) => {
    if(documents) {
      const form = new FormData();
      Array.from(documents).forEach(document => form.append('files', document, document.name));
      await uploadDocuments(form);
    }
  };

  if(isLoading) {
    return <DocumentLoader />
  }

  return (
    <div className="container mtb">
      <div className="row">
        <div className="col-lg-12">
          <div className="align-items-center row">
            <div className="col-lg-4">
              <div className="mb-3 mb-lg-0">
                { documentData?.data.documents.content?.length > 0 && 
                <h6 className="fs-16 mb-0">{`afficher ${(documentData?.data?.documents.number * documentData?.data?.documents.size) + 1} - ${((documentData?.data?.documents.number * documentData?.data?.documents.size)) + documentData?.data.documents.content?.length} sur ${documentData?.data?.documents.totalElements}`}</h6>}
              </div>
            </div>
            
            <div className="col-lg-8">
              <div className="candidate-list-widgets">
                <div className="row"> 
                  <div className="col-lg-6 mb-2">
                    <div className="selection-widget">
                      <input type="search" onChange={(event) => setQuery((prev) => { return { ...prev, page: 0, name: event.target.value } })} name='name' className='form-control' id="email" placeholder="Rechercher un acte" required />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="selection-widget">
                      <select onChange={(event) => setQuery((prev) => { return { ...prev, size: +event.target.value } })} className="form-select" data-trigger="true" name="size" aria-label="Selectionner  la taille de la page">
                        <option value="4">(4) par page</option>
                        <option value="6">6</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-3" title="Pour ajouter un nouvel acte reglementaire seul le fichier est requis">
                    <div className="selection-widget mt-2 mt-lg-0">
                      <button type="button" onClick={selectDocuments} className="btn btn-primary w-100" style={{ display: 'inline-block' }}>
                        <i className="bi bi-upload upload-icon"></i>
                        Nouvel acte
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="candidate-list">
            {documentData?.data.documents.content?.length === 0 && <h4 className='card mt-4 align-items-center row' style={{border: 'none', boxShadow: 'none'}}>Aucun document</h4>}
            {documentData?.data.documents.content.map(document => <Document {...document} key={document.id} />)}
          </div>
        </div>
      </div>
      {documentData?.data.documents.content?.length > 0 && documentData?.data?.documents.totalPages > 1 &&
        <div className="row">
          <div className="mt-4 pt-2 col-lg-12">
            <nav aria-label="Page navigation example">
              <div className="pagination job-pagination mb-0 justify-content-center">
                <li className="page-item">
                  <a onClick={() => goToPage('back')} className={`page-link ' ${0 === query.page ? 'disabled' : undefined}`}>
                    <i className="bi bi-chevron-double-left"></i>
                  </a>
                </li>
                {[...Array(documentData?.data?.documents.totalPages).keys()].map((page, _index) =>
                  <li key={page} className='page-item'>
                    <a onClick={() => setQuery((prev) => { return { ...prev, page } })} className={`page-link ' ${page === query.page ? 'active' : undefined}`}>{page + 1}</a>
                  </li>
                )}
                <li className="page-item">
                  <a onClick={() => goToPage('forward')} className={`page-link ' ${documentData?.data?.documents.totalPages === query.page + 1 ? 'disabled' : undefined}`}>
                    <i className="bi bi-chevron-double-right"></i>
                  </a>
                </li>
              </div>
            </nav>
          </div>
        </div>}
      <div style={{ display: 'none' }}>
        <input type='file' ref={inputRef} onChange={(event) => onUploadDocuments(event.target.files)} name='file' accept='*' multiple />
      </div>
    </div>
  )
}

export default Actes;