#!/bin/bash

# Install bundletool for AAB validation
# Usage: ./scripts/installBundletool.sh

echo "📦 Installing bundletool..."

# Check if Java is installed (required for bundletool)
if ! command -v java &> /dev/null; then
    echo "❌ Java is required for bundletool"
    echo "   Install Java: brew install openjdk (macOS) or download from https://adoptium.net/"
    exit 1
fi

# Check if Homebrew is available (macOS)
if command -v brew &> /dev/null; then
    echo "✅ Installing via Homebrew..."
    brew install bundletool
else
    echo "📥 Downloading bundletool manually..."
    BUNDLETOOL_VERSION="1.15.6"
    BUNDLETOOL_URL="https://github.com/google/bundletool/releases/download/${BUNDLETOOL_VERSION}/bundletool-all-${BUNDLETOOL_VERSION}.jar"
    BUNDLETOOL_DIR="$HOME/.local/bin"
    BUNDLETOOL_PATH="$BUNDLETOOL_DIR/bundletool.jar"
    
    mkdir -p "$BUNDLETOOL_DIR"
    curl -L -o "$BUNDLETOOL_PATH" "$BUNDLETOOL_URL"
    
    # Create wrapper script
    cat > "$BUNDLETOOL_DIR/bundletool" << EOF
#!/bin/bash
java -jar "$BUNDLETOOL_PATH" "\$@"
EOF
    chmod +x "$BUNDLETOOL_DIR/bundletool"
    
    echo "✅ bundletool installed to: $BUNDLETOOL_DIR/bundletool"
    echo "   Add to PATH: export PATH=\"\$PATH:$BUNDLETOOL_DIR\""
fi

echo ""
echo "✅ bundletool installation complete!"
echo ""
echo "Usage:"
echo "  bundletool validate --bundle=path/to/app.aab"
echo "  bundletool get-size total --bundle=path/to/app.aab"

