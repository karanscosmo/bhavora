import os
import re

# These files have a broken .then() block where the return and `}, [deps])` are inside the .then()
# We need to:
# 1. Close the .then() block BEFORE the return statement
# 2. Keep the return outside .then()

files = {
    "apps/web/src/app/(dashboard)/impact/page.tsx": "economics",
    "apps/web/src/app/(dashboard)/reports/page.tsx": None,
    "apps/web/src/app/(dashboard)/simulation-results/page.tsx": None,
}

for f, dep in files.items():
    with open(f, 'r') as fh:
        content = fh.read()
    
    # Find the pattern: `return () => map.remove();\n  }, [something]);`
    # and add `});` before the `return`
    
    # Check if the pattern has already been fixed (i.e., `});` is before `return`)
    if "    });\n\n    return () => { isActive = false; mapInstance?.remove(); }" in content:
        print(f"Already fixed: {f}")
        continue
    
    # Replace the broken pattern - where return is inside .then()
    # Pattern: `\n    return () => map.remove();\n  }, [dep]);`
    # Should be: `\n    });\n\n    return () => { isActive = false; mapInstance?.remove(); };\n  }, [dep]);`

    # First, add `mapInstance = map;` after the map creation line
    content = re.sub(
        r'(const map = new mapboxgl\.Map\(\{[^}]*\}\);)',
        r'\1\n      mapInstance = map;',
        content
    )
    
    # Add let mapInstance = null after `let isActive = true;`
    content = content.replace(
        "    let isActive = true;\n    import('mapbox-gl')",
        "    let mapInstance: any = null;\n    let isActive = true;\n    import('mapbox-gl')"
    )
    
    # Fix the broken structure: return inside .then()
    content = re.sub(
        r'\n    return \(\) => map\.remove\(\);\n  }, \[([^\]]*)\]\);',
        lambda m: f"\n    }});\n\n    return () => {{ isActive = false; mapInstance?.remove(); }};\n  }}, [{m.group(1)}]);",
        content
    )
    
    with open(f, 'w') as fh:
        fh.write(content)
    print(f"Fixed: {f}")

