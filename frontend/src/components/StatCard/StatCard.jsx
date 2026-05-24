function StatCard({ title, total }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h3 className="text-slate-500 mb-2">
        {title}
      </h3>

      <h1 className="text-3xl font-bold text-blue-600">
        {total}
      </h1>
    </div>
  );
}

export default StatCard;