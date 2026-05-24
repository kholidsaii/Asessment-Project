import StatCard from "../StatCard/StatCard";

function StatsSection({ stats }) {
  return (
    <div className="grid md:grid-cols-3 gap-5 mb-8">

      <StatCard
        title="Rumah Sakit"
        total={stats.hospitals}
      />

      <StatCard
        title="Users"
        total={stats.users}
      />

      <StatCard
        title="Indikator"
        total={stats.indicators}
      />

    </div>
  );
}

export default StatsSection;