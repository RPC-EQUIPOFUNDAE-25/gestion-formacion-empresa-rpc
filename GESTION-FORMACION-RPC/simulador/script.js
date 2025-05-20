
function generarXML() {
  const input = document.getElementById('excelFile');
  const output = document.getElementById('output');

  if (!input.files.length) {
    output.textContent = "Por favor, sube un archivo Excel.";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<grupos>\n`;

    json.forEach(row => {
      xml += `  <grupo>\n`;
      xml += `    <idAccion>${row.idAccion}</idAccion>\n`;
      xml += `    <idGrupo>${row.idGrupo}</idGrupo>\n`;
      xml += `    <participantes>\n`;
      xml += `      <participante>\n`;
      xml += `        <nif>${row.nif}</nif>\n`;
      xml += `        <N_TIPO_DOCUMENTO>${row.N_TIPO_DOCUMENTO}</N_TIPO_DOCUMENTO>\n`;
      xml += `        <email>${row.email}</email>\n`;
      xml += `        <telefono>${row.telefono}</telefono>\n`;
      xml += `        <categoriaprofesional>${row.categoriaprofesional}</categoriaprofesional>\n`;
      xml += `        <nivelestudios>${row.nivelestudios}</nivelestudios>\n`;
      xml += `        <DiplomaAcreditativo>${row.DiplomaAcreditativo}</DiplomaAcreditativo>\n`;
      xml += `      </participante>\n`;
      xml += `    </participantes>\n`;
      xml += `    <costes>\n`;
      xml += `      <coste>\n`;
      xml += `        <directos>${row.directos}</directos>\n`;
      xml += `        <indirectos>${row.indirectos}</indirectos>\n`;
      xml += `        <salariales>${row.salariales}</salariales>\n`;
      xml += `      </coste>\n`;
      xml += `    </costes>\n`;
      xml += `  </grupo>\n`;
    });

    xml += `</grupos>`;
    output.textContent = xml;
  };

  reader.readAsArrayBuffer(input.files[0]);
}