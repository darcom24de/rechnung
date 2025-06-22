function generateInvoice() {
  const artikelName = document.getElementById('artikelName').value;
  const einzelpreis = parseFloat(document.getElementById('einzelpreis').value);
  const menge = parseInt(document.getElementById('menge').value) || 1; // Falls Menge leer, default 1
  const mwst = parseFloat(document.getElementById('mwst').value) || 0;
  const finalY = pdf.lastAutoTable.finalY + 10;
pdf.setFont("helvetica", "normal");
pdf.setFontSize(12);
pdf.text(`Nettobetrag: ${netto} €`, 150, finalY, { align: "right" });
pdf.text(`19 % MwSt: ${mwst} €`, 150, finalY + 7, { align: "right" });
pdf.text(`Gesamtsumme: ${total.toFixed(2)} €`, 150, finalY + 14, { align: "right" });


  // Prüfen, ob Artikel bereits existiert
  let artikelExistiert = false;
  const artikelRows = document.querySelectorAll('#rechnungTable tbody tr');
  
  artikelRows.forEach(row => {
    const nameInRow = row.cells[0].textContent.split(' × ')[0]; // Name ohne Menge extrahieren
    if (nameInRow === artikelName) {
      const aktuelleMenge = parseInt(row.cells[1].textContent);
      const neueMenge = aktuelleMenge + menge;
      row.cells[1].textContent = neueMenge;
      row.cells[2].textContent = (einzelpreis * neueMenge).toFixed(2) + ' €';
      artikelExistiert = true;
    }
  });

  // Falls neuer Artikel
  if (!artikelExistiert) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${artikelName} × ${menge}</td>
      <td>${menge}</td>
      <td>${(einzelpreis * menge).toFixed(2)} €</td>
    `;
    document.getElementById('rechnungTable').querySelector('tbody').appendChild(newRow);
  }

  updateTotal();
}
function addItem(item) {
    // Hier kannst du die Logik hinzufügen, um den Artikel zur Rechnung hinzuzufügen
    console.log(item + " wurde zur Rechnung hinzugefügt.");
    // Beispiel: Du könntest den Artikel in ein Eingabefeld einfügen oder eine Liste aktualisieren
}
function addItem(name, menge, einzelpreis) {
    // Hier kannst du die Logik hinzufügen, um den Artikel zur Rechnung hinzuzufügen
    console.log(name + " wurde zur Rechnung hinzugefügt. Menge: " + menge + ", Einzelpreis: " + einzelpreis + "€");
    
    // Beispiel: Artikel zur Rechnungsliste hinzufügen
    let rechnungsliste = document.getElementById('rechnungsliste'); // Stelle sicher, dass du ein Element mit dieser ID hast
    let listItem = document.createElement('li');
    listItem.textContent = `${name} - Menge: ${menge}, Einzelpreis: ${einzelpreis}€`;
    rechnungsliste.appendChild(listItem);
  }
  function updateTotalSum() {
    let total = 0;
    const rows = document.querySelectorAll('#artikelTabelle tbody tr');
    rows.forEach(row => {
        const preis = parseFloat(row.cells[4].textContent.replace(' €', '')) || 0;
        total += preis;
    });

    const netto = (total / 1.19).toFixed(2);
    const mwst = (total - netto).toFixed(2);

    let summeBox = document.getElementById('gesamtSumme');
    if (!summeBox) {
        summeBox = document.createElement('div');
        summeBox.id = 'gesamtSumme';
        summeBox.className = 'summe-box';
        document.querySelector('table').after(summeBox);
    }

    summeBox.innerHTML = `
        <div><strong>Nettobetrag:</strong> ${netto} €</div>
        <div><strong>19 % MwSt:</strong> ${mwst} €</div>
        <div><strong>Gesamtsumme:</strong> ${total.toFixed(2)} €</div>
    `;
}

}
function downloadPDF() {
  alert("PDF download button clicked!"); // Diese Zeile kannst du zum Testen drin lassen

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  // Füge hier den Inhalt für deine PDF hinzu
  pdf.text("Rechnung", 10, 10); // Text an der Position (10, 10)

  // Speichere die PDF und starte den Download
  pdf.save("rechnung.pdf");
}
  // Alte Zeile
doc.output('dataurlnewwindow');

// Neue Zeile
window.open(doc.output('bloburl'));
}
function getNextInvoiceNumber() {
  const key = 'invoiceNumber';
  let currentNumber = localStorage.getItem(key);

  if (!currentNumber) {
    currentNumber = 1;
  } else {
    currentNumber = parseInt(currentNumber) + 1;
  }

  localStorage.setItem(key, currentNumber);
  return currentNumber.toString().padStart(5, '0');
}

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-äöüÄÖÜß]/gi, '_');
}

function resetInvoiceNumber() {
  localStorage.removeItem('invoiceNumber');
}
// Ganz unten in scripts.js

window.onload = function () {
  addArticle();
  function getNextInvoiceNumber() {
  let lastNumber = localStorage.getItem('rechnungsnummer');
  let nextNumber = lastNumber ? parseInt(lastNumber) + 1 : 1;
  localStorage.setItem('rechnungsnummer', nextNumber);
  return nextNumber;
}

function updateInvoiceNumberDisplay() {
  const number = getNextInvoiceNumber();
  document.getElementById('rechnungsnummer').textContent = 'Nr. ' + number.toString().padStart(4, '0');
}

// Aufrufen beim Laden der Seite
window.onload = function () {
  updateInvoiceNumberDisplay();
  // falls du noch mehr beim Laden machst:
  // z. B. buttons vorbereiten etc.
};

