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

            <div className="bg-citra-orange/10 border-l-4 border-citra-orange p-4 my-6 rounded-r-xl not-prose">
              <p className="text-xs font-dm-sans text-ink/90 font-medium">
                <strong>Information préalable :</strong> La vente de forfaits touristiques et de séjours combinés est régie par les articles L. 211-1 et suivants et R. 211-1 et suivants du Code du Tourisme français (Directive européenne UE 2015/2302).
              </p>
            </div>

            <h2>1. Objet et Champ d'application</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) définissent les droits et obligations réciproques de Goldies Travel et de ses clientes (ci-après « la Voyageuse ») dans le cadre de l'organisation et de la vente de séjours immersifs et solidaires en Afrique.
            </p>

            <h2>2. Inscription et Réservation</h2>
            <p>
              La réservation d'un séjour s'effectue en ligne via le formulaire dédié. L'inscription devient ferme et définitive dès réception du paiement de l'acompte (ou du solde total) et confirmation par email de Goldies Travel. Goldies Travel propose des séjours conçus exclusivement en groupe féminin.
            </p>

            <h2>3. Prix et Modalités de Paiement</h2>
            <p>
              Les prix sont exprimés en <strong>Euros Toutes Taxes Comprises (TTC)</strong>. Ils comprennent l'hébergement, les transports locaux prévus dans l'itinéraire, les activités encadrées et la formule de restauration stipulée sur la fiche descriptive du voyage.
            </p>
            <p>
              <strong>Transport aérien :</strong> Sauf mention contraire écrite, nos tarifs <strong>n'incluent jamais les billets d'avion internationaux</strong>, qui restent sous l'entière responsabilité et à la charge de la Voyageuse.
            </p>
            <ul>
              <li><strong>Acompte :</strong> Un acompte de 30% du montant total est requis lors de la réservation en ligne.</li>
              <li><strong>Solde :</strong> Le solde restant doit être réglé au plus tard 45 jours avant la date de départ.</li>
              <li><strong>Paiement échelonné :</strong> Les options de paiement en plusieurs fois (ex: Klarna / Stripe) sont soumises aux conditions d'éligibilité du prestataire de paiement.</li>
            </ul>

            <h2>4. Absence de Droit de Rétractation (Art. L. 221-28 12° du Code de la consommation)</h2>
            <p>
              Conformément aux dispositions de l'<strong>article L. 221-28 12° du Code de la consommation</strong>, le droit de rétractation de 14 jours applicable aux contrats conclus à distance <strong>ne s'applique pas</strong> aux prestations de services d'hébergement, de transport, de restauration ou d'activités de loisirs devant être fournis à une date ou selon une périodicité déterminée. Toute inscription confirmée est donc ferme et soumise aux conditions d'annulation ci-dessous.
            </p>

            <h2>5. Conditions d'Annulation et de Remboursement</h2>
            <p><strong>Annulation par la Voyageuse :</strong></p>
            <ul>
              <li><strong>Plus de 60 jours avant le départ :</strong> Retenue du montant de l'acompte (30%).</li>
              <li><strong>Entre 59 et 30 jours avant le départ :</strong> Retenue de 50% du montant total du séjour.</li>
              <li><strong>Moins de 30 jours avant le départ :</strong> Retenue de 100% du montant total du séjour.</li>
            </ul>
            <p>
              <em>Nous recommandons vivement à chaque participante de souscrire une assurance voyage multirisque annulation/rapatriement auprès de son assureur.</em>
            </p>

            <p><strong>Annulation par Goldies Travel :</strong></p>
            <p>
              Si le quota minimum de participantes requis pour la réalisation du séjour n'est pas atteint 30 jours avant le départ, Goldies Travel se réserve le droit d'annuler le voyage. Dans cette hypothèse, la Voyageuse sera intégralement remboursée des sommes versées à Goldies Travel, à l'exclusion de toute indemnisation relative aux frais engagés de manière indépendante (notamment les billets d'avion).
            </p>

            <h2>6. Cession de Contrat (Art. L. 211-11 du Code du Tourisme)</h2>
            <p>
              La Voyageuse peut céder son contrat à un tiers remplissant exactement les mêmes conditions requises pour le voyage, à condition d'en informer Goldies Travel par écrit au plus tard 7 jours avant le début du séjour. Le cédant et le cessionnaire sont solidairement responsables du paiement du solde du prix et des éventuels frais administratifs supplémentaires occasionnés par cette cession.
            </p>

            <h2>7. Responsabilité et Assurances</h2>
            <p>
              Goldies Travel est titulaire d'une police d'Assurance Responsabilité Civile Professionnelle (RCP) couvrant les conséquences pécuniaires de son activité d'opérateur de voyages. Goldies Travel ne saurait être tenue responsable des retards, annulations de vols, pertes de bagages ou incidents imputables au transporteur aérien ou à des événements de force majeure (conditions météorologiques extrêmes, crises sanitaires, instabilité politique).
            </p>

            <h2>8. Réclamations et Médiation de la Consommation</h2>
            <p>
              Pour toute réclamation, la Voyageuse est invitée à contacter notre service client par email à <a href="mailto:contact@goldiestravel.com">contact@goldiestravel.com</a>.
            </p>
            <p>
              Si aucune solution amiable n'est trouvée dans un délai de 60 jours, la Voyageuse a le droit de recourir gratuitement au <strong>Médiateur du Tourisme et du Voyage (MTV)</strong> :<br/>
              MTV Médiation Tourisme Voyage - BP 80303 - 75823 PARIS CEDEX 17<br/>
              Site internet : <a href="https://www.mtv.travel" target="_blank" rel="noopener noreferrer">www.mtv.travel</a>
            </p>
            <p>
              La plateforme européenne de Règlement en Ligne des Litiges (RLL) est également accessible à l'adresse : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CGV;
