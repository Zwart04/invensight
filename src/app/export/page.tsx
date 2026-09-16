'use client';
import { useLang } from '@/lib/lang';
import { useProducts } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card';
import { Button } from '@/components/button';
import { Download, FileSpreadsheet } from 'lucide-react';

export default function ExportPage() {
  const { t } = useLang();
  const products = useProducts();

  const exportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(t['export.pdfTitle'], 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    doc.setFontSize(14);
    doc.text('Products:', 20, 45);
    let y = 55;
    products.forEach(p => {
      doc.setFontSize(10);
      doc.text(`- ${p.name} (SKU: ${p.sku}): ${p.quantity} x $${p.price} = $${(p.quantity * p.price).toFixed(2)}`, 20, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.save('invensight-report.pdf');
  };

  const exportExcel = async () => {
    const headers = ['Name', 'SKU', 'Category', 'Quantity', 'Price', 'Location', 'Value'];
    const rows = products.map(p => [p.name, p.sku, p.category, p.quantity, p.price, p.location, (p.quantity * p.price).toFixed(2)]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invensight-inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t['export.title']}</h1>
        <p className="text-muted-foreground mt-1">Download your inventory data.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t['export.title']}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background rounded-lg border"><Download size={20} className="text-muted-foreground" /></div>
              <div>
                <p className="font-medium">{t['export.pdfBtn']}</p>
                <p className="text-sm text-muted-foreground">{t['export.pdfTitle']}</p>
              </div>
            </div>
            <Button onClick={exportPDF}>{t['export.pdfBtn']}</Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background rounded-lg border"><FileSpreadsheet size={20} className="text-muted-foreground" /></div>
              <div>
                <p className="font-medium">{t['export.xlsxBtn']}</p>
                <p className="text-sm text-muted-foreground">CSV format, open in Excel</p>
              </div>
            </div>
            <Button onClick={exportExcel} variant="outline">{t['export.xlsxBtn']}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
