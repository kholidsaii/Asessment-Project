import { useEffect, useState } from "react";
import api from "../../utils/constant/http";

function ActivitySection() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateValue) => {
    if (!dateValue) return "Baru saja";

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateValue));
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/assessments/recent");

        if (res.data.success) {
          setActivities(res.data.data || []);
        }
      } catch (err) {
        console.error("Gagal mengambil aktivitas terbaru:", err);
        setError("Gagal mengambil aktivitas terbaru.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Aktivitas Terbaru
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Riwayat penilaian terbaru dari rumah sakit
          </p>
        </div>
      </div>

      {loading && (
        <div className="border-2 border-dashed rounded-2xl p-10 text-center text-slate-400">
          Memuat aktivitas terbaru...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && activities.length === 0 && (
        <div className="border-2 border-dashed rounded-2xl p-20 text-center text-slate-400">
          Belum ada aktivitas terbaru
        </div>
      )}

      {!loading && !error && activities.length > 0 && (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                ✓
              </div>

              <div className="flex-1">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">
                    {activity.hospital_name || "Rumah sakit"}
                  </span>{" "}
                  mengisi penilaian untuk pertanyaan{" "}
                  <span className="font-semibold text-slate-900">
                    “{activity.question_text || "Tidak diketahui"}”
                  </span>
                  .
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-white border px-3 py-1 text-slate-500">
                    Indikator: {activity.indicator_name || "-"}
                  </span>

                  <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-600">
                    Skor: {activity.score} / 10
                  </span>

                  <span className="text-slate-400">
                    {formatDate(activity.updated_at || activity.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivitySection;
