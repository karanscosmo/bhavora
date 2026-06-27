import os
import re

files = [
    "apps/web/src/app/(dashboard)/cities/page.tsx",
    "apps/web/src/app/(dashboard)/disaster/page.tsx",
    "apps/web/src/app/(dashboard)/decision-twin/page.tsx",
    "apps/web/src/app/(dashboard)/impact/page.tsx",
    "apps/web/src/app/(dashboard)/analytics/page.tsx",
    "apps/web/src/app/(dashboard)/reports/page.tsx",
    "apps/web/src/app/(dashboard)/simulation-results/page.tsx",
]

for f in files:
    with open(f, 'r') as fh:
        content = fh.read()
    
    # Fix: container: mapContainer.current, -> container: mapContainer.current!,
    content = content.replace("container: mapContainer.current,", "container: mapContainer.current!,")
    
    # Fix type inference - useRef<HTMLDivElement> should be useRef<HTMLDivElement | null>(null)
    # Also, since we already guard with `if (!mapContainer.current) return;`, we can also use `!` assertion
    
    with open(f, 'w') as fh:
        fh.write(content)

print("Fixed null assertions")
