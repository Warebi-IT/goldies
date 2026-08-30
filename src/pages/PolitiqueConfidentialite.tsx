import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto max-w-[800px] px-6">
          <h1 className="font-pp-neue-corp-compact text-5xl md:text-7xl font-black text-ink uppercase tracking-tight mb-12">
            Politique de Confidentialité
          </h1>
          
          <div className="prose prose-lg prose-headings:font-pp-neue-corp-compact prose-headings:uppercase prose-headings:tracking-tight prose-a:text-citra-orange max-w-none font-dm-sans text-ink/80">
            
            <p><strong>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</strong></p>

            <p>
              Chez Goldies Travel, nous accordons une importance primordiale à la protection de votre vie privée et de vos données personnelles. Cette politique détaille de manière claire et transparente la manière dont nous collectons, traitons, archivons et protégeons vos données conformément au <strong>Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679)</strong> et à la <strong>Loi Informatique et Libertés</strong>.
            </p>

            <h2>1. Responsable de Traitement</h2>
            <p>
              Le responsable du traitement des données personnelles est <strong>Goldies Travel</strong>.<br/>
              Pour toute question ou demande relative à vos données : <a href="mailto:contact@goldiestravel.com">contact@goldiestravel.com</a>.
            </p>

            <h2>2. Données collectées et Finalités</h2>
            <p>Nous collectons et traitons les données strictement nécessaires aux finalités suivantes :</p>
            <ul>
              <li><strong>Gestion des demandes de contact (Prospects) :</strong> Nom, prénom, email, destination souhaitée, message. <em>(Base légale : Intérêt légitime et consentement)</em>.</li>
              <li><strong>Gestion des inscriptions et séjours (Clientes) :</strong> Nom, prénom, âge, email, numéro de téléphone, choix de formule et d'acompte. <em>(Base légale : Exécution du contrat de vente de voyage)</em>.</li>
              <li><strong>Données de santé et sécurité alimentaire :</strong> Allergies et régimes alimentaires déclarés. Ces données sensibles (Art. 9.2.a RGPD) sont collectées exclusivement avec votre accord exprès pour assurer votre sécurité physique durant les repas et activités du séjour.</li>
              <li><strong>Données de navigation et cookies :</strong> Adresse IP anonymisée et traceurs de mesure d'audience (uniquement si vous y consentez expressément).</li>
            </ul>

            <h2>3. Cycle de Vie et Durées de Conservation (Cycle RGPD)</h2>
            <p>
              Conformément au principe de limitation de la conservation (Art. 5.1.e RGPD) et aux obligations légales du Code de commerce et du Code de la consommation, vos données suivent un cycle de vie strict :
            </p>
            <ul>
              <li><strong>Données prospects (Formulaire de contact) :</strong> Conservées en base active pendant <strong>3 ans</strong> à compter du dernier contact émanant de votre part, puis supprimées définitivement.</li>
              <li><strong>Réservations non finalisées ou impayées :</strong> Supprimées automatiquement après <strong>90 jours</strong>.</li>
              <li><strong>Données de santé / allergies :</strong> Purgées définitivement de nos bases actives à l'issue du voyage (ou au maximum <strong>1 an</strong> après l'inscription).</li>
              <li><strong>Données de facturation et contrats de vente :</strong> Conservées en archivage sécurisé à accès restreint pendant <strong>10 ans</strong> conformément à l'article L. 123-22 du Code de commerce et L. 213-1 du Code de la consommation (obligations comptables et fiscales).</li>
              <li><strong>Au-delà de 10 ans :</strong> Les données personnelles restantes sont <strong>irréversiblement anonymisées</strong> pour ne conserver que des données statistiques non identifiantes.</li>
            </ul>

            <h2>4. Destinataires des Données</h2>
            <p>
              Vos données personnelles ne sont <strong>jamais vendues, louées ou cédées</strong> à des tiers à des fins publicitaires.<br/>
              Elles sont exclusivement transmises :
            </p>
            <ul>
              <li>À l'équipe interne de coordination de Goldies Travel.</li>
              <li>À nos prestataires logistiques locaux (hébergements, guides partenaires) strictement dans la mesure nécessaire à la bonne organisation de votre séjour.</li>
              <li>À notre prestataire de paiement sécurisé certifié PCI-DSS (Stripe) pour le traitement des règlements.</li>
              <li>À notre hébergeur d'infrastructure et de base de données certifié (Supabase, Vercel).</li>
            </ul>

            <h2>5. Vos Droits Informatique & Libertés</h2>
            <p>
              Conformément à la réglementation européenne, vous disposez des droits suivants :
            </p>
            <ul>
              <li><strong>Droit d'accès et de communication</strong> de vos données.</li>
              <li><strong>Droit de rectification</strong> des informations inexactes ou incomplètes.</li>
              <li><strong>Droit à l'effacement</strong> (« droit à l'oubli »), sous réserve des obligations légales de conservation comptable.</li>
              <li><strong>Droit à la limitation du traitement</strong> et droit d'opposition.</li>
              <li><strong>Droit à la portabilité</strong> de vos données dans un format structuré.</li>
              <li><strong>Droit de définir des directives</strong> relatives au sort de vos données après votre décès (Loi pour une République Numérique).</li>
            </ul>
            <p>
              Pour exercer l'un de ces droits, adressez votre demande par email à : <a href="mailto:contact@goldiestravel.com">contact@goldiestravel.com</a>.
            </p>
            <p>
              Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous disposez du droit d'introduire une réclamation auprès de l'autorité de contrôle française : la <strong>CNIL (Commission Nationale de l'Informatique et des Libertés)</strong> sur son site officiel <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a> ou par courrier postal au 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07.
            </p>

            <h2>6. Cookies & Traceurs</h2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal lors de la consultation d'un site. Vous pouvez à tout moment accepter, refuser ou modifier vos préférences en matière de cookies via notre bandeau dédié ou le lien en bas de page. Les cookies techniques indispensables au fonctionnement du site ne nécessitent pas de consentement préalable.
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;
