import { useEffect, useMemo, useState } from "react";
import { Edit3, Loader2, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";
import api from "../utils/constant/http";

const initialForm = {
  indicator_id: "",
  question_text: "",
};

function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEditMode = useMemo(() => Boolean(editingId), [editingId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [questionRes, indicatorRes] = await Promise.all([
        api.get("/questions"),
        api.get("/indicators"),
      ]);

      setQuestions(questionRes.data.data || []);
      setIndicators(indicatorRes.data.data || []);
    } catch (err) {
      console.error("Gagal memuat data pertanyaan:", err);
      setError(err.response?.data?.message || "Gagal memuat data pertanyaan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleEdit = (question) => {
    setEditingId(question.id);
    setForm({
      indicator_id: question.indicator_id ? String(question.indicator_id) : "",
      question_text: question.question_text || "",
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.indicator_id || !form.question_text.trim()) {
      setError("Indikator dan teks pertanyaan wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        indicator_id: Number(form.indicator_id),
        question_text: form.question_text.trim(),
      };

      if (isEditMode) {
        await api.put(`/questions/${editingId}`, payload);
        setSuccess("Pertanyaan berhasil diperbarui.");
      } else {
        await api.post("/questions", payload);
        setSuccess("Pertanyaan berhasil ditambahkan.");
      }

      resetForm();
      await fetchData();
    } catch (err) {
      console.error("Gagal menyimpan pertanyaan:", err);
      setError(err.response?.data?.message || "Gagal menyimpan pertanyaan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus pertanyaan ini?");
    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");
      await api.delete(`/questions/${id}`);
      setSuccess("Pertanyaan berhasil dihapus.");
      await fetchData();
    } catch (err) {
      console.error("Gagal menghapus pertanyaan:", err);
      setError(err.response?.data?.message || "Gagal menghapus pertanyaan.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pertanyaan Assessment</h1>
          <p className="mt-1 text-slate-500">
            Kelola pertanyaan yang akan diisi oleh rumah sakit saat melakukan assessment.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {isEditMode ? <Edit3 size={18} /> : <Plus size={18} />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isEditMode ? "Edit Pertanyaan" : "Tambah Pertanyaan"}
            </h2>
            <p className="text-sm text-slate-500">
              Hubungkan pertanyaan dengan indikator layanan/fasilitas rumah sakit.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-600">
            Indikator / Layanan
          </label>
          <select
            name="indicator_id"
            value={form.indicator_id}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Pilih indikator</option>
            {indicators.map((indicator) => (
              <option key={indicator.id} value={indicator.id}>
                {indicator.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-bold text-slate-600">Teks Pertanyaan</label>
          <textarea
            name="question_text"
            value={form.question_text}
            onChange={handleChange}
            rows={4}
            placeholder="Contoh: Apakah rumah sakit memiliki SOP pelayanan pasien?"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          {isEditMode && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-50"
            >
              <X size={17} />
              Batal
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-blue-100 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
            {saving ? "Menyimpan..." : isEditMode ? "Update Pertanyaan" : "Simpan Pertanyaan"}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="text-lg font-bold text-slate-800">Daftar Pertanyaan</h2>
          <p className="text-sm text-slate-500">
            Data ini akan muncul pada halaman Input Assessment user rumah sakit.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-slate-400">
            <Loader2 className="animate-spin" size={20} />
            Memuat pertanyaan...
          </div>
        ) : questions.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            Belum ada pertanyaan assessment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Indikator / Layanan</th>
                  <th className="px-6 py-4">Pertanyaan</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((question, index) => (
                  <tr key={question.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 text-slate-700">
                      {question.indicator_name || "-"}
                    </td>
                    <td className="max-w-xl px-6 py-4 text-slate-700">
                      {question.question_text}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(question)}
                          className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionPage;
