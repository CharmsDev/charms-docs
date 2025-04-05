# Charms Documentation Makefile

# Default port for Astro dev server
PORT ?= 4321

.PHONY: dev kill clean install

# Install dependencies
install:
	@echo "Installing dependencies..."
	cd $(CURDIR) && npm install
	@echo "Dependencies installed successfully."

# Start the development server
dev: kill
	@echo "Starting Charms docs development server on port $(PORT)..."
	cd $(CURDIR) && PORT=$(PORT) npx astro dev

# Kill any process running on the specified port
kill:
	@echo "Checking for processes on port $(PORT)..."
	-@lsof -ti:$(PORT) | xargs kill -9 2>/dev/null || true
	@echo "Port $(PORT) is now available."

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf $(CURDIR)/dist
	@echo "Clean complete."

# Default target
all: install dev

# Help command
help:
	@echo "Charms Documentation Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make                  - Install dependencies and start development server"
	@echo "  make install          - Install dependencies"
	@echo "  make dev [PORT=port]  - Start development server (default port: 4321)"
	@echo "  make kill [PORT=port] - Kill process on specified port"
	@echo "  make clean            - Remove build artifacts"
	@echo "  make help             - Show this help message"
	@echo ""
	@echo "Examples:"
	@echo "  make                  - Install dependencies and start server on default port"
	@echo "  make dev              - Start server on default port"
	@echo "  make dev PORT=3000    - Start server on port 3000"
	@echo "  make kill PORT=3000   - Kill process on port 3000"
