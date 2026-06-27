import os

files = [
    "apps/web/src/app/(dashboard)/cities/page.tsx",
    "apps/web/src/app/(dashboard)/disaster/page.tsx",
    "apps/web/src/app/(dashboard)/decision-twin/page.tsx",
    "apps/web/src/app/(dashboard)/impact/page.tsx",
    "apps/web/src/app/(dashboard)/analytics/page.tsx",
    "apps/web/src/app/(dashboard)/reports/page.tsx",
    "apps/web/src/app/(dashboard)/simulation-results/page.tsx"
]

for f in files:
    with open(f, 'r') as file:
        content = file.read()

    if "import type { Map as MapboxMap } from 'mapbox-gl';" not in content:
        # replace import mapboxgl from 'mapbox-gl';
        content = content.replace("import dynamic from 'next/dynamic';\nimport mapboxgl from 'mapbox-gl';", "import type { Map as MapboxMap } from 'mapbox-gl';")
        content = content.replace("import mapboxgl from 'mapbox-gl';", "import type { Map as MapboxMap } from 'mapbox-gl';")
        content = content.replace("mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';", "")
        
        # replace useRef<mapboxgl.Map | null> with useRef<MapboxMap | null>
        content = content.replace("useRef<mapboxgl.Map | null>", "useRef<MapboxMap | null>")
        
        # fix component name
        import re
        match = re.search(r'function (\w+)Content\(\) {', content)
        if match:
            func_name = match.group(1)
            content = content.replace(f"function {func_name}Content() {{", f"export default function {func_name}() {{")
            # remove the default export dynamic at the bottom
            content = re.sub(r'export default dynamic\(\(\) => Promise\.resolve\(' + func_name + r'Content\), \{ ssr: false \}\);\s*', '', content)

        with open(f, 'w') as file:
            file.write(content)
        print(f"Refactored {f}")

