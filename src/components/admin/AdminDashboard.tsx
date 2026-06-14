import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Users, Award, Percent, MessageSquare, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const AdminDashboard = () => {
  // Fetch trips
  const { data: trips } = useQuery({
    queryKey: ["admin-trips-dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase.from("trips").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Fetch bookings
  const { data: bookings } = useQuery({
    queryKey: ["admin-bookings-dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Fetch contacts count
  const { data: contacts } = useQuery({
    queryKey: ["admin-contacts-dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contacts").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Calculate KPIs
  const totalBookingsCount = bookings?.length || 0;
  const paidBookings = bookings?.filter((b) => b.payment_status === "paid") || [];
  const unpaidBookings = bookings?.filter((b) => b.payment_status === "unpaid") || [];
  const paidCount = paidBookings.length;
  
  const paymentRate = totalBookingsCount > 0 ? Math.round((paidCount / totalBookingsCount) * 100) : 0;

  // Calculate revenues
  let totalRevenue = 0;
  let pendingRevenue = 0;

  if (bookings && trips) {
    bookings.forEach((b) => {
      const trip = trips.find((t) => t.id === b.trip_id);
      if (trip) {
        if (b.payment_status === "paid") {
          totalRevenue += trip.price;
        } else {
          pendingRevenue += trip.price;
        }
      }
    });
  }

  // Calculate statistics per trip
  const tripStats = trips?.map((trip) => {
    const tripBookings = bookings?.filter((b) => b.trip_id === trip.id) || [];
    const tripPaid = tripBookings.filter((b) => b.payment_status === "paid").length;
    const tripUnpaid = tripBookings.length - tripPaid;
    const capacity = trip.qte || 12; // default capacity fallback
    const occupancyRate = Math.min(Math.round((tripBookings.length / capacity) * 100), 100);

    return {
      id: trip.id,
      name: trip.name,
      destination: trip.destination,
      price: trip.price,
      totalBookings: tripBookings.length,
      paid: tripPaid,
      unpaid: tripUnpaid,
      capacity,
      occupancyRate,
    };
  }) || [];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-pp-neue-corp-compact text-3xl font-black text-ink uppercase tracking-tight">
            Tableau de Bord
          </h2>
          <p className="font-dm-sans text-sm text-ink/60">
            Suivi des ventes, des réservations et de l'intérêt client en temps réel.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI: Chiffre d'Affaires Réalisé */}
        <Card className="rounded-[24px] border border-ink/5 bg-emerald-50 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-dm-sans font-bold uppercase tracking-wider text-emerald-800">
              CA Encaissé
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <DollarSign size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-pp-neue-corp-compact text-3xl font-black text-emerald-950">
              {totalRevenue.toLocaleString()} €
            </div>
            <p className="text-xs font-dm-sans text-emerald-700/70 mt-1">
              Sur {paidCount} paiement(s) validé(s)
            </p>
          </CardContent>
        </Card>

        {/* KPI: CA En Attente */}
        <Card className="rounded-[24px] border border-ink/5 bg-amber-50 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-dm-sans font-bold uppercase tracking-wider text-amber-800">
              CA En Attente
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <AlertCircle size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-pp-neue-corp-compact text-3xl font-black text-amber-950">
              {pendingRevenue.toLocaleString()} €
            </div>
            <p className="text-xs font-dm-sans text-amber-700/70 mt-1">
              {unpaidBookings.length} réservation(s) non payée(s)
            </p>
          </CardContent>
        </Card>

        {/* KPI: Total Inscriptions */}
        <Card className="rounded-[24px] border border-ink/5 bg-blue-50 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-dm-sans font-bold uppercase tracking-wider text-blue-800">
              Total Inscriptions
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Users size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-pp-neue-corp-compact text-3xl font-black text-blue-950">
              {totalBookingsCount}
            </div>
            <p className="text-xs font-dm-sans text-blue-700/70 mt-1">
              Voyageuses inscrites
            </p>
          </CardContent>
        </Card>

        {/* KPI: Taux de Conversion/Paiement */}
        <Card className="rounded-[24px] border border-ink/5 bg-purple-50 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-dm-sans font-bold uppercase tracking-wider text-purple-800">
              Taux de Paiement
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Percent size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-pp-neue-corp-compact text-3xl font-black text-purple-950">
              {paymentRate} %
            </div>
            <div className="mt-2">
              <Progress value={paymentRate} className="h-1.5 bg-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown per Travel */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left: Occupancy list */}
        <div className="md:col-span-2 bg-white rounded-[32px] p-6 border border-ink/5 shadow-sm">
          <h3 className="font-pp-neue-corp-compact text-xl font-black text-ink uppercase mb-6">
            Remplissage et Ventes par Voyage
          </h3>
          <div className="space-y-6">
            {tripStats.length === 0 ? (
              <p className="text-sm font-dm-sans text-ink/50 text-center py-6">
                Aucun voyage configuré.
              </p>
            ) : (
              tripStats.map((stat) => (
                <div key={stat.id} className="space-y-2 border-b border-ink/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-dm-sans font-bold text-ink text-sm sm:text-base">{stat.name}</h4>
                      <p className="font-dm-sans text-xs text-ink/50 uppercase tracking-wide">
                        {stat.destination} • {stat.price} €
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-pp-neue-corp-compact font-black text-lg text-ink">
                        {stat.totalBookings}/{stat.capacity}
                      </span>
                      <p className="font-dm-sans text-xs text-ink/50">Places prises ({stat.occupancyRate}%)</p>
                    </div>
                  </div>
                  <Progress value={stat.occupancyRate} className="h-2 bg-gray-100" />
                  <div className="flex justify-between text-xs font-dm-sans text-ink/75 pt-1">
                    <span className="text-emerald-600 font-semibold">{stat.paid} payés</span>
                    <span className="text-amber-600 font-semibold">{stat.unpaid} en attente</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Quick stats & contact summaries */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-[32px] p-6 border border-ink/5 shadow-sm flex flex-col justify-between h-[180px]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <div>
                <h4 className="font-pp-neue-corp-compact text-lg font-black uppercase text-ink">Contacts Reçus</h4>
                <p className="font-dm-sans text-xs text-ink/50">Demandes de renseignements</p>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-pp-neue-corp-compact text-5xl font-black text-ink">
                {contacts?.length || 0}
              </span>
              <span className="font-dm-sans text-sm text-ink/60">messages</span>
            </div>
          </div>

          {/* Quick tips card */}
          <div className="bg-gradient-to-br from-citra-orange/10 to-pastel-rose p-6 rounded-[32px] border border-citra-orange/20 shadow-sm">
            <h4 className="font-pp-neue-corp-compact text-lg font-black uppercase text-ink mb-3">
              Action requise
            </h4>
            <ul className="space-y-3 font-dm-sans text-sm text-ink/80">
              <li className="flex items-start gap-2">
                <span className="text-citra-orange font-bold">•</span>
                <span>Vérifiez les paiements Stripe en attente.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-citra-orange font-bold">•</span>
                <span>Validez l'assurance et l'engagement des participantes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-citra-orange font-bold">•</span>
                <span>Répondez aux demandes des {contacts?.length || 0} nouveaux contacts.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
