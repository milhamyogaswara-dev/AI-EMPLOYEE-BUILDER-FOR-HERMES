import re

with open('src/components/views/MemoryView.tsx', 'r') as f:
    content = f.read()

# Add useLanguage import
if 'useLanguage' not in content:
    content = content.replace("import { Assistant, Memory, MemoryCategory } from '../../types';", "import { Assistant, Memory, MemoryCategory } from '../../types';\nimport { useLanguage } from '../../contexts/LanguageContext';")

# Add hook
if 'const { t } = useLanguage();' not in content:
    content = re.sub(r'(export const MemoryView: React\.FC<MemoryViewProps> = \(\{[^\}]+\}\) => \{)', r'\1\n  const { t, lang } = useLanguage();\n  const isId = lang === \'id\';', content)

with open('src/components/views/MemoryView.tsx', 'w') as f:
    f.write(content)
