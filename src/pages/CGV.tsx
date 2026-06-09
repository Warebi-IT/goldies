import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CGV = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto max-w-[800px] px-6">
          <h1 className="font-pp-neue-corp-compact text-5xl md:text-7xl font-black text-ink uppercase tracking-tight mb-12">
            Conditions Générales de Vente
          </h1>
          
          <div className="prose prose-lg prose-headings:font-pp-neue-corp-compact prose-headings:uppercase prose-headings:tracking-tight prose-a:text-citra-orange max-w-none font-dm-sans text-ink/80">
            
            <p><strong>Applicables à compter du {new Date().toLocaleDateString('fr-FR')}</strong></p>

            <p>
              <em>À noter : Ce document est un modèle de base. Avant l'ouverture officielle des réservations, il devra être validé et complété selon les spécificités de votre statut d'agence de voyage ou d'association (Immatriculation Atout France obligatoire pour la vente de séjours tout compris en France).</em>
            </p>

            <h2>1. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) définissent les modalités de vente des séjours touristiques organisés par Goldies Travel aux clientes (ci-après "la Voyageuse").
            </p>

            <h2>2. Réservation et Inscription</h2>
            <p>
              La réservation d'un séjour s'effectue via notre site internet. L'inscription n'est définitive qu'à réception de l'acompte (ou du paiement intégral) et après confirmation écrite de notre part. Goldies Travel se réserve le droit de refuser une inscription si les conditions d'éligibilité (ex: voyage exclusivement féminin) ne sont pas respectées.
            </p>

            <h2>3. Prix et Modalités de Paiement</h2>
            <p>
              Les prix sont indiqués en Euros Toutes Taxes Comprises (TTC). Ils comprennent l'hébergement, les activités mentionnées, et la demi-pension ou pension complète selon le programme. 
              <strong>Attention : Nos prix n'incluent jamais les billets d'avion, qui restent à la charge et sous la responsabilité de la Voyageuse.</strong>
            </p>
            <ul>
              <li>Un acompte de 30% est exigé lors de la réservation.</li>
              <li>Le solde doit être réglé au plus tard 45 jours avant la date de départ.</li>
            </ul>

            <h2>4. Annulation par la Voyageuse</h2>
            <p>
              En cas d'annulation par la Voyageuse, les frais suivants seront retenus :
            </p>
            <ul>
              <li>Plus de 60 jours avant le départ : retenue de l'acompte (30%).</li>
              <li>Entre 59 et 30 jours : 50% du montant total.</li>
              <li>Moins de 30 jours avant le départ : 100% du montant total.</li>
            </ul>
            <p>Nous vous recommandons vivement de souscrire à une assurance annulation multirisque lors de l'achat de vos billets d'avion.</p>

            <h2>5. Annulation par Goldies Travel</h2>
            <p>
              Si le nombre minimum de participantes n'est pas atteint 30 jours avant le départ, Goldies Travel se réserve le droit d'annuler le séjour. Les Voyageuses seront intégralement remboursées des sommes versées pour le séjour, mais ne pourront prétendre à aucune indemnité supplémentaire (notamment concernant les billets d'avion).
            </p>

            <h2>6. Responsabilité</h2>
            <p>
              Goldies Travel agit en tant qu'organisateur du séjour sur place. Nous ne saurions être tenus responsables des modifications de vols, retards, pertes de bagages ou incidents survenant lors du transport aérien, ni des incidents dus à des cas de force majeure (aléas climatiques, politiques, sanitaires).
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CGV;
