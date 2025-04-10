function generateInvoice() {
  const artikelName = document.getElementById('artikelName').value;
  const einzelpreis = parseFloat(document.getElementById('einzelpreis').value);
  const menge = parseInt(document.getElementById('menge').value) || 1; // Falls Menge leer, default 1
  const mwst = parseFloat(document.getElementById('mwst').value) || 0;

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
function downloadPDF() {
  alert("PDF download button clicked!"); // Diese Zeile kannst du zum Testen drin lassen

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  // Füge hier den Inhalt für deine PDF hinzu
  pdf.text("Rechnung", 10, 10); // Text an der Position (10, 10)

  // Speichere die PDF und starte den Download
  pdf.save("rechnung.pdf");
}
  // ... the rest of your PDF creation code ...
}
