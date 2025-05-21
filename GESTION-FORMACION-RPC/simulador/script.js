
function convertToXML() {
    const fileInput = document.getElementById('excelFile');
    const output = document.getElementById('output');
    const downloadLink = document.getElementById('downloadLink');

    if (!fileInput.files.length) {
        alert("Por favor, sube un archivo Excel.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<grupos>\n';
        json.forEach(row => {
            xml += `  <grupo>
    <idAccion>${row.idAccion}</idAccion>
    <idGrupo>${row.idGrupo}</idGrupo>
    <participantes>
      <participante>
        <nif>${row.nif}</nif>
        <N_TIPO_DOCUMENTO>${row.tipoDocumento}</N_TIPO_DOCUMENTO>
        <email>${row.email}</email>
        <telefono>${row.telefono}</telefono>
        <categoriaprofesional>${row.categoria}</categoriaprofesional>
        <nivelestudios>${row.estudios}</nivelestudios>
        <DiplomaAcreditativo>${row.diploma}</DiplomaAcreditativo>
      </participante>
    </participantes>
    <costes>
      <coste>
        <directos>${row.directos}</directos>
        <indirectos>${row.indirectos}</indirectos>
        <salariales>${row.salariales}</salariales>
      </coste>
    </costes>
  </grupo>\n`;
        });
        xml += '</grupos>';

        output.textContent = xml;

        const blob = new Blob([xml], {type: 'application/xml'});
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.style.display = 'inline-block';
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
}
