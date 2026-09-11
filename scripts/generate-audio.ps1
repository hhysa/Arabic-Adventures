$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$audioRoot = Join-Path $PSScriptRoot '../assets/audio'
$words = Get-Content -LiteralPath (Join-Path $audioRoot 'words.json') -Raw -Encoding utf8 | ConvertFrom-Json
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
    $speaker.SelectVoice('Microsoft Naayf')
    $speaker.Rate = -2
    foreach ($word in $words.PSObject.Properties) {
        $destination = Join-Path $audioRoot ($word.Name + '.wav')
        if ((Test-Path -LiteralPath $destination) -and (Get-Item -LiteralPath $destination).Length -gt 1000) { continue }
        $speaker.SetOutputToWaveFile($destination)
        $speaker.Speak([string]$word.Value)
        $speaker.SetOutputToNull()
        Write-Output $word.Name
    }
} finally { $speaker.Dispose() }
