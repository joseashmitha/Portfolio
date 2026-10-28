@echo off
title Deploy Portfolio to GitHub Pages
cd /d "%~dp0"
echo ======================================================================
echo          DEPLOYING JOSE ASHMITHA QA PORTFOLIO TO GITHUB PAGES
echo ======================================================================
echo.
echo Staging and committing any recent edits...
git add .
git commit -m "Update portfolio assets and links" --quiet
echo.
echo Pushing branch 'main' to https://github.com/joseashmitha/portfolio.git ...
git push -u origin main
echo.
echo ======================================================================
echo If pushed successfully:
echo  1. Open: https://github.com/joseashmitha/portfolio/settings/pages
echo  2. Under 'Build and deployment', set Branch: 'main' and '/ (root)'
echo  3. Click 'Save'!
echo.
echo  Your portfolio will be live 24/7 for anyone worldwide at:
echo  https://joseashmitha.github.io/portfolio/
echo ======================================================================
pause

