import StatCard from "../StatCard/StatCard";

// 1. Berikan nilai default pada parameter (jika stats tidak dikirim, gunakan object kosong ini)
function StatsSection({ stats = { hospitals: 0, users: 0, indicators: 0 } }) {
  return (
    <div className="grid md:grid-cols-3 gap-5 mb-8">

      <StatCard
        title="Rumah Sakit"
        // 2. Gunakan tanda tanya (?.) agar tidak crash jika stats tiba-tiba undefined
        total={stats?.hospitals || 0}
      />

      <StatCard
        title="Users"
        total={stats?.users || 0}
      />

      <StatCard
        title="Indikator"
        total={stats?.indicators || 0}
      />

    </div>
  );
}

export default StatsSection;