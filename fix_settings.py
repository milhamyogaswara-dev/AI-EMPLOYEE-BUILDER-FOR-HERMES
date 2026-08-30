import re

with open('src/components/views/SettingsView.tsx', 'r') as f:
    content = f.read()

# Add useLanguage import
if 'useLanguage' not in content:
    content = content.replace("import { UserProfile } from '../../types';", "import { UserProfile } from '../../types';\nimport { useLanguage, Language } from '../../contexts/LanguageContext';")

# Add hook
if 'const { t, setLang } = useLanguage();' not in content:
    content = re.sub(r'(export const SettingsView: React\.FC<SettingsViewProps> = \(\{[^\}]+\}\) => \{)', r'\1\n  const { t, setLang } = useLanguage();', content)

# Sync language to context when saving
# In handleSave
content = re.sub(
    r'(onUpdateProfile\(profile\);\s*setIsSaved\(true\);)',
    r'\1\n    setLang(profile.appLanguage.toLowerCase() as Language);',
    content
)

with open('src/components/views/SettingsView.tsx', 'w') as f:
    f.write(content)
