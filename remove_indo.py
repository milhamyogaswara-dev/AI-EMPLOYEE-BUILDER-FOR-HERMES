import re
import os

# 1. Update translations.ts
with open('src/i18n/translations.ts', 'r') as f:
    content = f.read()

# Strip out the 'id: { ... }' block and change type Language = 'en' | 'id'; to 'en'
content = re.sub(r',\s*id:\s*\{.*\}\};', '};', content, flags=re.DOTALL)
content = content.replace("export type Language = 'en' | 'id';", "export type Language = 'en';")

with open('src/i18n/translations.ts', 'w') as f:
    f.write(content)

# 2. Update types.ts
with open('src/types.ts', 'r') as f:
    types = f.read()
types = types.replace("appLanguage: 'EN' | 'ID';", "appLanguage: 'EN';")
with open('src/types.ts', 'w') as f:
    f.write(types)

# 3. Process all views to remove isId ternaries
def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    orig = content
    
    # Replace isId ? 'id_text' : 'en_text' with 'en_text'
    # Match: {isId ? 'A' : 'B'} -> {'B'}
    content = re.sub(r'\{\s*isId\s*\?\s*[\'"`][^\'"`]*[\'"`]\s*:\s*([\'"`][^\'"`]*[\'"`])\s*\}', r'{\1}', content)
    
    # Match: >{isId ? 'A' : 'B'}< -> >B<
    # Wait, the above replaced {isId ? 'A' : 'B'} to {'B'}. If it's >{'B'}< it's valid JSX.
    
    # Match: isId ? 'A' : 'B' -> 'B' (where not wrapped in braces)
    content = re.sub(r'isId\s*\?\s*[\'"`][^\'"`]*[\'"`]\s*:\s*([\'"`][^\'"`]*[\'"`])', r'\1', content)
    
    # In SettingsView, there's a language dropdown.
    if 'SettingsView' in filepath:
        # Remove the Bahasa Indonesia option
        content = re.sub(r'<option value="ID">Bahasa Indonesia</option>', '', content)
        # Update setFormState type if necessary
        content = content.replace("as 'EN' | 'ID'", "as 'EN'")
        # It also has {isId ? 'Preferensi Antarmuka' : 'Interface Preferences'} which will be handled by the regex above.
        
    if content != orig:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            clean_file(os.path.join(root, file))

