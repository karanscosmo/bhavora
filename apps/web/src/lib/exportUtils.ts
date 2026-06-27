import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPDF(elementId: string, filename: string = 'bhavora-report.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    return;
  }

  try {
    // Add a temporary class to optimize for printing
    element.classList.add('pdf-exporting');
    
    // Hide UI elements we don't want in PDF (like buttons)
    const noPrintElements = document.querySelectorAll('.no-print');
    noPrintElements.forEach(el => (el as HTMLElement).style.display = 'none');

    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);

  } catch {
  } finally {
    // Cleanup
    element.classList.remove('pdf-exporting');
    const noPrintElements = document.querySelectorAll('.no-print');
    noPrintElements.forEach(el => (el as HTMLElement).style.display = '');
  }
}

export function exportToCSV(data: Record<string, unknown>[], filename: string = 'bhavora-data.csv') {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + val).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
