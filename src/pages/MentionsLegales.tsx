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
              Le site internet <strong>Goldies Travel</strong> (accessible à l'adresse <code>https://goldies.vercel.app</code>) est édité par :<br/>
              <strong>GOLDIES TRAVEL</strong><br/>
              Société par Actions Simplifiée (SAS) / Structure en cours d'immatriculation<br/>
              Siège social : France<br/>
              Contact email : <a href="mailto:contact@goldiestravel.com">contact@goldiestravel.com</a><br/>
              Directeur de la publication : Direction de Goldies Travel
            </p>

            <h2>2. Hébergement de l'application et de la base de données</h2>
            <p>
              <strong>Hébergeur de l'application web :</strong><br/>
              <strong>Vercel Inc.</strong><br/>
              440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br/>
              Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">https://vercel.com</a>
            </p>
            <p>
              <strong>Hébergeur de la base de données :</strong><br/>
              <strong>Supabase Inc.</strong><br/>
              970 Folsom St, San Francisco, CA 94107, États-Unis<br/>
              Infrastructure cloud sécurisée (Région Europe / UE - conformité RGPD).
            </p>

            <h2>3. Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents sur le site Goldies Travel (textes, logos, photographies, vidéos, icônes, éléments graphiques et charte visuelle) relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Toute reproduction, représentation, modification ou diffusion totale ou partielle, par quelque procédé que ce soit, sans autorisation écrite préalable, est formellement interdite et constitue une contrefaçon sanctionnée par les articles L. 335-2 et suivants du Code de la propriété intellectuelle.
            </p>

            <h2>4. Données personnelles et Cookies</h2>
            <p>
              Pour toute information concernant la collecte, le traitement et la protection de vos données personnelles ainsi que l'utilisation des cookies, nous vous invitons à consulter notre <a href="/politique-confidentialite">Politique de Confidentialité</a>.
            </p>

            <h2>5. Droit applicable et Juridiction compétente</h2>
            <p>
              Le présent site est soumis au droit français. En cas de litige relatif à l'utilisation du site ou à ses mentions légales, et à défaut de résolution amiable, compétence expresse est attribuée aux tribunaux français compétents.
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentionsLegales;
