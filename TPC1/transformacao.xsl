<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f8f8f8;
        }
        .container {
          max-width: 800px;
          margin: 20px auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
        }
        h2 {
          margin-top: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        table, th, td {
          border: 1px solid #ddd;
        }
        th, td {
          padding: 8px;
          text-align: left;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: auto;
          margin-bottom: 10px;
        }
        p {
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Street Details</h1>
        <h2>Numero de rua: <xsl:value-of select="rua/meta/número"/></h2>
        <h2>Nome da rua: <xsl:value-of select="rua/meta/nome"/></h2>
        <xsl:for-each select="rua/corpo/figura">
          <img src="{imagem/@path}" alt="Image at path: {imagem/@path}"/>
          <p><xsl:value-of select="legenda"/></p>
        </xsl:for-each>
        <xsl:for-each select="rua/corpo/para">
          <p><xsl:value-of select="."/></p>
        </xsl:for-each>
        <table>
          <tr>
            <th>Número</th>
            <th>Enfiteuta</th>
            <th>Foro</th>
            <th>Descrição</th>
          </tr>
          <xsl:for-each select="rua/corpo/lista-casas/casa">
            <tr>
              <td><xsl:value-of select="número"/></td>
              <td><xsl:value-of select="enfiteuta"/></td>
              <td><xsl:value-of select="foro"/></td>
              <td><xsl:value-of select="desc"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </div>
    </body>
  </html>
</xsl:template>

</xsl:stylesheet>
