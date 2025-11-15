@echo off
cd /d C:\projects\justcodeworks\backend
call .venv\Scripts\activate.bat
python manage.py runserver 8000
pause