let artikelListe = [];
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

function addArtikel() {
  const artikelName = document.getElementById('artikelName').value;
  const einzelpreis = parseFloat(document.getElementById('einzelpreis').value);
  const menge = parseInt(document.getElementById('menge').value) || 1;
  const mwst = parseFloat(document.getElementById('mwst').value) || 0;

  if (!artikelName || isNaN(einzelpreis)) return;

  const gesamt = (einzelpreis * menge).toFixed(2);
  artikelListe.push({ artikelName, menge, einzelpreis, gesamt });

  renderTabelle();
}

function renderTabelle() {
  const tbody = document.querySelector("#artikelTabelle tbody");
  tbody.innerHTML = "";

  artikelListe.forEach((artikel, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${artikel.artikelName}</td>
      <td>${artikel.menge}</td>
      <td>${artikel.einzelpreis.toFixed(2)} €</td>
      <td>${artikel.gesamt} €</td>
    `;
    tbody.appendChild(tr);
  });
}

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("RECHNUNG", 14, 20);

  const seitenbreite = doc.internal.pageSize.getWidth();
  const rechnungsnummerText = 'Nr. ' + aktuelleRechnungsnummer.toString().padStart(4, '0');
  doc.setFontSize(12);
  doc.text(rechnungsnummerText, seitenbreite - 40, 20);

  const kunde = document.getElementById("kunde").value;
  doc.text("Kunde: " + kunde, 14, 30);

  const tableData = artikelListe.map((artikel, index) => ([
    (index + 1).toString(),
    artikel.artikelName,
    artikel.menge.toString(),
    artikel.einzelpreis.toFixed(2) + " €",
    artikel.gesamt + " €"
  ]));

  doc.autoTable({
    head: [["Pos", "Artikel", "Menge", "Einzelpreis", "Gesamt"]],
    body: tableData,
    startY: 40
  });

  doc.save(`${kunde || "Rechnung"}_${rechnungsnummerText.replace(' ', '_')}.pdf`);
}

window.onload = function () {
  updateInvoiceNumberDisplay();
};
