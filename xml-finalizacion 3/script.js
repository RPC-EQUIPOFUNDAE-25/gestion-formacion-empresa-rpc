
function convertToXML() {
    const fileInput = document.getElementById("fileInput");
    const output = document.getElementById("output");

    if (!fileInput.files.length) {
        output.textContent = "Por favor, selecciona un archivo Excel.";
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<FinalizacionGrupos>\n';
        jsonData.forEach((row) => {
            xml += "  <Participante>\n";
            for (const key in row) {
                xml += `    <${key}>${row[key]}</${key}>\n`;
            }
            xml += "  </Participante>\n";
        });
        xml += "</FinalizacionGrupos>";

        output.textContent = xml;
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
}
