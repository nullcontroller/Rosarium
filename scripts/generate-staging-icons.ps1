# Recolour the existing delivered icons without resizing or changing alpha.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskPalettePath = Join-Path $taskRoot 'brand/staging-palette.json'
$taskPalette = Get-Content -LiteralPath $taskPalettePath -Raw | ConvertFrom-Json
$taskTarget = Join-Path $taskRoot 'brand/staging'
New-Item -ItemType Directory -Force -Path $taskTarget | Out-Null
# Resolve drawing dependencies from the installed PowerShell runtime (.NET 8/10
# have different internal assembly splits); no private assembly names to pin.
$taskReferences = @{}
$taskAssemblies = [Collections.Generic.Queue[Reflection.Assembly]]::new()
$taskAssemblies.Enqueue([Drawing.Bitmap].Assembly)
$taskAssemblies.Enqueue([Drawing.Color].Assembly)
while ($taskAssemblies.Count) {
  $taskAssembly = $taskAssemblies.Dequeue()
  if ($taskReferences.ContainsKey($taskAssembly.Location)) { continue }
  $taskReferences[$taskAssembly.Location] = $true
  foreach ($taskReference in $taskAssembly.GetReferencedAssemblies()) {
    if ($taskReference.Name -match '^System\.(Drawing|Private\.Windows)') {
      $taskAssemblies.Enqueue([Reflection.Assembly]::Load($taskReference))
    }
  }
}
Add-Type -ReferencedAssemblies @($taskReferences.Keys) -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
public static class RosariumStagingPalette {
  static double Y(Color c) { return .2126*c.R + .7152*c.G + .0722*c.B; }
  public static void Recolour(string input, string output, string[] oldHex, string[] newHex) {
    var oldColours = Array.ConvertAll(oldHex, ColorTranslator.FromHtml);
    var newColours = Array.ConvertAll(newHex, ColorTranslator.FromHtml);
    using (var source = new Bitmap(input))
    using (var target = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb)) {
      for (int y=0;y<source.Height;y++) for (int x=0;x<source.Width;x++) {
        var c = source.GetPixel(x,y); var luminance = Y(c); int i=0;
        while (i<oldColours.Length-2 && luminance>Y(oldColours[i+1])) i++;
        var t = Math.Max(0,Math.Min(1,(luminance-Y(oldColours[i]))/(Y(oldColours[i+1])-Y(oldColours[i]))));
        var a = newColours[i]; var b = newColours[i+1];
        target.SetPixel(x,y,Color.FromArgb(c.A,
          (int)Math.Round(a.R+(b.R-a.R)*t), (int)Math.Round(a.G+(b.G-a.G)*t), (int)Math.Round(a.B+(b.B-a.B)*t)));
      }
      target.Save(output,ImageFormat.Png);
    }
  }
}
'@
$taskOld = [string[]]@($taskPalette.anchors | ForEach-Object { $_[0] })
$taskNew = [string[]]@($taskPalette.anchors | ForEach-Object { $_[1] })
$taskProvenance = [ordered]@{ palette = 'brand/staging-palette.json'; files = @() }
foreach ($taskName in @('icon-192.png','icon-512.png','icon-maskable-192.png','icon-maskable-512.png','apple-touch-icon.png','favicon-32x32.png')) {
  $taskInput = Join-Path $taskRoot "public/icons/$taskName"
  $taskOutput = Join-Path $taskTarget $taskName
  [RosariumStagingPalette]::Recolour($taskInput,$taskOutput,$taskOld,$taskNew)
  $taskProvenance.files += [ordered]@{ source = "public/icons/$taskName"; sha256 = (Get-FileHash -LiteralPath $taskInput -Algorithm SHA256).Hash.ToLowerInvariant(); output = "brand/staging/$taskName"; outputSha256 = (Get-FileHash -LiteralPath $taskOutput -Algorithm SHA256).Hash.ToLowerInvariant() }
}
$taskSvg = [IO.File]::ReadAllText((Join-Path $taskRoot 'public/favicon.svg')).Replace("`r`n","`n")
$taskSvgSourceHash = [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($taskSvg))).ToLowerInvariant()
foreach ($taskPair in $taskPalette.svg.PSObject.Properties) { $taskSvg = $taskSvg.Replace($taskPair.Name, $taskPair.Value) }
[IO.File]::WriteAllText((Join-Path $taskTarget 'favicon.svg'),$taskSvg)
$taskProvenance.files += [ordered]@{ source = 'public/favicon.svg'; sourceLineEndings = 'LF'; sha256 = $taskSvgSourceHash; output = 'brand/staging/favicon.svg'; outputSha256 = (Get-FileHash -LiteralPath (Join-Path $taskTarget 'favicon.svg') -Algorithm SHA256).Hash.ToLowerInvariant() }
[IO.File]::WriteAllText((Join-Path $taskRoot 'brand/staging-generation.json'),($taskProvenance | ConvertTo-Json -Depth 6) + "`n")
Write-Output 'Generated staging-only palette variants; production assets untouched.'
