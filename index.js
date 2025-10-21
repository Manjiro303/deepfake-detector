# Create index.js
cat > index.js << 'EOF'
import { registerRootComponent } from 'expo';
import App from './src/App';

registerRootComponent(App);
EOF

# Update package.json to use it
# (Edit package.json to change "main" field)

# Commit and push
git add index.js
git commit -m "Add app entry point"
git push
