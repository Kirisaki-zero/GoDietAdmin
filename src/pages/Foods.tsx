import { useEffect, useState } from 'react';
import { fetchFoods, createFood, updateFood, deleteFood, type Food, type FoodPayload } from '../api';
import { Plus, Pencil, Trash2, Search, X, ChefHat } from 'lucide-react';
import './Foods.css';

const EMPTY_FORM: FoodPayload = {
  nama_makanan: '', kalori: 0, protein: 0,
  lemak: 0, karbohidrat: 0, resep: '', kategori: ''
};

const KATEGORI_OPTIONS = [
  'Makanan Pokok', 'Lauk Pauk', 'Sayuran', 'Buah-buahan',
  'Minuman', 'Snack', 'Dessert', 'Suplemen', 'Lainnya'
];

export default function Foods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Food | null>(null);
  const [form, setForm] = useState<FoodPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await fetchFoods();
    if (data.success) setFoods(data.foods);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = foods.filter(f =>
    f.nama_makanan.toLowerCase().includes(search.toLowerCase()) ||
    f.kategori?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (food: Food) => {
    setEditTarget(food);
    setForm({ ...food });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = editTarget
        ? await updateFood(editTarget.id_makanan, form)
        : await createFood(form);
      if (res.success) {
        setMsg({ type: 'ok', text: editTarget ? 'Makanan berhasil diperbarui!' : 'Makanan berhasil ditambahkan!' });
        closeModal();
        load();
      } else {
        setMsg({ type: 'err', text: res.message });
      }
    } catch {
      setMsg({ type: 'err', text: 'Gagal terhubung ke server.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (food: Food) => {
    if (!confirm(`Hapus "${food.nama_makanan}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    const res = await deleteFood(food.id_makanan);
    if (res.success) {
      setMsg({ type: 'ok', text: 'Makanan berhasil dihapus.' });
      load();
    } else {
      setMsg({ type: 'err', text: res.message });
    }
  };

  return (
    <div className="foods-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kelola Makanan</h1>
          <p className="page-sub">Database resep dan nutrisi yang digunakan oleh AI GoDiet</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={16} /> Tambah Makanan
        </button>
      </div>

      {/* Flash message */}
      {msg && (
        <div className={`flash-msg ${msg.type}`}>
          {msg.text}
          <button onClick={() => setMsg(null)}><X size={14} /></button>
        </div>
      )}

      {/* Search */}
      <div className="search-bar">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Cari nama makanan atau kategori..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="foods-stats">
        <div className="stat-chip">Total: <strong>{foods.length}</strong> makanan</div>
        <div className="stat-chip">Ditampilkan: <strong>{filtered.length}</strong> hasil</div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-state"><ChefHat size={40} className="spin" /><p>Memuat data makanan...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <ChefHat size={48} />
          <p>{foods.length === 0 ? 'Belum ada data makanan. Klik "Tambah Makanan" untuk memulai!' : 'Tidak ada hasil untuk pencarian ini.'}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="foods-table">
            <thead>
              <tr>
                <th>Nama Makanan</th>
                <th>Kategori</th>
                <th>Kalori</th>
                <th>Protein</th>
                <th>Lemak</th>
                <th>Karbo</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(food => (
                <tr key={food.id_makanan}>
                  <td>
                    <div className="food-name">{food.nama_makanan}</div>
                    {food.resep && <div className="food-resep-preview">{food.resep.slice(0, 60)}...</div>}
                  </td>
                  <td><span className="kategori-badge">{food.kategori || '—'}</span></td>
                  <td><strong>{food.kalori}</strong> kcal</td>
                  <td>{food.protein}g</td>
                  <td>{food.lemak}g</td>
                  <td>{food.karbohidrat}g</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon edit" onClick={() => openEdit(food)} title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(food)} title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Tambah / Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editTarget ? 'Edit Makanan' : 'Tambah Makanan Baru'}</h3>
              <button className="btn-icon" onClick={closeModal}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-grid">
                <div className="form-group full">
                  <label>Nama Makanan *</label>
                  <input required value={form.nama_makanan} onChange={e => setForm({ ...form, nama_makanan: e.target.value })} placeholder="Contoh: Nasi Goreng Spesial" />
                </div>
                <div className="form-group">
                  <label>Kategori</label>
                  <select value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })}>
                    <option value="">-- Pilih Kategori --</option>
                    {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Kalori (kcal)</label>
                  <input type="number" min={0} value={form.kalori} onChange={e => setForm({ ...form, kalori: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Protein (g)</label>
                  <input type="number" min={0} step="0.1" value={form.protein} onChange={e => setForm({ ...form, protein: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Lemak (g)</label>
                  <input type="number" min={0} step="0.1" value={form.lemak} onChange={e => setForm({ ...form, lemak: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Karbohidrat (g)</label>
                  <input type="number" min={0} step="0.1" value={form.karbohidrat} onChange={e => setForm({ ...form, karbohidrat: Number(e.target.value) })} />
                </div>
                <div className="form-group full">
                  <label>Resep / Deskripsi</label>
                  <textarea rows={4} value={form.resep} onChange={e => setForm({ ...form, resep: e.target.value })} placeholder="Tuliskan bahan dan cara membuat..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Menyimpan...' : editTarget ? 'Simpan Perubahan' : 'Tambah Makanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
