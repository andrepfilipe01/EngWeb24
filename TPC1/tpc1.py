from lxml import etree
import webbrowser

def transform_xml_to_html(xml_file, xslt_file, output_html_file):
    # Load the XSLT stylesheet
    xslt = etree.parse(xslt_file)

    # Load the XML document
    xml = etree.parse(xml_file)

    # Perform the transformation
    transform = etree.XSLT(xslt)
    result = transform(xml)

    # Write the result to an HTML file
    with open(output_html_file, "wb") as f:
        f.write(etree.tostring(result))

def open_in_browser(html_file):
    # Open the HTML file in a web browser
    webbrowser.open_new_tab(html_file)

if __name__ == "__main__":
    xml_file = "data.xml"
    xslt_file = "toHtml.xsl"
    output_html_file = "output.html"

    transform_xml_to_html(xml_file, xslt_file, output_html_file)
    open_in_browser(output_html_file)
