Add-Type -AssemblyName System.Drawing

$assetDir = Join-Path $PSScriptRoot "..\assets"
New-Item -ItemType Directory -Force $assetDir | Out-Null

function ColorFromHex {
    param([string]$Hex)
    return [System.Drawing.ColorTranslator]::FromHtml($Hex)
}

function Brush {
    param([string]$Hex)
    return [System.Drawing.SolidBrush]::new((ColorFromHex $Hex))
}

function Pen {
    param([string]$Hex, [float]$Width = 1)
    return [System.Drawing.Pen]::new((ColorFromHex $Hex), $Width)
}

function New-RoundPath {
    param([float]$X, [float]$Y, [float]$W, [float]$H, [float]$R)
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $d = $R * 2
    $path.AddArc($X, $Y, $d, $d, 180, 90)
    $path.AddArc($X + $W - $d, $Y, $d, $d, 270, 90)
    $path.AddArc($X + $W - $d, $Y + $H - $d, $d, $d, 0, 90)
    $path.AddArc($X, $Y + $H - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

function Fill-RoundRect {
    param($Graphics, [string]$Fill, [float]$X, [float]$Y, [float]$W, [float]$H, [float]$R)
    $path = New-RoundPath $X $Y $W $H $R
    $brush = Brush $Fill
    $Graphics.FillPath($brush, $path)
    $brush.Dispose()
    $path.Dispose()
}

function Stroke-RoundRect {
    param($Graphics, [string]$Stroke, [float]$Width, [float]$X, [float]$Y, [float]$W, [float]$H, [float]$R)
    $path = New-RoundPath $X $Y $W $H $R
    $pen = Pen $Stroke $Width
    $Graphics.DrawPath($pen, $path)
    $pen.Dispose()
    $path.Dispose()
}

function Fill-Ellipse {
    param($Graphics, [string]$Fill, [float]$X, [float]$Y, [float]$W, [float]$H)
    $brush = Brush $Fill
    $Graphics.FillEllipse($brush, $X, $Y, $W, $H)
    $brush.Dispose()
}

function Stroke-Ellipse {
    param($Graphics, [string]$Stroke, [float]$Width, [float]$X, [float]$Y, [float]$W, [float]$H)
    $pen = Pen $Stroke $Width
    $Graphics.DrawEllipse($pen, $X, $Y, $W, $H)
    $pen.Dispose()
}

function Fill-Rect {
    param($Graphics, [string]$Fill, [float]$X, [float]$Y, [float]$W, [float]$H)
    $brush = Brush $Fill
    $Graphics.FillRectangle($brush, $X, $Y, $W, $H)
    $brush.Dispose()
}

function Fill-Polygon {
    param($Graphics, [string]$Fill, [System.Drawing.PointF[]]$Points)
    $brush = Brush $Fill
    $Graphics.FillPolygon($brush, $Points)
    $brush.Dispose()
}

function Save-Canvas {
    param([string]$Name, [int]$Width, [int]$Height, [scriptblock]$Draw)
    $bitmap = [System.Drawing.Bitmap]::new($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    & $Draw $graphics $Width $Height
    $path = Join-Path $assetDir $Name
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

function Draw-Bowl {
    param($Graphics, [float]$Cx, [float]$Cy, [float]$Scale, [string]$Bowl, [string]$Food)
    Fill-Ellipse $Graphics "#1d2528" ($Cx - 130 * $Scale) ($Cy - 16 * $Scale) (260 * $Scale) (54 * $Scale)
    Fill-Ellipse $Graphics "#ffffff" ($Cx - 116 * $Scale) ($Cy - 44 * $Scale) (232 * $Scale) (88 * $Scale)
    Fill-Ellipse $Graphics $Food ($Cx - 96 * $Scale) ($Cy - 30 * $Scale) (192 * $Scale) (58 * $Scale)
    Fill-RoundRect $Graphics $Bowl ($Cx - 116 * $Scale) ($Cy - 8 * $Scale) (232 * $Scale) (96 * $Scale) (42 * $Scale)
    Fill-Ellipse $Graphics "#ffffff" ($Cx - 88 * $Scale) ($Cy + 52 * $Scale) (176 * $Scale) (34 * $Scale)
    Stroke-Ellipse $Graphics "#223036" (8 * $Scale) ($Cx - 116 * $Scale) ($Cy - 44 * $Scale) (232 * $Scale) (88 * $Scale)
    Fill-Ellipse $Graphics "#2d8f6f" ($Cx - 54 * $Scale) ($Cy - 34 * $Scale) (30 * $Scale) (22 * $Scale)
    Fill-Ellipse $Graphics "#f2c14e" ($Cx + 20 * $Scale) ($Cy - 36 * $Scale) (34 * $Scale) (24 * $Scale)
    Fill-Ellipse $Graphics "#d94b38" ($Cx + 52 * $Scale) ($Cy - 16 * $Scale) (24 * $Scale) (20 * $Scale)
}

function Draw-Burger {
    param($Graphics, [float]$Cx, [float]$Cy, [float]$Scale)
    Fill-Ellipse $Graphics "#f2c14e" ($Cx - 128 * $Scale) ($Cy - 88 * $Scale) (256 * $Scale) (108 * $Scale)
    Fill-RoundRect $Graphics "#fff8e4" ($Cx - 126 * $Scale) ($Cy - 18 * $Scale) (252 * $Scale) (28 * $Scale) (10 * $Scale)
    Fill-RoundRect $Graphics "#2d8f6f" ($Cx - 122 * $Scale) ($Cy + 5 * $Scale) (244 * $Scale) (34 * $Scale) (12 * $Scale)
    Fill-RoundRect $Graphics "#863f2c" ($Cx - 114 * $Scale) ($Cy + 32 * $Scale) (228 * $Scale) (36 * $Scale) (12 * $Scale)
    Fill-RoundRect $Graphics "#f7b733" ($Cx - 112 * $Scale) ($Cy + 58 * $Scale) (224 * $Scale) (28 * $Scale) (8 * $Scale)
    Fill-Ellipse $Graphics "#e9a423" ($Cx - 116 * $Scale) ($Cy + 66 * $Scale) (232 * $Scale) (52 * $Scale)
    Fill-Ellipse $Graphics "#fff8e4" ($Cx - 72 * $Scale) ($Cy - 62 * $Scale) (14 * $Scale) (8 * $Scale)
    Fill-Ellipse $Graphics "#fff8e4" ($Cx + 18 * $Scale) ($Cy - 72 * $Scale) (14 * $Scale) (8 * $Scale)
    Fill-Ellipse $Graphics "#fff8e4" ($Cx + 74 * $Scale) ($Cy - 48 * $Scale) (14 * $Scale) (8 * $Scale)
}

function Draw-Sushi {
    param($Graphics, [float]$Cx, [float]$Cy, [float]$Scale)
    for ($i = 0; $i -lt 3; $i++) {
        $x = $Cx + (($i - 1) * 95 * $Scale)
        Fill-RoundRect $Graphics "#223036" ($x - 42 * $Scale) ($Cy - 58 * $Scale) (84 * $Scale) (116 * $Scale) (22 * $Scale)
        Fill-RoundRect $Graphics "#ffffff" ($x - 30 * $Scale) ($Cy - 42 * $Scale) (60 * $Scale) (84 * $Scale) (16 * $Scale)
        Fill-Ellipse $Graphics "#d94b38" ($x - 18 * $Scale) ($Cy - 20 * $Scale) (36 * $Scale) (40 * $Scale)
        Fill-Ellipse $Graphics "#2d8f6f" ($x - 8 * $Scale) ($Cy - 8 * $Scale) (16 * $Scale) (18 * $Scale)
    }
}

function Draw-Drink {
    param($Graphics, [float]$Cx, [float]$Cy, [float]$Scale)
    Fill-RoundRect $Graphics "#ffffff" ($Cx - 62 * $Scale) ($Cy - 106 * $Scale) (124 * $Scale) (196 * $Scale) (18 * $Scale)
    Fill-RoundRect $Graphics "#2f6fbd" ($Cx - 54 * $Scale) ($Cy - 62 * $Scale) (108 * $Scale) (138 * $Scale) (16 * $Scale)
    Fill-Ellipse $Graphics "#a7d8ff" ($Cx - 42 * $Scale) ($Cy - 48 * $Scale) (84 * $Scale) (22 * $Scale)
    $pen = Pen "#223036" (7 * $Scale)
    $Graphics.DrawLine($pen, $Cx + 18 * $Scale, $Cy - 114 * $Scale, $Cx + 78 * $Scale, $Cy - 166 * $Scale)
    $pen.Dispose()
    Fill-RoundRect $Graphics "#223036" ($Cx - 72 * $Scale) ($Cy - 126 * $Scale) (144 * $Scale) (22 * $Scale) (8 * $Scale)
}

Save-Canvas "hero-feast.png" 1600 900 {
    param($g, $w, $h)
    Fill-Rect $g "#f7f8f4" 0 0 $w $h
    Fill-RoundRect $g "#e8f5eb" 76 86 1448 728 56
    Fill-RoundRect $g "#2d8f6f" 1076 112 300 500 36
    Fill-RoundRect $g "#223036" 1118 146 216 46 16
    Fill-RoundRect $g "#f2c14e" 1035 534 384 202 38
    Fill-RoundRect $g "#ffffff" 1040 520 374 52 24
    Draw-Bowl $g 660 420 1.45 "#d94b38" "#f4d26a"
    Draw-Bowl $g 1050 444 0.96 "#2f6fbd" "#c9e6d2"
    Draw-Burger $g 900 630 0.74
    Draw-Sushi $g 435 650 0.82
    Draw-Drink $g 1235 628 0.78
    $pen = Pen "#223036" 16
    $g.DrawLine($pen, 420, 275, 740, 162)
    $g.DrawLine($pen, 452, 330, 780, 222)
    $pen.Dispose()
    Fill-Ellipse $g "#d94b38" 246 242 58 58
    Fill-Ellipse $g "#2f6fbd" 1354 258 48 48
    Fill-Ellipse $g "#f2c14e" 296 744 72 72
    Fill-Ellipse $g "#ffffff" 1350 676 112 112
    Stroke-Ellipse $g "#223036" 10 1350 676 112 112
}

$dishes = @(
    @{Name="dish-noodles.png"; Bg="#fff3df"; Accent="#d94b38"; Kind="bowl"},
    @{Name="dish-poke.png"; Bg="#e8f5eb"; Accent="#2d8f6f"; Kind="bowl"},
    @{Name="dish-burger.png"; Bg="#f8edd3"; Accent="#f2c14e"; Kind="burger"},
    @{Name="dish-sushi.png"; Bg="#e7f0ff"; Accent="#2f6fbd"; Kind="sushi"},
    @{Name="dish-coffee.png"; Bg="#f5efe9"; Accent="#7f5539"; Kind="drink"},
    @{Name="dish-hotpot.png"; Bg="#fff0ee"; Accent="#d94b38"; Kind="hotpot"}
)

foreach ($dish in $dishes) {
    Save-Canvas $dish.Name 900 620 {
        param($g, $w, $h)
        Fill-Rect $g $dish.Bg 0 0 $w $h
        Fill-RoundRect $g "#ffffff" 102 76 696 458 42
        Fill-Ellipse $g $dish.Accent 92 64 96 96
        Fill-Ellipse $g "#223036" 730 470 72 72
        if ($dish.Kind -eq "burger") {
            Draw-Burger $g 450 310 1.12
        } elseif ($dish.Kind -eq "sushi") {
            Draw-Sushi $g 450 310 1.35
        } elseif ($dish.Kind -eq "drink") {
            Draw-Drink $g 445 322 1.22
        } elseif ($dish.Kind -eq "hotpot") {
            Draw-Bowl $g 450 292 1.22 "#d94b38" "#e9704f"
            Fill-Ellipse $g "#ffffff" 360 228 54 40
            Fill-Ellipse $g "#f2c14e" 436 218 66 46
            Fill-Ellipse $g "#2d8f6f" 502 232 54 40
        } else {
            Draw-Bowl $g 450 296 1.32 $dish.Accent "#f4d26a"
        }
        Stroke-RoundRect $g "#223036" 8 102 76 696 458 42
    }
}
