Add-Type -AssemblyName System.Drawing

function Create-AppIcon($sourcePath, $outPath, $size) {
    $src = [System.Drawing.Image]::FromFile($sourcePath)
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Fondo blanco limpio con esquinas redondeadas o completo
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 247, 251, 254))
    $g.FillRectangle($brush, 0, 0, $size, $size)
    
    # Marco sutil
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(80, 88, 169, 224)), 2
    $g.DrawRectangle($pen, 1, 1, ($size - 2), ($size - 2))
    
    # Calcular escala para que el logo de la ovejita y marca quede centrado con margen elegante
    $targetSize = [int]($size * 0.84)
    $scale = [Math]::Min($targetSize / $src.Width, $targetSize / $src.Height)
    $destW = [int]($src.Width * $scale)
    $destH = [int]($src.Height * $scale)
    $destX = [int](($size - $destW) / 2)
    $destY = [int](($size - $destH) / 2)
    
    $g.DrawImage($src, $destX, $destY, $destW, $destH)
    
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    $src.Dispose()
}

$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Create-AppIcon "$dir\logo_jesi.jpg" "$dir\icon-192.png" 192
Create-AppIcon "$dir\logo_jesi.jpg" "$dir\icon-512.png" 512
Write-Host "Iconos generados exitosamente: icon-192.png y icon-512.png"
