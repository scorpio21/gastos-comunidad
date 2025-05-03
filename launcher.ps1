# Script para iniciar la aplicación de Gestión de Gastos
# Este script verifica si XAMPP está en ejecución, lo inicia si es necesario
# y luego abre la aplicación en el navegador predeterminado

# Cargar ensamblados para los cuadros de diálogo y la interfaz gráfica
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Configuración de la aplicación
$appTitle = "Gestión de Gastos"
$xamppUrl = "http://localhost/duplicados/gastos/"
$devUrl = $null # Se detectará automáticamente
$xamppControlPath = "D:\xampp\xampp-control.exe"
$apacheServiceName = "httpd"
$mysqlServiceName = "mysqld"

# Función para detectar el puerto de desarrollo de Vite
function Get-ViteDevPort {
    $projectPath = Split-Path -Parent $PSCommandPath
    
    # Buscar npm en las ubicaciones comunes
    $npmPaths = @(
        "C:\Program Files\nodejs\npm.cmd",
        "C:\Program Files (x86)\nodejs\npm.cmd",
        "$env:APPDATA\npm\npm.cmd"
    )
    
    $npmPath = $null
    foreach ($path in $npmPaths) {
        if (Test-Path $path) {
            $npmPath = $path
            break
        }
    }
    
    if (-not $npmPath) {
        Write-Host "No se pudo encontrar npm. Por favor, asegúrate de que Node.js está instalado correctamente." -ForegroundColor Red
        return $null
    }
    
    # Usar la ruta completa a npm
    $process = Start-Process -FilePath $npmPath -ArgumentList "run", "dev" -WorkingDirectory $projectPath -NoNewWindow -PassThru
    Start-Sleep -Seconds 3 # Esperar a que Vite inicie
    
    # Intentar encontrar la URL en la salida de la consola
    $logPath = Join-Path $env:TEMP "vite_output.log"
    Start-Process -FilePath $npmPath -ArgumentList "run", "dev" -WorkingDirectory $projectPath -NoNewWindow -RedirectStandardOutput $logPath
    Start-Sleep -Seconds 3
    
    $logContent = Get-Content $logPath -ErrorAction SilentlyContinue
    $urlPattern = "http://localhost:\d+/duplicados/gastos/"
    $match = $logContent | Select-String -Pattern $urlPattern -AllMatches | ForEach-Object { $_.Matches } | Select-Object -First 1
    
    if ($match) {
        return $match.Value
    } else {
        # URL por defecto si no se puede detectar
        return "http://localhost:5173/duplicados/gastos/"
    }
}

# Función para verificar si un proceso está en ejecución
function Test-ProcessRunning($processName) {
    $process = Get-Process -Name $processName -ErrorAction SilentlyContinue
    return $null -ne $process
}

