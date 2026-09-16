import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Share | InvenSight',
  description: 'Bagikan laporan inventaris Anda melalui tautan atau wa.me',
};

export default function SharePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bagikan Laporan</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Salin tautan atau buka via WhatsApp untuk berbagi status stok.
        </p>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tautan Tidak Terbatas</label>
            <div className="flex gap-2">
              <input type="text" readOnly value="https://invensight.zwart.qzz.io/dashboard" className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-gray-700 dark:text-gray-300 text-sm" />
              <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200">
                Salin
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Via WhatsApp (wa.me)</label>
            <div className="flex gap-2">
              <input type="text" readOnly value="https://wa.me/?text=InvenSight%20Stok%20Terkini%3A%20https%3A%2F%2Finvensight.zwart.qzz.io%2Fdashboard" className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-gray-700 dark:text-gray-300 text-sm" />
              <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium text-white">
                Buka WhatsApp
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Tautan berisi status ringkasan stok snapshot hari ini.
          </p>
        </div>
      </div>
    </div>
  );
}
