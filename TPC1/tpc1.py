import os
import xml.etree.ElementTree as ET
from lxml import etree

xml_folder = 'MapaRuas-materialBase/texto'
xslt_file = 'transformacao.xsl'

def xmlToHtml_links(xml_file):

    xml_file_path = os.path.join(xml_folder, xml_file)

    html_file_name = os.path.splitext(xml_file)
    html_file_path = os.path.join(xml_folder, f'{html_file_name}.html')

    # Parse the XML and XSLT
    xml_tree = etree.parse(xml_file_path)
    xslt_tree = etree.parse(xslt_file)

    # Prepare the XSLT transformation
    transform = etree.XSLT(xslt_tree)

    # Apply the transformation
    transformed_html = transform(xml_tree)

    # Write the transformed HTML to a file
    with open(html_file_path, 'wb') as file:
        file.write(etree.tostring(transformed_html, pretty_print=True))

    return html_file_path


def process_xml_file(xml_file):
    xml_file_path = os.path.join(xml_folder, xml_file)

    # Check if the file follows the desired pattern
    if xml_file.startswith("MRB-") and xml_file.endswith(".xml"):
        # Insert XML declaration and XSLT instruction if not already present
        with open(xml_file_path, 'r+', encoding='utf-8') as f:
            lines = f.readlines()
            if not lines[0].startswith('<?xml'):
                lines.insert(0, '<?xml version="1.0" encoding="UTF-8"?>\n')
            if not lines[1].startswith('<?xml-stylesheet'):
                lines.insert(1, '<?xml-stylesheet type="text/xsl" href="./transformacao.xsl"?>\n')

            f.seek(0)
            f.writelines(lines)
            f.truncate()

        # Transform XML to HTML
        html_file = xmlToHtml_links(xml_file)
        return html_file
    else:
        return None

html_list = []
street_names = {}  # Dictionary to store mapping between HTML file name and street name

for file in os.listdir(xml_folder):
    html_file = process_xml_file(file)
    if html_file:
        street_name = os.path.splitext(file)[0].split('-')[2]  # Extract street name
        street_names[html_file] = street_name
        html_list.append(html_file)

# Generate HTML list items with links to the generated HTML files
html_items = []
for html_file in html_list:
    street_name = street_names[html_file]
    html_items.append(f'<li><a href="{html_file}">{street_name}</a></li>')


# Concatenate HTML list items
html = '\n'.join(html_items)

# Escrever o HTML em um arquivo
with open('index.html', 'w') as f:
    f.write(html)


