# Troubleshooting Local n8n Testing Environment

This guide covers common issues you might encounter when setting up and using the local n8n testing environment for Luma nodes.

## Common Issues

### 1. Setup Issues

#### "pnpm: command not found"
**Problem**: pnpm is not installed globally.

**Solution**:
```bash
npm install -g pnpm
```

**Alternative**: Use npm scripts directly:
```bash
npm run build
npx tsx .n8n/scripts/setup.ts
```

#### "Node.js version compatibility warning"
**Problem**: Using Node.js < 22 (but >= 20).

**Impact**: Everything works, but you'll see warnings.

**Solutions**:
- **Recommended**: Upgrade to Node.js 22+
- **Workaround**: Ignore warnings (functionality unaffected)

#### "Build directory not found"
**Problem**: Trying to link nodes before building.

**Solution**:
```bash
pnpm run build
pnpm run n8n:link
```

#### "Environment file not found"
**Problem**: Setup script hasn't been run.

**Solution**:
```bash
pnpm run n8n:setup
```

### 2. Node Building Issues

#### "TypeScript compilation errors"
**Problem**: TypeScript errors preventing build.

**Diagnosis**:
```bash
pnpm run dev  # Watch mode to see errors
```

**Common Solutions**:
- Fix TypeScript syntax errors
- Update imports/exports
- Check type definitions

#### "Missing SVG icons after build"
**Problem**: Gulp icon copying failed.

**Diagnosis**:
```bash
# Check if icons exist in source
ls nodes/*/luma.svg

# Check if icons copied to dist
ls dist/nodes/*/luma.svg
```

**Solution**:
```bash
# Rebuild with verbose output
pnpm run clean
pnpm run build
```

### 3. Node Linking Issues

#### "Custom nodes directory not found"
**Problem**: Local environment not set up.

**Solution**:
```bash
pnpm run n8n:setup
```

#### "Required file missing after linking"
**Problem**: Build incomplete or linking failed.

**Diagnosis**:
```bash
# Check what's in dist/
ls -la dist/

# Check what's linked
ls -la .n8n/.local/n8n-custom-nodes/
```

**Solution**:
```bash
# Clean rebuild and re-link
pnpm run clean
pnpm run build
pnpm run n8n:link --clean
```

#### "Permission denied when linking"
**Problem**: File system permissions (rare on most systems).

**Solution** (Linux/macOS):
```bash
chmod -R 755 .n8n/
```

### 4. n8n Startup Issues

#### "n8n command not found"
**Problem**: n8n not available via npx or globally.

**Solutions**:
```bash
# Install n8n globally (optional)
npm install -g n8n

# Or ensure npx works
npm --version  # Should work if npm is installed
```

#### "Port already in use"
**Problem**: Port 5678 is occupied.

**Solutions**:
```bash
# Check what's using the port
lsof -i :5678  # macOS/Linux
netstat -ano | findstr :5678  # Windows

# Change port in .env file
echo "N8N_PORT=5679" >> .n8n/.local/.env
```

#### "Custom nodes not appearing in n8n"
**Problem**: n8n not recognizing custom nodes.

**Diagnosis Steps**:
1. Check nodes are linked:
   ```bash
   pnpm run n8n:health
   ```

2. Check environment variables:
   ```bash
   cat .n8n/.local/.env
   ```

3. Check n8n startup logs for node loading messages

**Solutions**:
```bash
# Re-link with clean state
pnpm run n8n:link --clean

# Restart n8n
# (Stop with Ctrl+C, then restart)
pnpm run n8n:start
```

#### "n8n starts but shows errors"
**Problem**: Node files have JavaScript errors.

**Diagnosis**:
- Check n8n console output for specific errors
- Look for TypeScript compilation issues

**Solution**:
```bash
# Check build output for errors
pnpm run build

# Run health check
pnpm run n8n:health --verbose
```

### 5. Development Workflow Issues

#### "Changes not reflected in n8n"
**Problem**: Files rebuilt but n8n not restarted.

**Solution**:
```bash
# After code changes:
1. Stop n8n (Ctrl+C)
2. Rebuild: pnpm run build
3. Re-link: pnpm run n8n:link
4. Restart: pnpm run n8n:start
```

#### "Watch mode not working"
**Problem**: TypeScript watch mode issues.

**Diagnosis**:
```bash
# Check TypeScript compiler
pnpm run dev  # Should show "Starting compilation in watch mode..."
```

**Solutions**:
- Check for TypeScript syntax errors
- Restart watch mode
- Check file permissions

#### "Development mode slow"
**Problem**: Full rebuild taking too long.

