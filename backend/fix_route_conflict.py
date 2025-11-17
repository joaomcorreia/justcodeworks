#!/usr/bin/env python3
"""
Script to fix Next.js routing conflict by removing duplicate [key] directory
"""

import os
import shutil
from pathlib import Path

def main():
    # Path to the conflicting directory
    conflicting_dir = Path(r"C:\projects\justcodeworks\frontend\src\app\[locale]\admin\templates\[key]")
    
    print(f"🔍 Checking for conflicting directory: {conflicting_dir}")
    
    if conflicting_dir.exists():
        print(f"✅ Found conflicting directory")
        
        # Backup the content first
        backup_dir = Path(r"C:\projects\justcodeworks\backend\backup_key_route")
        if not backup_dir.exists():
            backup_dir.mkdir(parents=True)
        
        print(f"📦 Creating backup in: {backup_dir}")
        shutil.copytree(conflicting_dir, backup_dir / "key_route_backup", dirs_exist_ok=True)
        
        # Remove the conflicting directory
        print(f"🗑️  Removing conflicting directory...")
        try:
            shutil.rmtree(conflicting_dir)
            print(f"✅ Successfully removed {conflicting_dir}")
        except Exception as e:
            print(f"❌ Error removing directory: {e}")
            return False
            
        # Verify removal
        if not conflicting_dir.exists():
            print(f"✅ Confirmed: Directory no longer exists")
            return True
        else:
            print(f"❌ Directory still exists after removal attempt")
            return False
    else:
        print(f"✅ No conflicting directory found")
        return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\n🎯 Route conflict resolution complete!")
        print("Next step: Start frontend with 'npm run dev' from frontend directory")
    else:
        print("\n❌ Route conflict resolution failed!")