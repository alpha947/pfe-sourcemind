//package gn.dgd.dlrri.ara.resource;
//
///**
// * Classe PdfController
// * <p>
// * Description : C'est la classe de traitement et d'exportation du  text contenu dans le fichier
// *
// * @Author Alpha_Amadou_DIALLO
// * @Version 1.0
// * @Date 09/08/2024
// * @LastModified 09/08/2024
// */
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import javax.xml.transform.TransformerException;
//import java.io.File;
//import java.io.FileInputStream;
//import java.io.IOException;
//import java.util.ArrayList;
//import java.util.List;
//
//@RestController
//public class PdfController {
//
// @PostMapping("/extract-text")
// public String extractText(@RequestParam("file") File file) throws IOException, TransformerException {
//  // Crée un objet PDFBox pour analyser le fichier PDF
//  PDDocument pdDocument = PDDocument.load(new FileInputStream(file));
//  List<String> textLines = new ArrayList<>();
//
//  // Parcours les pages du PDF et extraie le texte
//  for (int page = 0; page < pdDocument.getNumberOfPages(); page++) {
//   PDPage pageObject = pdDocument.getPage(page);
//   TextFlow tf = pageObject.getTextFlow();
//   List<TextFragment> fragments = tf.getTextFragments();
//
//   // Extraie le texte de chaque fragment et ajoute à la liste
//   for (TextFragment fragment : fragments) {
//    textLines.add(fragment.getText());
//   }
//  }
//
//  // Ferme le PDFBox
//  pdDocument.close();
//
//  // Retourne le texte extrait sous forme de chaîne
//  return String.join("\n", textLines);
// }
//}