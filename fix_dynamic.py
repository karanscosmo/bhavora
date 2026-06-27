import os
import re

files = [
    "apps/web/src/app/(dashboard)/analytics/page.tsx",
    "apps/web/src/app/(dashboard)/impact/page.tsx",
    "apps/web/src/app/(dashboard)/reports/page.tsx",
    "apps/web/src/app/(dashboard)/simulation-results/page.tsx",
]

for f in files:
    with open(f, 'r') as file:
        content = file.read()

    # Fix the useEffect that uses `mapboxgl.Map`
    # Pattern: `const map = new mapboxgl.Map({`
    # Replace: wrap the ENTIRE useEffect body with import() if not already done
    
    # Check if dynamic import already exists
    if "import('mapbox-gl')" in content:
        print(f"Already has dynamic import: {f}")
        continue
    
    # Replace: const map = new mapboxgl.Map({
    # With dynamic import wrapper
    # First find the useEffect that creates the map
    
    old_pattern = "    if (!mapContainer.current) return;\n    const map = new mapboxgl.Map({"
    new_pattern = "    if (!mapContainer.current) return;\n    let isActive = true;\n    import('mapbox-gl').then(m => {\n      if (!isActive || !mapContainer.current) return;\n      const mapboxgl = m.default;\n      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';\n      const map = new mapboxgl.Map({"
    
    if old_pattern in content:
        content = content.replace(old_pattern, new_pattern)
        
        # Find and wrap the return statement
        old_return = "    return () => map?.remove();\n  }, []);"
        new_return = "    });\n\n    return () => { isActive = false; map?.remove(); };\n  }, []);"
        
        # Also try variant without ?.
        old_return2 = "    return () => map.remove();\n  }, []);"
        new_return2 = "    });\n\n    return () => { isActive = false; try { map.remove(); } catch(e) {} };\n  }, []);"
        
        content = content.replace(old_return, new_return)
        content = content.replace(old_return2, new_return2)
        
        with open(f, 'w') as file:
            file.write(content)
        print(f"Fixed: {f}")
    else:
        print(f"Pattern not found: {f}")
        print("  Looking for: " + repr(old_pattern[:80]))
        # Show what's there
        idx = content.find("new mapboxgl.Map({")
        if idx >= 0:
            print("  Found at idx: " + repr(content[max(0,idx-100):idx+40]))
