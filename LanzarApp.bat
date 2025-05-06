@echo off
REM === Lanzador de Gestión de Gastos ===
title Lanzando Gestión de Gastos
cd /d "%~dp0"

REM --- Ejecutar el script gráfico principal ---
powershell -ExecutionPolicy Bypass -File "%~dp0launcher.ps1"
