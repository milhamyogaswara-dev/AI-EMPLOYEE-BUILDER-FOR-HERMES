import re

with open('src/components/views/SkillsView.tsx', 'r') as f:
    content = f.read()

if 'useLanguage' not in content:
    content = content.replace("import { NavView } from '../Sidebar';", "import { NavView } from '../Sidebar';\nimport { useLanguage } from '../../contexts/LanguageContext';")

if 'const { t, lang } = useLanguage();' not in content:
    content = re.sub(r'(export const SkillsView: React\.FC<SkillsViewProps> = \(\{[^\}]+\}\) => \{)', r'\1\n  const { t, lang } = useLanguage();\n  const isId = lang === \'id\';', content)

content = content.replace("Active Blueprints", "{t('dash.activeBlueprints')}")
content = content.replace(">Specialized Capabilities<", ">{isId ? 'Kemampuan Khusus' : 'Specialized Capabilities'}<")
content = content.replace(">Your assistant is equipped with<", ">{isId ? 'Asisten Anda dilengkapi dengan' : 'Your assistant is equipped with'}<")
content = content.replace(">Synthesize Skill<", ">{t('skills.synthesize')}<")

content = content.replace("Analysis & Reasoning", "{isId ? 'Analisis & Penalaran' : 'Analysis & Reasoning'}")
content = content.replace("Data & Web", "{isId ? 'Data & Web' : 'Data & Web'}")
content = content.replace("Creative & Generation", "{isId ? 'Kreatif & Generasi' : 'Creative & Generation'}")
content = content.replace("Execution & Tasks", "{isId ? 'Eksekusi & Tugas' : 'Execution & Tasks'}")
content = content.replace("Search available skills...", "{isId ? 'Cari keahlian yang tersedia...' : 'Search available skills...'}")

with open('src/components/views/SkillsView.tsx', 'w') as f:
    f.write(content)
