# Run from repo root after installing Power Platform CLI and Node.js.
# This script builds the PCF control. For a full solution project, create one with:
#   pac solution init --publisher-name SageKim --publisher-prefix sage
#   pac solution add-reference --path .\AgentInTheAppControl
#   dotnet build

npm install
npm run build

Write-Host "PCF build complete. To package as a solution, use pac solution init/add-reference or import through your existing solution project."
