@echo off
REM ===================================================
REM  VERITAS CONTRACT VERIFIER (Sourcify Direct API)
REM  Bypasses broken Blockscout SSL by using Sourcify
REM ===================================================

echo.
echo ======================================
echo  VERITAS SOURCIFY VERIFIER
echo ======================================
echo.

set CHAIN_ID=127823
set COMPILER=v0.8.24+commit.e11b9ed9

REM --- VeritasToken ---
echo [1/5] Verifying VeritasToken...
curl -X POST "https://sourcify.dev/server/verify/solc-json" ^
  -F "address=0x4080ACE95cf319c40F952D2dCCE21b070270f14d" ^
  -F "chain=%CHAIN_ID%" ^
  -F "files=@contracts/VeritasToken.flat.sol"

echo.

REM --- VeritasTimelock ---
echo [2/5] Verifying VeritasTimelock...
curl -X POST "https://sourcify.dev/server/verify/solc-json" ^
  -F "address=0xb38c87D42AA5fbF778e1093c61D5e4a010996EB0" ^
  -F "chain=%CHAIN_ID%" ^
  -F "files=@contracts/VeritasTimelock.sol"

echo.

REM --- VeritasGovernor ---
echo [3/5] Verifying VeritasGovernor...
curl -X POST "https://sourcify.dev/server/verify/solc-json" ^
  -F "address=0x8fA50988f36af835de40153E871689148aE54E49" ^
  -F "chain=%CHAIN_ID%" ^
  -F "files=@contracts/VeritasGovernor.flat.sol"

echo.

REM --- PolicyRegistry ---
echo [4/5] Verifying PolicyRegistry...
curl -X POST "https://sourcify.dev/server/verify/solc-json" ^
  -F "address=0x3dAC8B24ee19c807eB9B1932AD789E3D03C1091D" ^
  -F "chain=%CHAIN_ID%" ^
  -F "files=@contracts/PolicyRegistry.sol"

echo.

REM --- VeritasVault ---
echo [5/5] Verifying VeritasVault...
curl -X POST "https://sourcify.dev/server/verify/solc-json" ^
  -F "address=0x7d614118529243DDc5C7ad19F4b89220634d1Ba0" ^
  -F "chain=%CHAIN_ID%" ^
  -F "files=@contracts/VeritasVault.sol"

echo.
echo ======================================
echo  DONE! Check https://repo.sourcify.dev
echo ======================================
