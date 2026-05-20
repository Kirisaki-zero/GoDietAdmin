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

// ─── Data makanan statis (hanya tampil di web, tidak tersimpan ke server) ───
interface FoodWithMeta extends Food {
  isStatic?: boolean;
}

const STATIC_FOODS: FoodWithMeta[] = [
  {
    id_makanan: 'static-1', isStatic: true,
    nama_makanan: 'Nasi Putih', kalori: 175, protein: 3.2, lemak: 0.3, karbohidrat: 38.9,
    kategori: 'Makanan Pokok',
    resep: 'Nasi putih yang dimasak dari beras, makanan pokok utama masyarakat Indonesia.'
  },
  {
    id_makanan: 'static-2', isStatic: true,
    nama_makanan: 'Mie Goreng', kalori: 337, protein: 8.4, lemak: 12.5, karbohidrat: 48.0,
    kategori: 'Makanan Pokok',
    resep: 'Mie yang digoreng dengan bumbu kecap, bawang putih, cabai, telur, dan sayuran.'
  },
  {
    id_makanan: 'static-3', isStatic: true,
    nama_makanan: 'Mie Rebus', kalori: 220, protein: 6.5, lemak: 4.0, karbohidrat: 40.0,
    kategori: 'Makanan Pokok',
    resep: 'Mie yang direbus dan disajikan dalam kuah gurih dengan bakso, telur, dan sawi.'
  },
  {
    id_makanan: 'static-4', isStatic: true,
    nama_makanan: 'Ayam Goreng', kalori: 260, protein: 27.5, lemak: 15.0, karbohidrat: 3.0,
    kategori: 'Lauk Pauk',
    resep: 'Ayam yang digoreng dengan bumbu bawang putih, kunyit, ketumbar, dan garam hingga keemasan.'
  },
  {
    id_makanan: 'static-5', isStatic: true,
    nama_makanan: 'Tempe Goreng', kalori: 198, protein: 19.0, lemak: 11.0, karbohidrat: 7.5,
    kategori: 'Lauk Pauk',
    resep: 'Tempe diiris tipis lalu digoreng dengan bumbu bawang dan garam.'
  },
  {
    id_makanan: 'static-6', isStatic: true,
    nama_makanan: 'Tahu Goreng', kalori: 120, protein: 12.0, lemak: 7.0, karbohidrat: 3.0,
    kategori: 'Lauk Pauk',
    resep: 'Tahu putih dipotong lalu digoreng hingga berwarna kekuningan dan renyah.'
  },
  {
    id_makanan: 'static-7', isStatic: true,
    nama_makanan: 'Telur Ceplok', kalori: 155, protein: 13.0, lemak: 11.5, karbohidrat: 0.5,
    kategori: 'Lauk Pauk',
    resep: 'Telur ayam digoreng di wajan dengan sedikit minyak hingga matang sempurna.'
  },
  {
    id_makanan: 'static-8', isStatic: true,
    nama_makanan: 'Telur Dadar', kalori: 185, protein: 12.5, lemak: 14.0, karbohidrat: 1.5,
    kategori: 'Lauk Pauk',
    resep: 'Telur dikocok bersama garam dan daun bawang, lalu digoreng hingga kecokelatan.'
  },
  {
    id_makanan: 'static-9', isStatic: true,
    nama_makanan: 'Soto Ayam', kalori: 145, protein: 14.0, lemak: 7.0, karbohidrat: 8.0,
    kategori: 'Makanan Pokok',
    resep: 'Sup ayam dengan kuah kunyit, dilengkapi dengan soun, tauge, tomat, dan bawang goreng.'
  },
  {
    id_makanan: 'static-10', isStatic: true,
    nama_makanan: 'Bakso', kalori: 180, protein: 12.0, lemak: 8.5, karbohidrat: 15.0,
    kategori: 'Makanan Pokok',
    resep: 'Bola-bola daging sapi dalam kuah kaldu dengan mie, tahu, dan bawang goreng.'
  },
  {
    id_makanan: 'static-11', isStatic: true,
    nama_makanan: 'Gado-Gado', kalori: 160, protein: 8.0, lemak: 9.5, karbohidrat: 13.0,
    kategori: 'Makanan Pokok',
    resep: 'Sayuran rebus seperti kangkung, tauge, kentang, telur rebus dengan saus kacang.'
  },
  {
    id_makanan: 'static-12', isStatic: true,
    nama_makanan: 'Sayur Bayam', kalori: 25, protein: 2.5, lemak: 0.3, karbohidrat: 4.0,
    kategori: 'Sayuran',
    resep: 'Bayam segar dimasak bening dengan jagung muda, bawang putih, dan garam.'
  },
  {
    id_makanan: 'static-13', isStatic: true,
    nama_makanan: 'Capcay', kalori: 85, protein: 5.0, lemak: 4.0, karbohidrat: 9.0,
    kategori: 'Sayuran',
    resep: 'Tumis berbagai sayuran seperti wortel, sawi, kembang kol dengan saus tiram.'
  },
  {
    id_makanan: 'static-14', isStatic: true,
    nama_makanan: 'Ikan Goreng', kalori: 200, protein: 26.0, lemak: 10.0, karbohidrat: 1.0,
    kategori: 'Lauk Pauk',
    resep: 'Ikan laut segar digoreng dengan bumbu kunyit, ketumbar, bawang putih, dan garam.'
  },
  {
    id_makanan: 'static-15', isStatic: true,
    nama_makanan: 'Rendang Daging', kalori: 310, protein: 27.0, lemak: 20.0, karbohidrat: 5.0,
    kategori: 'Lauk Pauk',
    resep: 'Daging sapi dimasak perlahan dengan santan dan rempah serai, lengkuas, dan cabai.'
  },
  {
    id_makanan: 'static-16', isStatic: true,
    nama_makanan: 'Pisang', kalori: 89, protein: 1.1, lemak: 0.3, karbohidrat: 23.0,
    kategori: 'Buah-buahan',
    resep: 'Buah pisang segar yang kaya potasium dan serat, cocok sebagai camilan sehat.'
  },
  {
    id_makanan: 'static-17', isStatic: true,
    nama_makanan: 'Pepaya', kalori: 43, protein: 0.5, lemak: 0.3, karbohidrat: 11.0,
    kategori: 'Buah-buahan',
    resep: 'Buah pepaya segar yang kaya vitamin C dan enzim papain untuk pencernaan.'
  },
  {
    id_makanan: 'static-18', isStatic: true,
    nama_makanan: 'Jeruk', kalori: 47, protein: 0.9, lemak: 0.1, karbohidrat: 12.0,
    kategori: 'Buah-buahan',
    resep: 'Buah jeruk segar yang kaya vitamin C, bisa dimakan langsung atau dijadikan jus.'
  },
  {
    id_makanan: 'static-19', isStatic: true,
    nama_makanan: 'Roti Tawar', kalori: 265, protein: 8.9, lemak: 3.2, karbohidrat: 49.0,
    kategori: 'Makanan Pokok',
    resep: 'Roti tawar putih yang bisa dimakan langsung atau dijadikan sandwich.'
  },
  {
    id_makanan: 'static-20', isStatic: true,
    nama_makanan: 'Bubur Ayam', kalori: 120, protein: 8.5, lemak: 3.5, karbohidrat: 16.0,
    kategori: 'Makanan Pokok',
    resep: 'Bubur beras dengan topping ayam suwir, cakwe, bawang goreng, seledri, dan kecap.'
  },
  {
    id_makanan: 'static-21', isStatic: true,
    nama_makanan: 'Martabak Telur', kalori: 290, protein: 14.0, lemak: 16.0, karbohidrat: 24.0,
    kategori: 'Snack',
    resep: 'Kulit pastri diisi dengan campuran telur, daging cincang, daun bawang, dan bumbu.'
  },
  {
    id_makanan: 'static-22', isStatic: true,
    nama_makanan: 'Siomay', kalori: 135, protein: 10.0, lemak: 6.0, karbohidrat: 11.0,
    kategori: 'Snack',
    resep: 'Kukusan ikan tenggiri dengan kentang, tahu, telur, dan pare, disajikan dengan saus kacang.'
  },
  {
    id_makanan: 'static-23', isStatic: true,
    nama_makanan: 'Es Teh Manis', kalori: 60, protein: 0.1, lemak: 0.0, karbohidrat: 15.5,
    kategori: 'Minuman',
    resep: 'Teh hitam seduhan disajikan dingin dengan es batu dan gula pasir.'
  },
  {
    id_makanan: 'static-24', isStatic: true,
    nama_makanan: 'Pecel Lele', kalori: 240, protein: 22.0, lemak: 13.0, karbohidrat: 8.0,
    kategori: 'Lauk Pauk',
    resep: 'Ikan lele goreng garing disajikan dengan sambal terasi, lalapan mentimun dan kemangi.'
  },
  {
    id_makanan: 'static-25', isStatic: true,
    nama_makanan: 'Opor Ayam', kalori: 230, protein: 20.0, lemak: 14.5, karbohidrat: 5.0,
    kategori: 'Lauk Pauk',
    resep: 'Ayam dimasak dengan santan dan bumbu rempah lengkuas, serai, kemiri, dan kunyit.'
  },
];

