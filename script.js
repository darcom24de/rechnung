let aktuelleRechnungsnummer = 1;

function getNextInvoiceNumber() {
  let lastNumber = localStorage.getItem('rechnungsnummer');
  let nextNumber = lastNumber ? parseInt(lastNumber) + 1 : 1;
  localStorage.setItem('rechnungsnummer', nextNumber);
  aktuelleRechnungsnummer = nextNumber;
  return nextNumber;
}

function updateInvoiceNumberDisplay() {
  const number = getNextInvoiceNumber();
  const formatted = 'Nr. ' + number.toString().padStart(4, '0');
  document.getElementById('rechnungsnummer').textContent = formatted;
}

function addRow(name = '', menge = 1, preis = 0) {
  const tbody = document.querySelector("#artikelTabelle tbody");
  const row = document.createElement('tr');
  const pos = tbody.rows.length + 1;
  row.innerHTML = `
    <td>${pos}</td>
    <td><input type="text" placeholder="Artikelname" value="${name}"></td>
    <td><input type="number" min="1" value="${menge}" onchange="updateGesamtpreis(this)"></td>
    <td><input type="number" min="0" step="0.01" value="${preis}" onchange="updateGesamtpreis(this)"></td>
    <td>0.00 €</td>
    <td><button onclick="removeRow(this)">✕</button></td>
  `;
  tbody.appendChild(row);
  updateGesamtpreis(row.cells[3].querySelector('input'));
}

function removeRow(btn) {
  btn.closest('tr').remove();
  updatePositions();
  updateTotalSum();
}

function updatePositions() {
  const rows = document.querySelectorAll('#artikelTabelle tbody tr');
  rows.forEach((row, i) => row.cells[0].textContent = i + 1);
}

function updateGesamtpreis(input) {
  const row = input.closest('tr');
  const menge = parseInt(row.cells[2].querySelector('input').value) || 0;
  const preis = parseFloat(row.cells[3].querySelector('input').value) || 0;
  row.cells[4].textContent = (menge * preis).toFixed(2) + ' €';
  updateTotalSum();
}

function updateTotalSum() {
  const mwstSatz = 0.19;
  let bruttoSumme = 0;

  document.querySelectorAll('#artikelTabelle tbody tr').forEach(row => {
    const preisText = row.cells[4].textContent || '';
    const preis = parseFloat(preisText.replace(' €', '').replace(',', '.')) || 0;
    bruttoSumme += preis;
  });

  const nettoSumme = bruttoSumme / (1 + mwstSatz);
  const mwstBetrag = bruttoSumme - nettoSumme;

  document.getElementById('rechnungSumme').innerHTML =
    `Nettobetrag: ${nettoSumme.toFixed(2)} €<br>` +
    `MwSt 19%: ${mwstBetrag.toFixed(2)} €<br>` +
    `<b>Gesamtpreis: ${bruttoSumme.toFixed(2)} €</b>`;
}

function exportCSV() {
  let csv = 'Pos,Artikel,Menge,Einzelpreis,Gesamtpreis\n';
  document.querySelectorAll('#artikelTabelle tbody tr').forEach(row => {
    const cols = Array.from(row.cells).slice(0, 5);
    const values = cols.map(td => td.textContent.replace(' €', '').trim());
    csv += values.join(',') + '\n';
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rechnung.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(12);
  doc.text("HC-Shop", 14, 20);
  doc.text("Pankstraße 46", 14, 27);
  doc.text("13357 Berlin", 14, 34);
  doc.text("USt-ID-Nr.: DE353633206", 14, 41);

  const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAABHNCSVQICAgIfAhkiAAAARlJREFUeJzt3TEKwzAQRVFz0HjTR0KXepNXSNHyk+H2AJV4LF1nJ7vzW5s3zG8CyDMOQCgs7sBG2AwCziAp5Ak9A1SDXEC0xL2k4rXrQ0TOVJqYAdRJomwp0gcUlTggpVJxOympcC5ShD+jGC/QyCgBDQgAVNgLC1VITR1JhYQAUrKMNVzJSDQZTkGcFgFQi8u8yEBYBJR4KuF8EEgt9BohqFzITFlvA6LBGmWlHVk0qUU1xSJCt0l+5zE6pH4lFeW+1T3ZqioiE+QiAH3zH4vr5e7QDE7OTe/YvEfAAAAAElFTkSuQmCC";
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.addImage(logoBase64, 'PNG', pageWidth - 54, 14, 40, 40);

  doc.setFontSize(18);
  doc.text("RECHNUNG", pageWidth / 2, 60, { align: 'center' });

  const rechnungsnummerText = 'Nr. ' + aktuelleRechnungsnummer.toString().padStart(4, '0');
  doc.setFontSize(12);
  doc.text(rechnungsnummerText, pageWidth - 50, 60);

  const kunde = document.getElementById("adresse").value || "Unbekannt";
  doc.text("Kunde: " + kunde, 14, 75);

  const mwstSatz = 0.19;
  let bruttoSumme = 0;
  const data = [];

  document.querySelectorAll('#artikelTabelle tbody tr').forEach((row, i) => {
    const artikel = row.cells[1].querySelector('input').value || '';
    const menge = row.cells[2].querySelector('input').value || '';
    const preis = row.cells[3].querySelector('input').value || '';
    const gesamtText = row.cells[4].textContent || '';
    data.push([(i + 1).toString(), artikel, menge, preis + ' €', gesamtText]);
    bruttoSumme += parseFloat(gesamtText.replace(' €', '').replace(',', '.')) || 0;
  });

  const nettoSumme = bruttoSumme / (1 + mwstSatz);
  const mwstBetrag = bruttoSumme - nettoSumme;

  doc.autoTable({
    head: [["Pos", "Artikel", "Menge", "Einzelpreis", "Gesamt"]],
    body: data,
    startY: 85
  });

  const finalY = doc.lastAutoTable.finalY || 90;

  doc.text(`Nettobetrag: ${nettoSumme.toFixed(2)} €`, pageWidth - 14, finalY + 10, { align: 'right' });
  doc.text(`MwSt 19%: ${mwstBetrag.toFixed(2)} €`, pageWidth - 14, finalY + 20, { align: 'right' });
  doc.text(`Gesamtpreis: ${bruttoSumme.toFixed(2)} €`, pageWidth - 14, finalY + 30, { align: 'right' });

  const safeName = kunde.replace(/\s+/g, '_').replace(/[^\w\-]/g, '');
  doc.save(`${safeName}_${rechnungsnummerText.replace(' ', '_')}.pdf`);
}

window.onload = function () {
  updateInvoiceNumberDisplay();
  if (document.querySelector("#artikelTabelle tbody tr").length === 0) {
    addRow();
    setTimeout(() => updateTotalSum(), 10);
  }
};
// Datum anzeigen
const heute = new Date();
const datumFormat = heute.toLocaleDateString('de-DE');
document.getElementById('heutigesDatum').textContent = "Datum: " + datumFormat;

