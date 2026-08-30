import re

with open('src/components/views/ToolboxView.tsx', 'r') as f:
    content = f.read()

if 'useLanguage' not in content:
    content = content.replace("import { Assistant, ToolItem } from '../../types';", "import { Assistant, ToolItem } from '../../types';\nimport { useLanguage } from '../../contexts/LanguageContext';")

if 'const { lang } = useLanguage();' not in content:
    content = re.sub(r'(export const ToolboxView: React\.FC<ToolboxViewProps> = \(\{[^\}]+\}\) => \{)', r'\1\n  const { lang } = useLanguage();\n  const isId = lang === \'id\';', content)

content = content.replace(">Web & Cloud Connections<", ">{isId ? 'Koneksi Web & Cloud' : 'Web & Cloud Connections'}<")
content = content.replace(">Search integrations...<", ">{isId ? 'Cari integrasi...' : 'Search integrations...'}<")

with open('src/components/views/ToolboxView.tsx', 'w') as f:
    f.write(content)
