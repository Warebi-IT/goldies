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
              Chez Goldies Travel, nous accordons une importance primordiale à la protection de vos données personnelles. Cette politique vise à vous informer en toute transparence sur la manière dont nous collectons, utilisons et protégeons vos informations conformément au Règlement Général sur la Protection des Données (RGPD).
            </p>

            <h2>1. Données collectées</h2>
            <p>
              Nous collectons les données suivantes lorsque vous utilisez notre site ou nos services :
            </p>
            <ul>
              <li><strong>Données d'identification :</strong> Nom, prénom, email, numéro de téléphone (via les formulaires de contact ou de réservation).</li>
              <li><strong>Données de navigation :</strong> Adresse IP, type de navigateur, pages visitées (si vous acceptez les cookies analytiques).</li>
            </ul>

            <h2>2. Utilisation des données</h2>
            <p>Vos données sont utilisées exclusivement pour :</p>
            <ul>
              <li>Traiter vos demandes de contact et réservations.</li>
              <li>Vous informer sur l'organisation des séjours.</li>
              <li>Améliorer votre expérience sur notre site via des analyses statistiques anonymisées.</li>
            </ul>

            <h2>3. Conservation des données</h2>
            <p>
              Vos données sont conservées pendant la durée nécessaire à la finalité pour laquelle elles ont été collectées, et conformément aux obligations légales :
            </p>
            <ul>
              <li>Données clients : 3 ans après la fin de la relation commerciale.</li>
              <li>Données prospects : 3 ans à compter du dernier contact.</li>
            </ul>

            <h2>4. Partage des données</h2>
            <p>
              Nous ne vendons, ne louons, ni ne partageons vos données personnelles à des tiers à des fins commerciales. Elles peuvent être transmises uniquement à nos partenaires logistiques (hébergements, transports sur place) dans le strict cadre de l'organisation de votre séjour.
            </p>

            <h2>5. Vos droits (RGPD)</h2>
            <p>
              Vous disposez des droits suivants concernant vos données :
            </p>
            <ul>
              <li>Droit d'accès et de rectification.</li>
              <li>Droit à l'effacement (droit à l'oubli).</li>
              <li>Droit à la limitation du traitement.</li>
              <li>Droit à la portabilité de vos données.</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@goldiestravel.com">contact@goldiestravel.com</a>.
            </p>

            <h2>6. Cookies</h2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal. Vous pouvez à tout moment modifier vos préférences via notre bandeau de cookies. Les cookies strictement nécessaires au fonctionnement du site ne requièrent pas votre consentement.
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;
