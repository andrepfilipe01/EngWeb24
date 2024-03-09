import json

# Read the input JSON file with UTF-8 encoding
with open('filmesIncorreto.json', 'r', encoding='utf-8') as file:
    json_lines = file.readlines()

# Process each line
movies = []
for line in json_lines:
    # Load each line as JSON
    movie = json.loads(line)
    # Add the movie to the list
    movies.append(movie)

# Construct the final JSON structure
final_json = {"filmes": movies}

# Write the corrected JSON to a new file
with open('filmes.json', 'w', encoding='utf-8') as file:
    json.dump(final_json, file, ensure_ascii=False, indent=4)

print("JSON file has been corrected and saved as filmesCorrigidos.json")
