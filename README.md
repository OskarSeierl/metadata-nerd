# Metadata-Nerd

# Get Started

Install needed dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

## Problems

### Package was compiled against different node version
If you get an error like this:

```
error better_sqlite3.node: The package was compiled against a different Node.js version than the one you're using. Please recompile the package using the same Node.js version.
```
You can fix it by running the following command:

```bash
npx electron-rebuild
```
