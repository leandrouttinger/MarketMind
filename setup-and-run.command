#!/bin/bash
echo "=== MarketMind Setup ==="

eval "$(/opt/homebrew/bin/brew shellenv)" 2>/dev/null
eval "$(/usr/local/bin/brew shellenv)" 2>/dev/null

cd "/Users/leandro/First Step to 1 Mio/MarketMind"

echo "Cleaning old iOS folder..."
rm -rf ios

echo "Running prebuild..."
npx expo prebuild --platform ios --clean

echo "Installing pods..."
cd ios && pod install --repo-update && cd ..

echo "Starting app on Simulator..."
npx expo run:ios --no-build-cache
