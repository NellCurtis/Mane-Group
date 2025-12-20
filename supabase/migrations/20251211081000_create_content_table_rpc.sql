-- Create RPC function to create content table
CREATE OR REPLACE FUNCTION create_content_table()
RETURNS VOID AS $$
BEGIN
  -- Create content table if it doesn't exist
  CREATE TABLE IF NOT EXISTS content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section TEXT NOT NULL,
    key TEXT NOT NULL,
    englishText TEXT NOT NULL,
    frenchText TEXT NOT NULL,
    imageUrl TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS content_section_idx ON content(section);
  CREATE INDEX IF NOT EXISTS content_key_idx ON content(key);

  -- Create trigger function if it doesn't exist
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- Create trigger
  DROP TRIGGER IF EXISTS update_content_updated_at ON content;
  CREATE TRIGGER update_content_updated_at BEFORE UPDATE
  ON content FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

  -- Insert initial data if table is empty
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'driving-school-hero', 'title', 'Auto-École Mane d''Afrique', 'Auto-École Mane d''Afrique', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'driving-school-hero' AND key = 'title');

  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'driving-school-hero', 'subtitle', 'Navigate your journey to new opportunities with expert driving instruction', 'Naviguez vers de nouvelles opportunités avec une instruction de conduite experte', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'driving-school-hero' AND key = 'subtitle');

  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration-hero', 'title', 'MANÉ Immigration', 'MANÉ Immigration', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration-hero' AND key = 'title');

  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration-hero', 'subtitle', 'Navigate your journey to new opportunities with expert immigration guidance', 'Naviguez vers de nouvelles opportunités avec un accompagnement d''immigration expert', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration-hero' AND key = 'subtitle');

  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'languages-hero', 'title', 'Mane Multi-Linguistique', 'Mane Multi-Linguistique', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'languages-hero' AND key = 'title');

  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'innovation-hero', 'title', 'Mane Innovation', 'Mane Innovation', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'innovation-hero' AND key = 'title');

  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'graphic-design-hero', 'title', 'Mane Graphic Design', 'Mane Graphisme', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'graphic-design-hero' AND key = 'title');
  
  -- Add more content entries for immigration page
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationTitle', 'MANÉ Immigration', 'MANÉ Immigration', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationTitle');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationSubtitle', 'Navigate your journey to new opportunities with expert immigration guidance', 'Naviguez vers de nouvelles opportunités avec un accompagnement d''immigration expert', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationSubtitle');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationMainHeading', 'Professional Immigration Services', 'Services d''Immigration Professionnels', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationMainHeading');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationMainDescription1', 'MANÉ Immigration provides comprehensive immigration consulting services to individuals, families and businesses seeking opportunities in countries around the world. Our experienced immigration consultants stay current with the latest immigration laws and policies to provide you with accurate, reliable guidance throughout your immigration journey.', 'MANÉ Immigration fournit des services complets de conseil en immigration aux particuliers, familles et entreprises recherchant des opportunités dans des pays du monde entier. Nos consultants en immigration expérimentés restent au courant des dernières lois et politiques d''immigration pour vous fournir des conseils précis et fiables tout au long de votre parcours migratoire.', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationMainDescription1');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationMainDescription2', 'With offices in multiple countries and partnerships with legal professionals worldwide, we offer unparalleled expertise in navigating complex immigration systems. Whether you''re seeking temporary residence, permanent settlement, citizenship, or family reunification, our team is dedicated to helping you achieve your goals efficiently and effectively.', 'Avec des bureaux dans plusieurs pays et des partenariats avec des professionnels juridiques du monde entier, nous offrons une expertise inégalée dans la navigation des systèmes d''immigration complexes. Que vous recherchiez une résidence temporaire, un établissement permanent, la citoyenneté ou le regroupement familial, notre équipe est dédiée à vous aider à atteindre vos objectifs efficacement et efficacement.', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationMainDescription2');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationApproachHeading', 'Our Immigration Approach', 'Notre Approche d''Immigration', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationApproachHeading');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationApproachDescription1', 'We combine technical excellence with strategic foresight to deliver solutions that not only meet today''s needs but anticipate tomorrow''s challenges.', 'Nous combinons l''excellence technique avec une vision stratégique pour livrer des solutions qui répondent non seulement aux besoins d''aujourd''hui mais anticipent les défis de demain.', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationApproachDescription1');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationClientCentric', 'Client-Centric Approach', 'Approche Axée sur le Client', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationClientCentric');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationApproachDescription2', 'Every solution we build is designed with scalability and adaptability at its core, ensuring longevity in a rapidly changing legal environment.', 'Chaque solution que nous construisons est conçue avec évolutivité et adaptabilité au cœur, assurant la longévité dans un environnement juridique en mutation rapide.', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationApproachDescription2');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationFeaturesHeading', 'Our Immigration Services', 'Nos Services d''Immigration', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationFeaturesHeading');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationProcessHeading', 'Our Immigration Process', 'Notre Processus d''Immigration', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationProcessHeading');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationWhyChooseHeading', 'Why Choose Our Immigration Services', 'Pourquoi Choisir Nos Services d''Immigration', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationWhyChooseHeading');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationTechnicalExcellenceHeading', 'Our Technical Excellence', 'Notre Excellence Technique', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationTechnicalExcellenceHeading');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationCommitmentToSuccessHeading', 'Our Commitment to Success', 'Notre Engagement envers le Succès', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationCommitmentToSuccessHeading');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationResultsHeading', 'Immigration That Delivers Results', 'Immigration Qui Délivre des Résultats', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationResultsHeading');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationResultsDescription', 'Our immigration solutions don''t just meet requirements—they exceed expectations and drive measurable outcomes.', 'Nos solutions d''immigration ne se contentent pas de répondre aux exigences—elles dépassent les attentes et génèrent des résultats mesurables.', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationResultsDescription');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationCallToAction', 'Ready to Begin Your Immigration Journey?', 'Prêt à Commencer Votre Parcours d''Immigration ?', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationCallToAction');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationCallToActionDescription', 'Contact us today for a confidential consultation about your immigration options', 'Contactez-nous dès aujourd''hui pour une consultation confidentielle sur vos options d''immigration', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationCallToActionDescription');
  
  -- Add process steps
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationProcessSteps.0', 'Initial Consultation', 'Consultation Initiale', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationProcessSteps.0');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationProcessSteps.1', 'Document Preparation', 'Préparation des Documents', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationProcessSteps.1');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationProcessSteps.2', 'Application Submission', 'Soumission de la Demande', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationProcessSteps.2');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationProcessSteps.3', 'Follow-up & Support', 'Suivi et Support', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationProcessSteps.3');
  
  -- Add process descriptions
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationProcessDescriptions.0', 'We assess your eligibility and discuss your immigration goals. Our experts provide personalized advice tailored to your unique situation and aspirations.', 'Nous évaluons votre admissibilité et discutons de vos objectifs d''immigration. Nos experts fournissent des conseils personnalisés adaptés à votre situation et aspirations uniques.', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationProcessDescriptions.0');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationProcessDescriptions.1', 'Our team helps gather and prepare all required documentation. We ensure every form is completed accurately to prevent delays or rejections.', 'Notre équipe aide à rassembler et préparer tous les documents requis. Nous veillons à ce que chaque formulaire soit rempli avec précision pour éviter les retards ou les rejets.', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationProcessDescriptions.1');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationProcessDescriptions.2', 'We submit your application and monitor its progress. Track your case status in real-time with our advanced monitoring system.', 'Nous soumettons votre demande et surveillons ses progrès. Suivez l''état de votre dossier en temps réel avec notre système de surveillance avancé.', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationProcessDescriptions.2');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationProcessDescriptions.3', 'Continuous support until you achieve your immigration goals. We stay with you through every stage of the process, providing updates and guidance.', 'Support continu jusqu''à ce que vous atteigniez vos objectifs d''immigration. Nous restons avec vous à chaque étape du processus, en fournissant des mises à jour et des orientations.', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationProcessDescriptions.3');
  
  -- Add stats
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationStats.0', '98%', '98%', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationStats.0');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationStats.1', '15+', '15+', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationStats.1');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationStats.2', '2000+', '2000+', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationStats.2');
  
  -- Add stat labels
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationStatLabels.0', 'Success Rate', 'Taux de Réussite', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationStatLabels.0');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationStatLabels.1', 'Years Experience', 'Années d''Expérience', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationStatLabels.1');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationStatLabels.2', 'Cases Handled', 'Cas Traités', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationStatLabels.2');
  
  -- Add advantages
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationAdvantages.0', 'Highest approval rates in the industry', 'Les taux d''approbation les plus élevés de l''industrie', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationAdvantages.0');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationAdvantages.1', 'Expert consultants with legal backgrounds', 'Consultants experts avec formation juridique', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationAdvantages.1');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationAdvantages.2', 'Personalized approach for each client', 'Approche personnalisée pour chaque client', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationAdvantages.2');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationAdvantages.3', 'Transparent pricing with no hidden fees', 'Tarification transparente sans frais cachés', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationAdvantages.3');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationAdvantages.4', 'Regular updates on case progress', 'Mises à jour régulières sur l''avancement du dossier', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationAdvantages.4');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationCommitmentToSuccess.0', 'Multilingual staff serving diverse communities', 'Personnel multilingue servant des communautés diverses', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationCommitmentToSuccess.0');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationCommitmentToSuccess.1', 'Comprehensive support from start to finish', 'Support complet du début à la fin', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationCommitmentToSuccess.1');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationCommitmentToSuccess.2', 'Strong relationships with government agencies', 'Relations solides avec les agences gouvernementales', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationCommitmentToSuccess.2');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationCommitmentToSuccess.3', 'Proven track record of successful cases', 'Bilan éprouvé de cas réussis', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationCommitmentToSuccess.3');
  
  INSERT INTO content (section, key, englishText, frenchText, imageUrl)
  SELECT 'immigration', 'immigrationCommitmentToSuccess.4', 'Ethical and professional standards', 'Normes éthiques et professionnelles', NULL
  WHERE NOT EXISTS (SELECT 1 FROM content WHERE section = 'immigration' AND key = 'immigrationCommitmentToSuccess.4');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;