import re

with open('src/components/views/DeployView.tsx', 'r') as f:
    content = f.read()

if 'useLanguage' not in content:
    content = content.replace("import { Assistant } from '../../types';", "import { Assistant } from '../../types';\nimport { useLanguage } from '../../contexts/LanguageContext';")

if 'const { t, lang } = useLanguage();' not in content:
    content = re.sub(r'(export const DeployView: React\.FC<DeployViewProps> = \(\{[^\}]+\}\) => \{)', r'\1\n  const { t, lang } = useLanguage();\n  const isId = lang === \'id\';', content)

content = content.replace("Pre-Deployment Calibration Checklist", "{t('deploy.checklist')}")
content = content.replace("Hermes Deployment Package", "{isId ? 'Paket Penerapan Hermes' : 'Hermes Deployment Package'}")
content = content.replace("Export Production Manifest", "{t('deploy.export')}")
content = content.replace("Download ZIP", "{t('deploy.download')}")
content = content.replace(">READY FOR DEPLOYMENT<", ">{isId ? 'SIAP UNTUK PENERAPAN' : 'READY FOR DEPLOYMENT'}<")

with open('src/components/views/DeployView.tsx', 'w') as f:
    f.write(content)
