$Folder = 'dist'

if (Test-Path -Path $Folder) {
    rmdir -r dist
}