import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MentionsLegales = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto max-w-[800px] px-6">
          <h1 className="font-pp-neue-corp-compact text-5xl md:text-7xl font-black text-ink uppercase tracking-tight mb-12">
            Mentions Légales
          </h1>
          
          <div className="prose prose-lg prose-headings:font-pp-neue-corp-compact prose-headings:uppercase prose-headings:tracking-tight prose-a:text-citra-orange max-w-none font-dm-sans text-ink/80">
            
            <h2>1. Éditeur du site</h2>
            <p>
              Le site <strong>Goldies Travel</strong> est édité par :<br/>
              [Nom de votre Société ou Auto-entreprise]<br/>
              [Statut juridique et Capital social si applicable]<br/>
              SIRET : [Numéro SIRET]<br/>
              Siège social : [Adresse physique, France]<br/>
              Directeur de la publication : [Votre Nom / Nom du dirigeant]
            </p>

            <h2>2. Hébergement</h2>
            <p>
              Ce site est hébergé par :<br/>
              [Nom de l'hébergeur, ex: Vercel Inc.]<br/>
              [Adresse de l'hébergeur]<br/>
              [Site web ou téléphone de l'hébergeur]
            </p>

            <h2>3. Contact</h2>
            <p>
              Pour toute question ou demande d'information, vous pouvez nous contacter :<br/>
              Par email : <a href="mailto:contact@goldiestravel.com">contact@goldiestravel.com</a><br/>
              Par téléphone : [Votre Numéro]
            </p>

            <h2>4. Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>

            <h2>5. Données personnelles</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant. Consultez notre <a href="/politique-confidentialite">Politique de Confidentialité</a> pour plus de détails.
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentionsLegales;
