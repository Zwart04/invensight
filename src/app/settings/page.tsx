import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | InvenSight',
  description: 'Atur preferensi akun dan notifikasi Anda di InvenSight',
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pengaturan</h1>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 p-6 space-y-6">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Profil</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama</label>
                <input type="text" defaultValue="Pengguna InvenSight" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" defaultValue="user@inven.co" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white" />
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notifikasi</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">Kirim notifikasi low-stock via email</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">Pertahankan tema gelap</span>
            </label>
          </section>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Bahasa</h2>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="lang" value="id" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-700 dark:text-gray-300 text-sm">Bahasa Indonesia</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="lang" value="en" className="text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-700 dark:text-gray-300 text-sm">English</span>
              </label>
            </div>
          </section>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
