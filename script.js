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