export default function Foods() {
  const [serverFoods, setServerFoods] = useState<FoodWithMeta[]>([]);
  const [localStaticFoods, setLocalStaticFoods] = useState<FoodWithMeta[]>(STATIC_FOODS);
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
    if (data.success) setServerFoods(data.foods);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Gabung data server + data statis (hindari duplikat berdasarkan nama)
  const allFoods: FoodWithMeta[] = (() => {
    const serverNames = new Set(serverFoods.map(f => f.nama_makanan.toLowerCase()));
    const uniqueStatic = localStaticFoods.filter(
      sf => !serverNames.has(sf.nama_makanan.toLowerCase())
    );
    return [...serverFoods, ...uniqueStatic];
  })();

  const filtered = allFoods.filter(f =>
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
      if (editTarget && (editTarget as FoodWithMeta).isStatic) {
        setLocalStaticFoods(prev => prev.map(f => f.id_makanan === editTarget.id_makanan ? { ...form, id_makanan: editTarget.id_makanan, isStatic: true } as FoodWithMeta : f));
        setMsg({ type: 'ok', text: 'Makanan berhasil diperbarui!' });
        closeModal();
      } else {
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
      }
    } catch {
      setMsg({ type: 'err', text: 'Gagal terhubung ke server.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (food: FoodWithMeta) => {
    if (!confirm(`Hapus "${food.nama_makanan}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    if (food.isStatic) {
      setLocalStaticFoods(prev => prev.filter(f => f.id_makanan !== food.id_makanan));
      setMsg({ type: 'ok', text: 'Makanan berhasil dihapus.' });
      return;
    }
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
        <div className="stat-chip">Total: <strong>{allFoods.length}</strong> makanan</div>
        <div className="stat-chip">Ditampilkan: <strong>{filtered.length}</strong> hasil</div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-state"><ChefHat size={40} className="spin" /><p>Memuat data makanan...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <ChefHat size={48} />
          <p>{allFoods.length === 0 ? 'Belum ada data makanan.' : 'Tidak ada hasil untuk pencarian ini.'}</p>
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
                      <div className="food-name-row">
                        <div className="food-name">{food.nama_makanan}</div>
                      </div>
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
                        <button className="btn-icon delete" onClick={() => handleDelete(food as FoodWithMeta)} title="Hapus">
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
