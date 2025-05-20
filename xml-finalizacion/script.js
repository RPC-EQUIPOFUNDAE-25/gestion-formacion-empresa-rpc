
function convertToXML() {
    const fileInput = document.getElementById('excelFile');
    const output = document.getElementById('output');

    if (!fileInput.files.length) {
        alert('Por favor, selecciona un archivo Excel (.xlsx)');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<FinalizacionGruposFormativos>\n';
        json.forEach(row => {
            xml += '  <Grupo>\n';
            for (const key in row) {
                xml += `    <${key}>${row[key]}</${key}>\n`;
            }
            xml += '  </Grupo>\n';
        });
        xml += '</FinalizacionGruposFormativos>';

        const blob = new Blob([xml], { type: 'application/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'finalizacion_grupo.xml';
        link.click();

        output.textContent = xml;
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
}