**Optimization**:
```bash
# Use incremental builds (already enabled in tsconfig.json)
# Use watch mode for faster rebuilds
pnpm run dev
```

### 6. Cross-Platform Issues

#### "Path separators wrong" (Windows)
**Problem**: Hard-coded Unix paths in scripts.

**Check**: All scripts use `path.join()` for cross-platform paths.

**Solution**: If issues persist, report as bug.

#### "Symbolic link creation fails" (Windows)
**Problem**: Windows permissions for symlinks.

**Workaround**: Scripts use file copying instead of symlinks.

#### "Script execution fails" (Windows)
**Problem**: PowerShell execution policy.

**Solution**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 7. Environment Variable Issues

#### "Environment variables not loaded"
**Problem**: `.env` file not read properly.

**Diagnosis**:
```bash
# Check if .env file exists
cat .n8n/.local/.env

# Check environment loading
pnpm run n8n:health
```

**Solution**:
```bash
# Recreate from template
cp .n8n/config/.env.template .n8n/.local/.env
```

#### "Relative paths not resolving"
**Problem**: Working directory issues.

**Check**: Scripts should resolve all paths to absolute paths.

**Manual Fix**: Edit `.n8n/.local/.env` with absolute paths:
```bash
N8N_USER_FOLDER=/full/path/to/.n8n/.local/n8n-data
N8N_CUSTOM_EXTENSIONS=/full/path/to/.n8n/.local/n8n-custom-nodes
```

### 8. Performance Issues

#### "n8n startup very slow"
**Problem**: Large number of files or slow filesystem.

**Solutions**:
- Use SSD for development
- Exclude `.n8n/.local/` from antivirus scanning
- Use watch mode for faster rebuilds

#### "File watching not working"
**Problem**: File system limits (Linux) or permissions.

**Solution** (Linux):
```bash
# Increase file watch limits
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 9. Clean-Up and Reset

#### "Environment corrupted"
**Problem**: Local environment in bad state.

**Nuclear Option - Full Reset**:
```bash
# Remove all local files
rm -rf .n8n/.local/

# Clean build artifacts
pnpm run clean

# Full setup from scratch
pnpm run n8n:setup
pnpm run build
pnpm run n8n:link
pnpm run n8n:start
```

#### "Partial cleanup"
**Problem**: Want to keep data but reset nodes.

**Selective Reset**:
```bash
# Keep n8n data, reset nodes only
rm -rf .n8n/.local/n8n-custom-nodes/
pnpm run n8n:link
```

## Diagnostic Commands

### Health Check
```bash
# Basic health check
pnpm run n8n:health

# Verbose diagnostics
pnpm run n8n:health --verbose
```

### Manual Verification
```bash
# Check file structure
tree .n8n/  # or ls -R .n8n/

# Check built files
ls -la dist/

# Check linked files
ls -la .n8n/.local/n8n-custom-nodes/

# Check environment
cat .n8n/.local/.env

# Check processes
ps aux | grep n8n  # Unix
tasklist | findstr n8n  # Windows
```

### Script Debugging
```bash
# Run scripts with verbose output
tsx .n8n/scripts/setup.ts --verbose
tsx .n8n/scripts/link-nodes.ts --verbose
tsx .n8n/scripts/health-check.ts --verbose
```

## Getting Help

### 1. Self-Diagnosis
Always start with:
```bash
pnpm run n8n:health --verbose
```

### 2. Check Prerequisites
- Node.js >= 20 (preferably >= 22)
- pnpm installed and working
- Project builds successfully

### 3. Fresh Environment Test
Try with a completely clean environment:
```bash
rm -rf .n8n/.local/
pnpm run n8n:setup
```

### 4. Report Issues
When reporting issues, include:
- Operating system and version
- Node.js version (`node --version`)
- pnpm version (`pnpm --version`)
- Output of `pnpm run n8n:health --verbose`
- Specific error messages
- Steps to reproduce

### 5. Community Support
- Check existing issues in the repository
- Search for similar problems
- Provide detailed reproduction steps
- Include diagnostic output

## Advanced Troubleshooting

### Network Issues
If n8n tunnel or network features fail:
```bash
# Test basic connectivity
curl -I https://www.google.com

# Check firewall settings
# Check proxy settings if behind corporate firewall
```

### Memory Issues
If n8n fails due to memory:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm run n8n:start
```

### File System Issues
If file operations fail:
```bash
# Check disk space
df -h  # Unix
dir  # Windows

# Check permissions
ls -la .n8n/  # Unix
icacls .n8n\  # Windows
```

Remember: Most issues can be resolved by running the setup from scratch. When in doubt, clean everything and start over.