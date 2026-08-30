import re

with open('src/components/views/MemoryView.tsx', 'r') as f:
    content = f.read()

# Memory Health Scanner Widget
content = content.replace("Memory Integrity Notice: ${conflictMemories.length} Discrepancy Found", "${isId ? `Pemberitahuan Integritas Memori: ${conflictMemories.length} Ketidaksesuaian Ditemukan` : `Memory Integrity Notice: ${conflictMemories.length} Discrepancy Found`}")
content = content.replace("'Cognitive Health: 100% Coherent'", "isId ? 'Kesehatan Kognitif: 100% Koheren' : 'Cognitive Health: 100% Coherent'")
content = content.replace("'There are conflicting facts in your assistant memory store. Please resolve to maintain high execution accuracy.'", "isId ? 'Ada fakta yang bertentangan di penyimpanan memori asisten Anda. Harap selesaikan untuk mempertahankan akurasi eksekusi yang tinggi.' : 'There are conflicting facts in your assistant memory store. Please resolve to maintain high execution accuracy.'")
content = content.replace("'No duplicate facts, outdated contradictions, or conflicting parameters found.'", "isId ? 'Tidak ada fakta duplikat, kontradiksi yang sudah usang, atau parameter yang bertentangan yang ditemukan.' : 'No duplicate facts, outdated contradictions, or conflicting parameters found.'")
content = content.replace("REVIEW", "{isId ? 'TINJAU' : 'REVIEW'}")
content = content.replace("facts indexed", "{isId ? 'fakta terindeks' : 'facts indexed'}")

# Categories & Search
content = content.replace("placeholder=\"Search memory facts or keywords...\"", "placeholder={isId ? 'Cari fakta memori atau kata kunci...' : 'Search memory facts or keywords...'}")
content = content.replace("All Folders", "{isId ? 'Semua Folder' : 'All Folders'}")
content = content.replace("Memory Fact Content", "{isId ? 'Konten Fakta Memori' : 'Memory Fact Content'}")

with open('src/components/views/MemoryView.tsx', 'w') as f:
    f.write(content)
