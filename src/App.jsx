import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, Settings, Receipt, ChevronDown, ChevronUp, ChefHat, Save } from 'lucide-react';

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
};

export default function App() {
  // --- STATE MANAJEMEN ---
  const [bahan, setBahan] = useState([
    { id: 1, name: 'Mie Basah (1 kg)', cost: 15000, qty: 1 },
    { id: 2, name: 'Daging Ayam Fillet', cost: 40000, qty: 1 },
    { id: 3, name: 'Bumbu Halus & Rempah', cost: 10000, qty: 1 },
    { id: 4, name: 'Sawi Hijau & Daun Bawang', cost: 5000, qty: 1 },
    { id: 5, name: 'Minyak Ayam & Bawang', cost: 8000, qty: 1 },
    { id: 6, name: 'Kecap Asin & Manis', cost: 5000, qty: 1 },
  ]);

  const [kemasan, setKemasan] = useState([
    { id: 1, name: 'Paper Bowl + Tutup', cost: 1200, qty: 10 },
    { id: 2, name: 'Sumpit & Sendok Plastik', cost: 300, qty: 10 },
    { id: 3, name: 'Kantong Plastik', cost: 100, qty: 10 },
  ]);

  const [operasional, setOperasional] = useState([
    { id: 1, name: 'Gas LPG (Estimasi 1 batch)', cost: 5000, qty: 1 },
    { id: 2, name: 'Tenaga Kerja (Opsional)', cost: 0, qty: 1 },
  ]);

  const [porsi, setPorsi] = useState(10);
  const [margin, setMargin] = useState(50); // Persentase margin keuntungan
  const [activeTab, setActiveTab] = useState('input'); // 'input' or 'result'

  // --- FUNGSI PERHITUNGAN ---
  const hitungTotal = (items) => items.reduce((total, item) => total + (item.cost * item.qty), 0);

  const totalBahan = hitungTotal(bahan);
  const totalKemasan = hitungTotal(kemasan);
  const totalOperasional = hitungTotal(operasional);
  const totalModal = totalBahan + totalKemasan + totalOperasional;
  
  const hppPerPorsi = porsi > 0 ? totalModal / porsi : 0;
  const targetKeuntungan = porsi > 0 ? hppPerPorsi * (margin / 100) : 0;
  const hargaJualSaran = hppPerPorsi + targetKeuntungan;

  // --- FUNGSI UPDATE DATA ---
  const handleUpdateItem = (setter, items, id, field, value) => {
    setter(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleAddItem = (setter, items) => {
    const newItem = { id: Date.now(), name: '', cost: 0, qty: 1 };
    setter([...items, newItem]);
  };

  const handleRemoveItem = (setter, items, id) => {
    setter(items.filter(item => item.id !== id));
  };

  // --- KOMPONEN INPUT LIST ---
  const InputSection = ({ title, items, setter, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 mb-4 overflow-hidden">
        <div 
          className="bg-orange-50 p-4 flex justify-between items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2 text-orange-800 font-bold">
            <Icon size={20} />
            <h2>{title}</h2>
          </div>
          {isOpen ? <ChevronUp size={20} className="text-orange-600"/> : <ChevronDown size={20} className="text-orange-600"/>}
        </div>
        
        {isOpen && (
          <div className="p-4 space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 relative">
                <input
                  type="text"
                  placeholder="Nama item..."
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                  value={item.name}
                  onChange={(e) => handleUpdateItem(setter, items, item.id, 'name', e.target.value)}
                />
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <span className="px-3 text-gray-500 text-sm bg-gray-50 border-r border-gray-200">Rp</span>
                    <input
                      type="number"
                      placeholder="Harga"
                      className="w-full p-2 text-sm outline-none"
                      value={item.cost === 0 ? '' : item.cost}
                      onChange={(e) => handleUpdateItem(setter, items, item.id, 'cost', Number(e.target.value))}
                    />
                  </div>
                  <div className="w-24 flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <span className="px-2 text-gray-500 text-sm bg-gray-50 border-r border-gray-200">Qty</span>
                    <input
                      type="number"
                      className="w-full p-2 text-sm outline-none"
                      value={item.qty === 0 ? '' : item.qty}
                      onChange={(e) => handleUpdateItem(setter, items, item.id, 'qty', Number(e.target.value))}
                    />
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(setter, items, item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            <button 
              onClick={() => handleAddItem(setter, items)}
              className="w-full py-3 flex items-center justify-center gap-2 text-orange-600 font-semibold bg-orange-50 hover:bg-orange-100 rounded-xl border border-orange-200 border-dashed transition-colors"
            >
              <Plus size={18} /> Tambah Item
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 max-w-md mx-auto relative shadow-2xl">
      {/* Header */}
      <div className="bg-orange-500 text-white p-6 rounded-b-[2rem] shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
          <ChefHat size={120} />
        </div>
        <h1 className="text-2xl font-extrabold relative z-10">HPP Mie Ayam</h1>
        <p className="text-orange-100 text-sm relative z-10 mt-1">Kalkulator modal & harga jual</p>
      </div>

      <div className="p-4">
        {activeTab === 'input' ? (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Pengaturan Produksi */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Porsi Dibuat</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-800 focus:ring-2 focus:ring-orange-400 outline-none pl-4"
                    value={porsi}
                    onChange={(e) => setPorsi(Number(e.target.value))}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Porsi</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Profit</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-800 focus:ring-2 focus:ring-orange-400 outline-none pl-4"
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">%</span>
                </div>
              </div>
            </div>

            <InputSection title="Bahan Baku Utama" items={bahan} setter={setBahan} icon={ChefHat} />
            <InputSection title="Kemasan & Pelengkap" items={kemasan} setter={setKemasan} icon={Save} />
            <InputSection title="Biaya Operasional" items={operasional} setter={setOperasional} icon={Settings} />
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Ringkasan Modal */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-800 text-white p-4">
                <h2 className="font-bold flex items-center gap-2"><Receipt size={18}/> Ringkasan Modal</h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Bahan Baku</span>
                  <span className="font-semibold text-gray-800">{formatRupiah(totalBahan)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Kemasan</span>
                  <span className="font-semibold text-gray-800">{formatRupiah(totalKemasan)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Operasional</span>
                  <span className="font-semibold text-gray-800">{formatRupiah(totalOperasional)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-gray-700">Total Modal Keseluruhan</span>
                  <span className="font-extrabold text-orange-600 text-lg">{formatRupiah(totalModal)}</span>
                </div>
              </div>
            </div>

            {/* Hasil HPP */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-5 text-white">
              <p className="text-orange-100 text-sm font-medium mb-1">Harga Pokok Penjualan (HPP)</p>
              <div className="text-3xl font-black mb-4">{formatRupiah(hppPerPorsi)} <span className="text-sm font-medium opacity-80">/ porsi</span></div>
              
              <div className="bg-white/10 rounded-xl p-4 space-y-2 backdrop-blur-sm">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-orange-50">Target Keuntungan ({margin}%)</span>
                  <span className="font-bold">{formatRupiah(targetKeuntungan)}</span>
                </div>
                <hr className="border-white/20" />
                <div className="flex justify-between items-center pt-1">
                  <span className="font-medium text-orange-50">Saran Harga Jual</span>
                  <span className="font-black text-xl text-yellow-300">{formatRupiah(hargaJualSaran)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed border border-blue-100">
              💡 <strong>Tips Arief:</strong> Pastikan membulatkan harga jual ke atas. Misalnya jika saran harga jual Rp 14.300, kamu bisa membulatkannya menjadi Rp 15.000 agar mempermudah kembalian dan menambah ekstra margin.
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation (iOS Style) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 flex justify-around items-center max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <button 
          onClick={() => setActiveTab('input')}
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'input' ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Settings size={24} className={activeTab === 'input' ? 'fill-orange-100' : ''} />
          <span className="text-[10px] font-bold mt-1">Input Data</span>
        </button>
        <button 
          onClick={() => setActiveTab('result')}
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'result' ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Calculator size={24} className={activeTab === 'result' ? 'fill-orange-100' : ''} />
          <span className="text-[10px] font-bold mt-1">Lihat Hasil</span>
        </button>
      </div>
      
      {/* Spacer for bottom nav */}
      <div className="h-10"></div>
    </div>
  );
}