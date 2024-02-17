import os
import xml.etree.ElementTree as ET

import os
import xml.etree.ElementTree as ET
from lxml import etree

def convert_xml_to_html_links(input_folder, output_folder):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Get list of XML files in the input folder
    xml_files = [file for file in os.listdir(input_folder) if file.endswith('.xml')]

    # Iterate over each XML file
    for xml_file in xml_files:
        xml_path = os.path.join(input_folder, xml_file)

        # Extract filename without extension
        file_name = os.path.splitext(xml_file)[0]

        # Create HTML link
        html_link = f'<a href="{xml_path}">{file_name}</a>'

        # Write HTML link to output file
        output_file_path = os.path.join(output_folder, f'{file_name}.html')
        with open(output_file_path, 'w') as output_file:
            output_file.write(html_link)

        print(f'Converted {xml_file} to {output_file_path}')

# Specify input and output folders
input_folder = 'MapaRuas-materialBase/texto'  # Change this to the path of your input folder
output_folder = 'htmlLinks'  # Change this to the path of your output folder

# Call the function to convert XML files to HTML links
convert_xml_to_html_links(input_folder, output_folder)

#########################################################################

html_template = """
<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <title>List of Streets</title>
    <meta charset="utf-8">
</head>
<body>
<h1>List of Streets</h1>
<ul>
{street_links}
</ul>
</body>
</html>
"""

# Directory containing HTML links for each street
html_links_folder = "htmlLinks"

# Directory containing XML files for each street
xml_folder = "xmlFiles"

# List to hold street names and their corresponding HTML links
street_links = []

# Iterate over each file in the directory
for filename in os.listdir(html_links_folder):
    if filename.endswith(".html"):  # Make sure we only process HTML files
        street_name = os.path.splitext(filename)[0]  # Extract street name from file name
        html_link = os.path.join(html_links_folder, filename)  # Generate HTML link

        # Check if corresponding XML file exists
        xml_filename = os.path.join(xml_folder, f"{street_name}.xml")
        if os.path.exists(xml_filename):
            # If XML file exists, parse it to extract relevant information
            tree = ET.parse(xml_filename)
            root = tree.getroot()

            # Extracting the relevant information from XML
            number = root.find("./meta/número").text
            street_description = root.find("./corpo/para").text.strip()

            # Adding extracted information to the HTML link
            html_link += f"?xml={xml_filename}"  # Adding XML file path as a query parameter
            html_link += f"&number={number}"  # Adding street number as a query parameter
            html_link += f"&description={street_description}"  # Adding street description as a query parameter

        street_links.append(f'<li><a href="{html_link}">{street_name}</a></li>')  # Add to list

# Join all street links into a single string
all_street_links = "\n".join(street_links)

# Generate the HTML content for the main page
main_html_content = html_template.format(street_links=all_street_links)

# Write the HTML content to a new file for the main page
with open("index.html", "w") as main_html_file:
    main_html_file.write(main_html_content)
