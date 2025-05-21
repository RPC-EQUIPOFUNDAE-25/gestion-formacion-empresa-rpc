
function generarXML() {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    if (!file) {
        alert('Por favor, sube un archivo Excel.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const xmlParts = ['<?xml version="1.0" encoding="UTF-8"?>', '<grupos>'];

        const grupos = {};
        json.forEach(row => {
            const idAccion = row['idAccion'];
            const idGrupo = row['idGrupo'];

            const key = `${idAccion}_${idGrupo}`;
            if (!grupos[key]) {
                grupos[key] = {
                    participantes: [],
                    costes: {
                        directos: row['costeDirecto'] || "0.00",
                        indirectos: row['costeIndirecto'] || "0.00",
                        salariales: row['costeSalarial'] || "0.00"
                    }
                };
            }

            grupos[key].participantes.push({
                nif: row['nif'],
                tipoDoc: row['tipoDocumento'],
                email: row['email'],
                telefono: row['telefono'],
                categoria: row['categoriaProfesional'],
                estudios: row['nivelEstudios'],
                diploma: row['diploma']
            });
        });

        for (const key in grupos) {
            const [idAccion, idGrupo] = key.split('_');
            const grupo = grupos[key];

            xmlParts.push('  <grupo>');
            xmlParts.push(`    <idAccion>${idAccion}</idAccion>`);
            xmlParts.push(`    <idGrupo>${idGrupo}</idGrupo>`);

            xmlParts.push('    <participantes>');
            grupo.participantes.forEach(p => {
                xmlParts.push('      <participante>');
                xmlParts.push(`        <nif>${p.nif}</nif>`);
                xmlParts.push(`        <N_TIPO_DOCUMENTO>${p.tipoDoc}</N_TIPO_DOCUMENTO>`);
                xmlParts.push(`        <email>${p.email}</email>`);
                xmlParts.push(`        <telefono>${p.telefono}</telefono>`);
                xmlParts.push(`        <categoriaprofesional>${p.categoria}</categoriaprofesional>`);
                xmlParts.push(`        <nivelestudios>${p.estudios}</nivelestudios>`);
                xmlParts.push(`        <DiplomaAcreditativo>${p.diploma}</DiplomaAcreditativo>`);
                xmlParts.push('      </participante>');
            });
            xmlParts.push('    </participantes>');

            xmlParts.push('    <costes>');
            xmlParts.push('      <coste>');
            xmlParts.push(`        <directos>${grupo.costes.directos}</directos>`);
            xmlParts.push(`        <indirectos>${grupo.costes.indirectos}</indirectos>`);
            xmlParts.push(`        <salariales>${grupo.costes.salariales}</salariales>`);
            xmlParts.push('      </coste>');
            xmlParts.push('    </costes>');

            xmlParts.push('  </grupo>');
        }

        xmlParts.push('</grupos>');

        const blob = new Blob([xmlParts.join("\n")], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const link = document.getElementById('downloadLink');
        link.href = url;
        link.download = 'finalizacion_fundae.xml';
        link.style.display = 'inline-block';
        link.textContent = 'Descargar XML';
    };

    reader.readAsArrayBuffer(file);
}
