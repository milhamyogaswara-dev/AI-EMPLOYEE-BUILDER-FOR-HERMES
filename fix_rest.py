import re

files = [
    'src/components/views/AuthorityView.tsx',
    'src/components/views/AutomationView.tsx',
    'src/components/views/TestLabView.tsx',
    'src/components/views/IntegrationsView.tsx',
    'src/components/views/TemplatesView.tsx',
    'src/components/views/CreateAssistantWizard.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    if 'useLanguage' not in content:
        content = re.sub(r'(import React[^;]*;)', r'\1\nimport { useLanguage } from "../../contexts/LanguageContext";', content)

    if 'const { lang } = useLanguage();' not in content:
        content = re.sub(r'(export const \w+: React\.FC<\w+> = \(\{[^\}]+\}\) => \{)', r"\1\n  const { lang, t } = useLanguage();\n  const isId = lang === 'id';", content)
    
    with open(file, 'w') as f:
        f.write(content)