# Función para crear una interfaz gráfica
function Show-SplashScreen {
    $form = New-Object System.Windows.Forms.Form
    $form.Text = $appTitle
    $form.Size = New-Object System.Drawing.Size(400, 300)
    $form.StartPosition = "CenterScreen"
    $form.FormBorderStyle = "FixedDialog"
    $form.MaximizeBox = $false
    $form.MinimizeBox = $false
    $form.BackColor = [System.Drawing.Color]::White

    # Título de la aplicación
    $titleLabel = New-Object System.Windows.Forms.Label
    $titleLabel.Text = $appTitle
    $titleLabel.Font = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)
    $titleLabel.AutoSize = $true
    $titleLabel.Location = New-Object System.Drawing.Point(20, 20)
    $form.Controls.Add($titleLabel)

    # Subtítulo
    $subtitleLabel = New-Object System.Windows.Forms.Label
    $subtitleLabel.Text = "Iniciando servicios necesarios..."
    $subtitleLabel.Font = New-Object System.Drawing.Font("Arial", 10)
    $subtitleLabel.AutoSize = $true
    $subtitleLabel.Location = New-Object System.Drawing.Point(20, 50)
    $form.Controls.Add($subtitleLabel)

    # Estado de Apache
    $apacheLabel = New-Object System.Windows.Forms.Label
    $apacheLabel.Text = "Apache: Verificando..."
    $apacheLabel.AutoSize = $true
    $apacheLabel.Location = New-Object System.Drawing.Point(20, 90)
    $form.Controls.Add($apacheLabel)

    # Estado de MySQL
    $mysqlLabel = New-Object System.Windows.Forms.Label
    $mysqlLabel.Text = "MySQL: Verificando..."
    $mysqlLabel.AutoSize = $true
    $mysqlLabel.Location = New-Object System.Drawing.Point(20, 110)
    $form.Controls.Add($mysqlLabel)

    # Botón para iniciar XAMPP manualmente
    $xamppButton = New-Object System.Windows.Forms.Button
    $xamppButton.Text = "Iniciar XAMPP"
    $xamppButton.Location = New-Object System.Drawing.Point(20, 150)
    $xamppButton.Size = New-Object System.Drawing.Size(120, 30)
    $xamppButton.Enabled = $false
    $xamppButton.Add_Click({
        Start-Process $xamppControlPath
        $statusLabel.Text = "XAMPP iniciado. Por favor, inicia Apache y MySQL manualmente."
    })
    $form.Controls.Add($xamppButton)

    # Botón para abrir la aplicación en modo XAMPP
    $xamppModeButton = New-Object System.Windows.Forms.Button
    $xamppModeButton.Text = "Modo XAMPP"
    $xamppModeButton.Location = New-Object System.Drawing.Point(20, 150)
    $xamppModeButton.Size = New-Object System.Drawing.Size(120, 30)
    $xamppModeButton.Enabled = $false
    $xamppModeButton.Add_Click({
        Start-Process $xamppUrl
        $form.Close()
    })
    $form.Controls.Add($xamppModeButton)

    # Botón para abrir la aplicación en modo desarrollo
    $devModeButton = New-Object System.Windows.Forms.Button
    $devModeButton.Text = "Modo Desarrollo"
    $devModeButton.Location = New-Object System.Drawing.Point(150, 150)
    $devModeButton.Size = New-Object System.Drawing.Size(120, 30)
    $devModeButton.Add_Click({
        $statusLabel.Text = "Iniciando servidor de desarrollo..."
        $devModeButton.Enabled = $false
        
        # Buscar npm en las ubicaciones comunes
        $npmPaths = @(
            "C:\Program Files\nodejs\npm.cmd",
            "C:\Program Files (x86)\nodejs\npm.cmd",
            "$env:APPDATA\npm\npm.cmd"
        )
        
        $npmPath = $null
        foreach ($path in $npmPaths) {
            if (Test-Path $path) {
                $npmPath = $path
                break
            }
        }
        
        if (-not $npmPath) {
            $statusLabel.Text = "Error: No se pudo encontrar npm. Asegúrate de que Node.js está instalado."
            $devModeButton.Enabled = $true
            return
        }
        
        # Intentar primero con el servidor PHP en el puerto 8080
        $phpUrl = "http://localhost:8080"
        Start-Process $phpUrl
        $form.Close()
    })
    $form.Controls.Add($devModeButton)

    # Botón para salir
    $exitButton = New-Object System.Windows.Forms.Button
    $exitButton.Text = "Salir"
    $exitButton.Location = New-Object System.Drawing.Point(280, 150)
    $exitButton.Size = New-Object System.Drawing.Size(80, 30)
    $exitButton.Add_Click({
        $form.Close()
    })
    $form.Controls.Add($exitButton)

    # Etiqueta de estado
    $statusLabel = New-Object System.Windows.Forms.Label
    $statusLabel.Text = "Verificando servicios..."
    $statusLabel.AutoSize = $true
    $statusLabel.Location = New-Object System.Drawing.Point(20, 200)
    $statusLabel.Size = New-Object System.Drawing.Size(360, 40)
    $form.Controls.Add($statusLabel)

    # Iniciar la verificación de servicios en segundo plano
    $timer = New-Object System.Windows.Forms.Timer
    $timer.Interval = 1000
    $timer.Add_Tick({
        # Verificar Apache
        $apacheRunning = Test-ProcessRunning -processName $apacheServiceName
        $apacheLabel.Text = "Apache: " + $(if ($apacheRunning) { "En ejecución" } else { "Detenido" })
        $apacheLabel.ForeColor = $(if ($apacheRunning) { [System.Drawing.Color]::Green } else { [System.Drawing.Color]::Red })

        # Verificar MySQL
        $mysqlRunning = Test-ProcessRunning -processName $mysqlServiceName
        $mysqlLabel.Text = "MySQL: " + $(if ($mysqlRunning) { "En ejecución" } else { "Detenido" })
        $mysqlLabel.ForeColor = $(if ($mysqlRunning) { [System.Drawing.Color]::Green } else { [System.Drawing.Color]::Red })

        # Actualizar estado y botones
        if ($apacheRunning -and $mysqlRunning) {
            $statusLabel.Text = "Todos los servicios están en ejecución. Puedes iniciar la aplicación en modo XAMPP o desarrollo."
            $xamppModeButton.Enabled = $true
            $xamppButton.Enabled = $false
        } else {
            $statusLabel.Text = "Algunos servicios no están en ejecución. Inicia XAMPP y activa los servicios para el modo XAMPP."
            $xamppModeButton.Enabled = $false
            $xamppButton.Enabled = $true
        }
    })
    $timer.Start()

    # Mostrar el formulario
    $form.ShowDialog()
    $timer.Stop()
}

# Verificar si XAMPP está instalado
if (-not (Test-Path $xamppControlPath)) {
    [System.Windows.Forms.MessageBox]::Show(
        "No se pudo encontrar XAMPP en la ruta: $xamppControlPath`nPor favor, asegúrate de que XAMPP esté instalado correctamente.",
        "Error",
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Error
    )
    exit
}

# Mostrar la interfaz gráfica
Show-SplashScreen
