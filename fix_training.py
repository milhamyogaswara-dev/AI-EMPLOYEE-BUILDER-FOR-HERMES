import re

with open('src/components/views/TrainingCenterView.tsx', 'r') as f:
    content = f.read()

if 'useLanguage' not in content:
    content = content.replace("import { Assistant, TrainingRule } from '../../types';", "import { Assistant, TrainingRule } from '../../types';\nimport { useLanguage } from '../../contexts/LanguageContext';")

if 'const { lang } = useLanguage();' not in content:
    content = re.sub(r'(export const TrainingCenterView: React\.FC<TrainingCenterViewProps> = \(\{[^\}]+\}\) => \{)', r'\1\n  const { lang } = useLanguage();\n  const isId = lang === \'id\';', content)

content = content.replace("Prime Directives & Guardrails", "{isId ? 'Arahan Utama & Batasan' : 'Prime Directives & Guardrails'}")
content = content.replace("Define how your assistant behaves", "{isId ? 'Tentukan bagaimana asisten Anda berperilaku' : 'Define how your assistant behaves'}")
content = content.replace(">Add Rule<", ">{isId ? 'Tambah Aturan' : 'Add Rule'}<")
content = content.replace("Behavioral Rules", "{isId ? 'Aturan Perilaku' : 'Behavioral Rules'}")
content = content.replace("Format & Tonal", "{isId ? 'Format & Nada' : 'Format & Tonal'}")
content = content.replace("Restrictions", "{isId ? 'Batasan' : 'Restrictions'}")
content = content.replace("Search rules...", "{isId ? 'Cari aturan...' : 'Search rules...'}")
content = content.replace("All Categories", "{isId ? 'Semua Kategori' : 'All Categories'}")
content = content.replace("Rule Content", "{isId ? 'Konten Aturan' : 'Rule Content'}")
content = content.replace("Impact Level", "{isId ? 'Tingkat Dampak' : 'Impact Level'}")

with open('src/components/views/TrainingCenterView.tsx', 'w') as f:
    f.write(content)
