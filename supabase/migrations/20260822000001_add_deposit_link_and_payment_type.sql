-- Ajouter le lien d'acompte aux voyages
ALTER TABLE trips ADD COLUMN IF NOT EXISTS deposit_payment_link TEXT;

-- Ajouter le type de paiement aux réservations
-- Valeurs possibles : 'deposit', 'installment', 'full'
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_type TEXT DEFAULT 'full';
