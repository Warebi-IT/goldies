-- Ajouter le montant personnalisé d'acompte aux voyages
ALTER TABLE trips ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC;

COMMENT ON COLUMN trips.deposit_amount IS 'Montant fixe en euros pour l''acompte requis pour bloquer une place';
COMMENT ON COLUMN trips.deposit_payment_link IS 'Lien Stripe vers le produit acompte';
COMMENT ON COLUMN trips.payment_link IS 'Lien Stripe vers le produit intégral ou paiement en plusieurs fois (Klarna)';
