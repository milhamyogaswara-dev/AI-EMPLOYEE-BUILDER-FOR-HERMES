import re

with open('src/components/views/AssistantWorkspaceView.tsx', 'r') as f:
    content = f.read()

if 'useLanguage' not in content:
    content = content.replace("import { NavView } from '../Sidebar';", "import { NavView } from '../Sidebar';\nimport { useLanguage } from '../../contexts/LanguageContext';")

if 'const { t, lang } = useLanguage();' not in content:
    content = re.sub(r'(export const AssistantWorkspaceView: React\.FC<AssistantWorkspaceViewProps> = \(\{[^\}]+\}\) => \{)', r'\1\n  const { t, lang } = useLanguage();\n  const isId = lang === \'id\';', content)

# I will replace literals with `{isId ? 'id' : 'en'}` for fast inline translation of simple strings where I don't have dictionary entries yet.
content = content.replace(">READY TO DEPLOY<", ">{t('card.readyToDeploy')}<")
content = content.replace(">Training Accuracy<", ">{t('card.trainingAccuracy')}<")
content = content.replace(">Test Score<", ">{t('card.testScore')}<")
content = content.replace("Teach Rules", "{t('card.teachRules')}")
content = content.replace(">Workspace<", ">{t('card.workspace')}<")

content = content.replace("<span>CORE DIRECTIVES</span>", "<span>{isId ? 'ARAHAN UTAMA' : 'CORE DIRECTIVES'}</span>")
content = content.replace("<span>MEMORY VAULT</span>", "<span>{isId ? 'PENYIMPANAN MEMORI' : 'MEMORY VAULT'}</span>")
content = content.replace("<span>SOP LIBRARY</span>", "<span>{isId ? 'PUSTAKA SOP' : 'SOP LIBRARY'}</span>")
content = content.replace("<span>SKILLS & TOOLS</span>", "<span>{isId ? 'KEAHLIAN & ALAT' : 'SKILLS & TOOLS'}</span>")
content = content.replace("<span>TEST LAB</span>", "<span>{isId ? 'LAB UJI' : 'TEST LAB'}</span>")
content = content.replace("<span>DEPLOYMENT</span>", "<span>{isId ? 'PENERAPAN' : 'DEPLOYMENT'}</span>")
content = content.replace(">Configure Base Rules<", ">{isId ? 'Konfigurasi Aturan Dasar' : 'Configure Base Rules'}<")
content = content.replace(">Inject Persistent Facts<", ">{isId ? 'Suntikkan Fakta Persisten' : 'Inject Persistent Facts'}<")
content = content.replace(">Define Macro Processes<", ">{isId ? 'Tentukan Proses Makro' : 'Define Macro Processes'}<")
content = content.replace(">Equip Capabilities<", ">{isId ? 'Lengkapi Kemampuan' : 'Equip Capabilities'}<")
content = content.replace(">Run Accuracy Benchmarks<", ">{isId ? 'Jalankan Tolok Ukur Akurasi' : 'Run Accuracy Benchmarks'}<")
content = content.replace(">Push to Hermes Runtime<", ">{isId ? 'Dorong ke Runtime Hermes' : 'Push to Hermes Runtime'}<")

content = content.replace("Studio Execution Log", "{t('dash.log')}")
content = content.replace("LIVE ACTIVITY STREAM", "{t('dash.liveStream')}")
content = content.replace("facts", "{isId ? 'fakta' : 'facts'}")
content = content.replace("playbooks", "{isId ? 'buku panduan' : 'playbooks'}")
content = content.replace("equipped", "{isId ? 'dilengkapi' : 'equipped'}")
content = content.replace("passed", "{isId ? 'lulus' : 'passed'}")

with open('src/components/views/AssistantWorkspaceView.tsx', 'w') as f:
    f.write(content)
