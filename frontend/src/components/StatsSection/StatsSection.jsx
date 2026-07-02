import StatCard from "../StatCard/StatCard";

function StatsSection({
  mode = "admin",
  stats = {
    hospitals: 0,
    users: 0,
    indicators: 0,
    totalAssessments: 0,
    assessedHospitals: 0,
    averageScore: 0,
    totalQuestions: 0,
    totalEvaluated: 0,
    totalIndicatorsEvaluated: 0,
    completionPercentage: 0,
    evaluationStatus: "-",
  },
}) {
  if (mode === "user") {
    return (
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        <StatCard title="Total Pertanyaan" total={stats?.totalQuestions || 0} />
        <StatCard title="Pertanyaan Dinilai" total={stats?.totalEvaluated || 0} />
        <StatCard title="Indikator Dinilai" total={stats?.totalIndicatorsEvaluated || 0} />
        <StatCard title="Rata-rata Skor" total={`${stats?.averageScore || 0} / 10`} />
        <StatCard title="Progress Pengisian" total={`${stats?.completionPercentage || 0}%`} />
        <StatCard title="Status Mutu" total={stats?.evaluationStatus || "-"} />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
      <StatCard title="Total Rumah Sakit" total={stats?.hospitals || 0} />
      <StatCard title="Total Users" total={stats?.users || 0} />
      <StatCard title="Total Indikator" total={stats?.indicators || 0} />
      <StatCard title="Total Penilaian" total={stats?.totalAssessments || 0} />
      <StatCard title="RS Sudah Dinilai" total={stats?.assessedHospitals || 0} />
      <StatCard title="Rata-rata Skor" total={`${stats?.averageScore || 0} / 10`} />
    </div>
  );
}

export default StatsSection;
