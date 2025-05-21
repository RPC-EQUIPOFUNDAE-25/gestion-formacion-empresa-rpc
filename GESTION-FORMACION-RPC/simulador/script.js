function generateXML() {
  const input = document.getElementById("inputData").value.trim();
  const lines = input.split("\n").filter(line => line.trim() !== "");

  const grupos = {};

  for (const line of lines) {
    const [
      idAccion, idGrupo, nif, tipoDoc, email, telefono,
      catProf, nivelEst, diploma, directos, indirectos, salariales,
      mes1, importe1, mes2, importe2
    ] = line.split("\t");

    const grupoId = `${idAccion}_${idGrupo}`;
    if (!grupos[grupoId]) {
      grupos[grupoId] = {
        idAccion, idGrupo,
        participantes: [],
        costes: {
          directos, indirectos, salariales,
          periodos: [
            { mes: mes1, importe: importe1 },
            { mes: mes2, importe: importe2 }
          ]
        }
      };
    }

    grupos[grupoId].participantes.push({
      nif,
      N_TIPO_DOCUMENTO: tipoDoc,
      ERTE_RD_ley: "false",
      email,
      telefono,
      discapacidad: "false",
      afectadosTerrorismo: "false",
      afectadosViolenciaGenero: "false",
      categoriaprofesional: catProf,
      nivelestudios: nivelEst,
      DiplomaAcreditativo: diploma,
      fijoDiscontinuo: "false"
    });
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<grupos>\n`;

  for (const grupo of Object.values(grupos)) {
    xml += `  <grupo>\n`;
    xml += `    <idAccion>${grupo.idAccion}</idAccion>\n`;
    xml += `    <idGrupo>${grupo.idGrupo}</idGrupo>\n`;
    xml += `    <participantes>\n`;
    for (const p of grupo.participantes) {
      xml += `      <participante>\n`;
      xml += `        <nif>${p.nif}</nif>\n`;
      xml += `        <N_TIPO_DOCUMENTO>${p.N_TIPO_DOCUMENTO}</N_TIPO_DOCUMENTO>\n`;
      xml += `        <ERTE_RD_ley>${p.ERTE_RD_ley}</ERTE_RD_ley>\n`;
      xml += `        <email>${p.email}</email>\n`;
      xml += `        <telefono>${p.telefono}</telefono>\n`;
      xml += `        <discapacidad>${p.discapacidad}</discapacidad>\n`;
      xml += `        <afectadosTerrorismo>${p.afectadosTerrorismo}</afectadosTerrorismo>\n`;
      xml += `        <afectadosViolenciaGenero>${p.afectadosViolenciaGenero}</afectadosViolenciaGenero>\n`;
      xml += `        <categoriaprofesional>${p.categoriaprofesional}</categoriaprofesional>\n`;
      xml += `        <nivelestudios>${p.nivelestudios}</nivelestudios>\n`;
      xml += `        <DiplomaAcreditativo>${p.DiplomaAcreditativo}</DiplomaAcreditativo>\n`;
      xml += `        <fijoDiscontinuo>${p.fijoDiscontinuo}</fijoDiscontinuo>\n`;
      xml += `      </participante>\n`;
    }
    xml += `    </participantes>\n`;
    xml += `    <costes>\n`;
    xml += `      <coste>\n`;
    xml += `        <directos>${grupo.costes.directos}</directos>\n`;
    xml += `        <indirectos>${grupo.costes.indirectos}</indirectos>\n`;
    xml += `        <salariales>${grupo.costes.salariales}</salariales>\n`;
    xml += `        <periodos>\n`;
    for (const periodo of grupo.costes.periodos) {
      xml += `          <periodo>\n`;
      xml += `            <mes>${periodo.mes}</mes>\n`;
      xml += `            <importe>${periodo.importe}</importe>\n`;
      xml += `          </periodo>\n`;
    }
    xml += `        </periodos>\n`;
    xml += `      </coste>\n`;
    xml += `    </costes>\n`;
    xml += `  </grupo>\n`;
  }

  xml += `</grupos>`;

  document.getElementById("output").textContent = xml;