import type { Scenario } from './scenarios';

// Premiers guides français traduits et associés à leurs pages anglaises équivalentes.
export const frScenarios: Scenario[] = [
  {
    slug: 'reunir-cours-et-notes-pour-reviser', pair: 'combine-lecture-notes-for-exams', group: 'student', tool: 'merge-pdf', tools: ['merge-pdf', 'compress-pdf', 'edit-pdf-pages'],
    title: 'Réunir des notes de cours et des diapositives dans un PDF', metaTitle: 'Réunir des notes et des diapositives dans un PDF | DoctorConverter',
    metaDescription: 'Rassemblez notes, présentations et exercices dans un PDF ordonné pour réviser avant un examen.', lead: 'Réunissez les documents de chaque chapitre dans un PDF et gardez l’ordre qui vous convient pour réviser.',
    queries: ['réunir des notes dans un PDF', 'fusionner des diapositives PDF pour réviser', 'assembler des notes de cours PDF'],
    sections: [
      { heading: 'Organiser les documents par chapitre', body: ['Téléchargez les notes et présentations que vous souhaitez consulter ensemble. Si vous avez des photos de notes, convertissez d’abord les fichiers JPG ou PNG en PDF.', 'L’ordre des fichiers dans la liste détermine celui des pages dans le document final.'] },
      { heading: 'Vérifier le PDF avant de réviser', body: ['Ouvrez le résultat et vérifiez que les chapitres sont dans l’ordre prévu. Si le fichier est trop volumineux, essayez de le compresser ; la réduction de taille n’est pas garantie.'] },
    ],
    steps: [{ title: 'Ajouter les documents', text: 'Sélectionnez les PDF contenant vos notes et diapositives.' }, { title: 'Définir l’ordre', text: 'Placez les chapitres dans l’ordre souhaité et ajoutez les exercices à la fin si cela vous convient.' }, { title: 'Fusionner et vérifier', text: 'Téléchargez le PDF et contrôlez les premières et dernières pages.' }],
    tips: ['Nommez les fichiers 01-chapitre.pdf, 02-chapitre.pdf pour les repérer facilement.', 'Convertissez d’abord les photos en PDF avec l’outil Images en PDF.'],
    faqs: [{ q: 'Puis-je modifier l’ordre des pages ?', a: 'Oui. Réorganisez les fichiers avant de les fusionner. Pour déplacer des pages dans un document, utilisez Organiser les pages PDF.' }],
  },
  {
    slug: 'photos-devoir-en-pdf', pair: 'homework-photos-to-pdf', group: 'student', tool: 'images-to-pdf', tools: ['images-to-pdf', 'edit-pdf-pages'],
    title: 'Réunir des photos de devoir dans un seul PDF', metaTitle: 'Convertir des photos de devoir en PDF | DoctorConverter',
    metaDescription: 'Ordonnez des photos JPG ou PNG et réunissez-les dans un PDF pour rendre un devoir ou partager des notes.', lead: 'Convertissez des photos de pages en PDF, dans l’ordre et l’orientation souhaités.',
    queries: ['convertir photos de devoir en PDF', 'photos en PDF pour rendre un devoir', 'convertir photos de notes en PDF'],
    sections: [
      { heading: 'Préparer les photos', body: ['Choisissez des images JPG ou PNG nettes et vérifiez que le texte est lisible. Si nécessaire, faites pivoter les photos sur votre appareil avant de les envoyer.', 'Les zones transparentes d’une image apparaissent en blanc dans le PDF.'] },
      { heading: 'Vérifier toutes les pages', body: ['Ouvrez le PDF et vérifiez que les pages sont complètes et dans le bon ordre avant de l’envoyer.'] },
    ],
    steps: [{ title: 'Sélectionner les images', text: 'Ajoutez les photos JPG ou PNG à inclure.' }, { title: 'Choisir l’ordre et le format', text: 'Réorganisez les images, puis choisissez le format et l’orientation des pages.' }, { title: 'Créer le PDF', text: 'Téléchargez le document et vérifiez chaque page.' }],
    tips: ['Photographiez chaque feuille avec un bon éclairage et évitez les ombres sur le texte.', 'Si une page est tournée, utilisez Organiser les pages PDF pour la corriger.'],
    faqs: [{ q: 'Dans quel ordre les photos apparaissent-elles ?', a: 'Le PDF suit l’ordre de la liste des fichiers. Vous pouvez le modifier avant de lancer le traitement.' }],
  },
  {
    slug: 'reunir-documents-demande-visa', pair: 'visa-application-documents-one-pdf', group: 'visa', tool: 'merge-pdf', tools: ['merge-pdf', 'images-to-pdf', 'compress-pdf'],
    title: 'Réunir des documents pour une demande de visa', metaTitle: 'Réunir les documents d’une demande de visa en PDF | DoctorConverter',
    metaDescription: 'Rassemblez les documents PDF d’une demande et classez-les selon les consignes du consulat ou de la plateforme.', lead: 'Préparez un PDF dont l’ordre suit les consignes de l’organisme qui reçoit votre demande.',
    queries: ['réunir documents demande visa PDF', 'assembler pièces dossier visa en PDF', 'documents de visa dans un seul PDF'],
    sections: [
      { heading: 'Suivre les consignes de la demande', body: ['Vérifiez les documents à joindre et l’ordre demandé. Les exigences varient selon le pays, le type de visa et l’organisme qui traite la demande.', 'Si vous avez une photo JPG ou PNG, convertissez-la en PDF avant de la réunir aux autres documents.'] },
      { heading: 'Vérifier le fichier avant l’envoi', body: ['Vérifiez que tous les documents sont complets et lisibles. Contrôlez la taille maximale autorisée par la plateforme ; la compression ne garantit pas une réduction.'] },
    ],
    steps: [{ title: 'Rassembler les fichiers', text: 'Sélectionnez les PDF et convertissez les photos de documents en PDF si nécessaire.' }, { title: 'Définir l’ordre', text: 'Suivez l’ordre indiqué dans les consignes de la demande.' }, { title: 'Fusionner et vérifier', text: 'Téléchargez le PDF et vérifiez que toutes les pages sont présentes.' }],
    tips: ['N’ajoutez pas de documents qui ne sont pas demandés.', 'Conservez une copie de chaque fichier d’origine.'],
    faqs: [{ q: 'Ce PDF convient-il à toutes les demandes de visa ?', a: 'L’outil réunit des fichiers mais ne vérifie pas les demandes. Suivez les consignes de l’ambassade, du consulat ou de la plateforme concernée.' }],
  },
];
