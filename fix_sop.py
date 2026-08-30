import re

with open('src/components/views/SOPView.tsx', 'r') as f:
    content = f.read()

if 'useLanguage' not in content:
    content = content.replace("import { Assistant, SOP } from '../../types';", "import { Assistant, SOP } from '../../types';\nimport { useLanguage } from '../../contexts/LanguageContext';")

if 'const { t, lang } = useLanguage();' not in content:
    content = re.sub(r'(export const SOPView: React\.FC<SOPViewProps> = \(\{[^\}]+\}\) => \{)', r'\1\n  const { t, lang } = useLanguage();\n  const isId = lang === \'id\';', content)

content = content.replace(">Operational Playbooks<", ">{t('sop.playbooks')}<")
content = content.replace(">Multi-step procedural logic<", ">{isId ? 'Logika prosedural multi-langkah' : 'Multi-step procedural logic'}<")
content = content.replace(">Define complex, deterministic<", ">{isId ? 'Tentukan alur kerja makro yang kompleks dan deterministik.' : 'Define complex, deterministic macro-workflows.'}<")
content = content.replace(">Add SOP<", ">{isId ? 'Tambah SOP' : 'Add SOP'}<")
content = content.replace(">Trigger Condition<", ">{t('general.triggerCondition')}<")
content = content.replace(">Tools Needed<", ">{t('general.toolsNeeded')}<")
content = content.replace("Search playbooks...", "{isId ? 'Cari buku panduan...' : 'Search playbooks...'}")

with open('src/components/views/SOPView.tsx', 'w') as f:
    f.write(content)
