import re

def add_import(file, statement):
    with open(file, 'r') as f:
        content = f.read()
    if statement not in content:
        content = statement + '\n' + content
    with open(file, 'w') as f:
        f.write(content)

add_import('src/components/Sidebar.tsx', "import { useLanguage } from '../contexts/LanguageContext';")
add_import('src/components/views/DashboardView.tsx', "import { useLanguage } from '../../contexts/LanguageContext';")

# Fix Header.tsx (remove 'create' from Record or cast as any)
with open('src/components/Header.tsx', 'r') as f:
    content = f.read()
content = content.replace("Record<NavView, { title: string; subtitle: string }>", "Record<string, { title: string; subtitle: string }>")
with open('src/components/Header.tsx', 'w') as f:
    f.write(content)
