@echo off
title Jose Ashmitha - QA Portfolio Live Sharer
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0share-portfolio.ps1"
pause
