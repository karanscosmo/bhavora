import os
import re

files = [
    "apps/web/src/app/(dashboard)/impact/page.tsx",
    "apps/web/src/app/(dashboard)/analytics/page.tsx",
    "apps/web/src/app/(dashboard)/reports/page.tsx",
    "apps/web/src/app/(dashboard)/simulation-results/page.tsx"
]

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # 1. replace import mapboxgl
    if "import dynamic from 'next/dynamic';" not in content:
        content = content.replace("import mapboxgl from 'mapbox-gl';", "import dynamic from 'next/dynamic';\nimport mapboxgl from 'mapbox-gl';")
    
    # 2. replace export default function X()
    match = re.search(r'export default function (\w+)\(\)', content)
    if match:
        func_name = match.group(1)
        content = content.replace(f"export default function {func_name}()", f"function {func_name}Content()")
        content += f"\nexport default dynamic(() => Promise.resolve({func_name}Content), {{ ssr: false }});\n"
        
        with open(f, 'w') as file:
            file.write(content)
        print(f"Fixed {f}")
