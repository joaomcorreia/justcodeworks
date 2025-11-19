#!/usr/bin/env python
"""
Restore authentication after temporarily disabling it.
This script will reverse all changes made by disable_authentication.py
"""
import os
import glob

def restore_auth_in_file(file_path):
    """Restore authentication in a specific view file"""
    if not os.path.exists(file_path):
        print(f"⚠️  File not found: {file_path}")
        return
    
    print(f"🔧 Restoring {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Reverse all the changes made by disable_authentication.py
    restorations = [
        # Restore permission classes
        ('permission_classes = [AllowAny]  # TEMP: Auth disabled', 'permission_classes = [IsAuthenticated]'),
        ('permission_classes = [AllowAny]  # TEMP: Auth disabled, original: [IsAuthenticated,', 'permission_classes = [IsAuthenticated,'),
        ('[AllowAny]  # TEMP: Auth disabled', '[IsAuthenticated]'),
        
        # Restore staff checks
        ('# TEMP: Auth disabled - if not self.request.user.is_staff:', 'if not self.request.user.is_staff:'),
        ('# TEMP: Auth disabled - if not request.user.is_staff:', 'if not request.user.is_staff:'),
        ('# TEMP: Auth disabled - if not user.is_staff:', 'if not user.is_staff:'),
        
        # Restore user authentication checks
        ('# TEMP: Auth disabled - if not request.user.is_authenticated:', 'if not request.user.is_authenticated:'),
        ('# TEMP: Auth disabled - if not self.request.user.is_authenticated:', 'if not self.request.user.is_authenticated:'),
        
        # Restore permission denied raises
        ('# TEMP: Auth disabled - raise PermissionDenied(', 'raise PermissionDenied('),
        
        # Restore user ownership checks
        ('# TEMP: Auth disabled - if request.user != ', 'if request.user != '),
        ('# TEMP: Auth disabled - if self.request.user != ', 'if self.request.user != '),
        
        # Restore error responses
        ('return Response({\'info\': \'AUTH DISABLED -', 'return Response({\'error\':'),
        
        # Restore get permissions method
        ('permission_classes = [AllowAny]  # TEMP: Auth disabled for all actions',
         '''if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]'''),
    ]
    
    changes_made = 0
    for old, new in restorations:
        if old in content:
            content = content.replace(old, new)
            changes_made += 1
    
    # Remove temporary imports
    lines = content.split('\n')
    filtered_lines = []
    for line in lines:
        if 'TEMP: Auth disabled' not in line:
            filtered_lines.append(line)
        else:
            changes_made += 1
    content = '\n'.join(filtered_lines)
    
    if changes_made > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Restored {changes_made} changes in {file_path}")
    else:
        print(f"ℹ️  No changes to restore in {file_path}")

def restore_from_backup():
    """Find and offer to restore from backup"""
    backup_dirs = glob.glob("auth_backup_*")
    if backup_dirs:
        latest_backup = max(backup_dirs)
        print(f"📁 Found backup directory: {latest_backup}")
        
        response = input("Do you want to restore from backup instead? (y/n): ").lower().strip()
        if response == 'y':
            import shutil
            backup_files = os.listdir(latest_backup)
            for backup_file in backup_files:
                if backup_file.endswith('.py'):
                    original_path = backup_file.replace('_', '/')
                    backup_path = os.path.join(latest_backup, backup_file)
                    if os.path.exists(original_path):
                        shutil.copy2(backup_path, original_path)
                        print(f"✅ Restored {original_path} from backup")
            return True
    return False

def main():
    print("🔐 RESTORING AUTHENTICATION")
    print("=" * 50)
    
    # Check for backups first
    if restore_from_backup():
        print("\n✅ AUTHENTICATION RESTORED FROM BACKUP")
        return
    
    # Files to process
    view_files = [
        "sites/views.py",
        "main_site/views.py", 
        "user_dashboard/views.py",
        "tenant_dashboards/views.py",
    ]
    
    # Restore auth in each file
    for file_path in view_files:
        restore_auth_in_file(file_path)
    
    print("\n✅ AUTHENTICATION RESTORED")
    print("\n🔍 Please review the changes and test thoroughly!")
    print("💡 Consider also updating Django settings if needed:")
    print("   - REST_FRAMEWORK['DEFAULT_PERMISSION_CLASSES']")
    print("   - REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES']")

if __name__ == "__main__":
    main()