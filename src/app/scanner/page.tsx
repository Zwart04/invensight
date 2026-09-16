'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Scan, X, AlertCircle } from 'lucide-react';

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanned, setScanned] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [manualItem, setManualItem] = useState('');
  const [foundItems, setFoundItems] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const startCamera = useCallback(async () => {
    setError(null);
    setScanned(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Browser tidak mendukung camera.');
        return;
      }
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      setIsScanning(true);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Izin camera ditolak. Aktifkan izin di pengaturan browser.');
      } else if (err.name === 'NotFoundError') {
        setError('Tidak ada camera yang ditemukan.');
      } else {
        setError('Gagal mengakses camera: ' + err.message);
      }
    }
  }, []);

  useEffect(() => {
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, [stream]);

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setIsScanning(false);
  };

  const simulateScan = () => {
    const codes = ['SKU-001|Resistor 10k|4500', 'SKU-002|Kabel USB-C 2m|890', 'SKU-003|PCB Custom 5x5|120',
      'SKU-004|Box Kardus 40x40|5000', 'SKU-005|Cat Silikon Hitam|60', 'SKU-006|Tutup Plastik 50ml|800',
      'SKU-007|Kabel HDMI 1.5m|320', 'SKU-008|Resistor 100k|2300'];
    const pick = codes[Math.floor(Math.random() * codes.length)];
    const [code, name, stock] = pick.split('|');
    setScanned(`${code} — ${name} (stok: ${stock})`);
    setFoundItems(prev => {
      if (prev.find(f => f.code === code)) return prev;
      return [...prev, { code, name, stock: parseInt(stock), scannedAt: new Date().toLocaleTimeString() }];
    });
  };

  const handleManualLookup = () => {
    if (!manualCode.trim()) return;
    setScanned(`Manual: ${manualCode.trim()} — item tidak ditemukan di database`);
    setFoundItems(prev => {
      if (prev.find(f => f.code === manualCode.trim())) return prev;
      return [...prev, { code: manualCode.trim(), name: manualItem.trim() || 'Item tidak dikenal', stock: 0, scannedAt: new Date().toLocaleTimeString() }];
    });
    setManualCode('');
  };

  const shareViaWhatsApp = (text: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const exportScanList = () => {
    const csv = ['Code,Name,Stock,Scanned At', ...foundItems.map(f => `${f.code},${f.name},${f.stock},${f.scannedAt}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scan-results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Barcode Scanner</h1>
      <p className="text-zinc-500 mb-6">Scan barcode/QR melalui camera atau masukkan kode secara manual.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera View */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden mb-4">
            {stream ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-dashed border-indigo-500 flex items-center justify-center">
                  <div className="w-32 h-32 border-2 border-indigo-500 rounded-lg opacity-50" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <Camera className="w-12 h-12 mb-3 opacity-50" />
                <p>Camera belum aktif</p>
                <p className="text-xs mt-1">Klik "Mulai Scanner" untuk memulai</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {!stream ? (
              <button
                onClick={startCamera}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                <Camera className="w-4 h-4" />
                Mulai Scanner
              </button>
            ) : (
              <button
                onClick={simulateScan}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                <Scan className="w-4 h-4" />
                Scan Sekarang
              </button>
            )}
            {stream && (
              <button
                onClick={stopCamera}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg font-medium transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {error && <p className="mt-2 text-red-600 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {error}</p>}
        </div>

        {/* Manual Entry + Results */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-3">Masukkan Kode Manual</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                placeholder="SKU-001"
                className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              />
              <input
                type="text"
                value={manualItem}
                onChange={e => setManualItem(e.target.value)}
                placeholder="Nama item (opsional)"
                className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <button
                onClick={handleManualLookup}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                Cari
              </button>
            </div>
          </div>

          {/* Recent Scans */}
          {foundItems.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Hasil Scan Terbaru</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => exportScanList()}
                    className="text-xs px-3 py-1 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded transition-colors"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => shareViaWhatsApp(`InvenSight Scan Results:\n${foundItems.map(f => `${f.code}: ${f.name} (${f.stock} unit)`).join('\n')}`)}
                    className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                  >
                    Share WA
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {foundItems.slice().reverse().map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/50 text-sm">
                    <div>
                      <span className="font-mono font-medium">{item.code}</span>
                      <span className="text-zinc-500 ml-2">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono">{item.stock} unit</span>
                      <span className="text-zinc-400 text-xs ml-2 block">{item.scannedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scanned Banner */}
          {scanned && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-sm">
              <p className="font-medium text-green-700 dark:text-green-300">{scanned}</p>
              <button
                onClick={() => shareViaWhatsApp(scanned)}
                className="mt-2 text-indigo-600 hover:underline text-xs"
              >
                Bagikan via WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
