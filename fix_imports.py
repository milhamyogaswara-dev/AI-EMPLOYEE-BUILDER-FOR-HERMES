import re

def fix(file):
    with open(file, 'r') as f:
        content = f.read()
    if 'useLanguage' not in content:
        # Add import
        content = re.sub(r'(import React[^;]*;)', r'\1\nimport { useLanguage } from "../../contexts/LanguageContext";', content)
    with open(file, 'w') as f:
        f.write(content)

fix('src/components/views/DashboardView.tsx')

# For Sidebar, path is different
with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()
if 'useLanguage' not in content:
    content = re.sub(r'(import React[^;]*;)', r'\1\nimport { useLanguage } from "../contexts/LanguageContext";', content)
with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)

