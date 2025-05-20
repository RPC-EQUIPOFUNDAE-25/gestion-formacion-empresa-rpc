
async function generateXML() {
    const fileInput = document.getElementById('excelFile');
    const output = document.getElementById('xmlOutput');
    if (!fileInput.files.length) {
        alert('Por favor selecciona un archivo Excel.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});

        // Suponemos que los datos están en la primera hoja
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);

        let xml = '<grupos>\n';
        for (const row of json) {
            xml += '  <grupo>\n';
            xml += `    <idAccion>${row['idAccion']}</idAccion>\n`;
            xml += `    <idGrupo>${row['idGrupo']}</idGrupo>\n`;
            xml += '    <participantes>\n';
            xml += '      <participante>\n';
            xml += `        <nif>${row['nif']}</nif>\n`;
            xml += `        <N_TIPO_DOCUMENTO>${row['N_TIPO_DOCUMENTO']}</N_TIPO_DOCUMENTO>\n`;
            xml += `        <email>${row['email']}</email>\n`;
            xml += `        <telefono>${row['telefono']}</telefono>\n`;
            xml += `        <categoriaprofesional>${row['categoriaprofesional']}</categoriaprofesional>\n`;
            xml += `        <nivelestudios>${row['nivelestudios']}</nivelestudios>\n`;
            xml += `        <DiplomaAcreditativo>${row['DiplomaAcreditativo']}</DiplomaAcreditativo>\n`;
            xml += '      </participante>\n';
            xml += '    </participantes>\n';
            xml += '    <costes>\n';
            xml += '      <coste>\n';
            xml += `        <directos>${row['coste_directos']}</directos>\n`;
            xml += `        <indirectos>${row['coste_indirectos']}</indirectos>\n`;
            xml += `        <salariales>${row['coste_salariales']}</salariales>\n`;
            xml += '      </coste>\n';
            xml += '    </costes>\n';
            xml += '  </grupo>\n';
        }
        xml += '</grupos>';

        output.value = xml;
    };
    reader.readAsArrayBuffer(file);
}
