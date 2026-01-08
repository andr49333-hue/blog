# PM2 Setup Guide

## 📦 Installation

### Install PM2 globally:
```bash
npm install -g pm2
```

### Or install locally as dev dependency:
```bash
npm install --save-dev pm2
```

---

## 🚀 Usage

### Start Server with PM2:
```bash
npm run pm2:start
```

### Stop Server:
```bash
npm run pm2:stop
```

### Restart Server:
```bash
npm run pm2:restart
```

### Delete from PM2:
```bash
npm run pm2:delete
```

### View Logs:
```bash
npm run pm2:logs
```

### Monitor (Real-time):
```bash
npm run pm2:monit
```

### Check Status:
```bash
npm run pm2:status
```

---

## 📋 Direct PM2 Commands

You can also use PM2 commands directly:

```bash
# Start
pm2 start ecosystem.config.js

# Stop
pm2 stop cms-backend

# Restart
pm2 restart cms-backend

# Delete
pm2 delete cms-backend

# View logs
pm2 logs cms-backend

# Monitor
pm2 monit

# Status
pm2 status

# Save PM2 process list (for auto-restart on reboot)
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

---

## ⚙️ Configuration

The PM2 configuration is in `ecosystem.config.js`:

- **name**: Process name (`cms-backend`)
- **script**: Entry point (`./server.js`)
- **instances**: Number of instances (1)
- **exec_mode**: Execution mode (`fork`)
- **watch**: Auto-restart on file changes (false)
- **max_memory_restart**: Restart if memory exceeds 1GB
- **env**: Environment variables for development
- **env_production**: Environment variables for production

### Logs Location:
- Error logs: `./logs/pm2-error.log`
- Output logs: `./logs/pm2-out.log`
- Combined logs: `./logs/pm2-combined.log`

---

## 🔧 Production Setup

### 1. Start in Production Mode:
```bash
pm2 start ecosystem.config.js --env production
```

### 2. Save PM2 Process List:
```bash
pm2 save
```

### 3. Setup Auto-start on System Reboot:
```bash
pm2 startup
# Follow the instructions shown
```

---

## 📊 Useful PM2 Commands

### View Detailed Info:
```bash
pm2 show cms-backend
```

### View Real-time Logs:
```bash
pm2 logs cms-backend --lines 100
```

### Clear Logs:
```bash
pm2 flush
```

### Reload (Zero-downtime restart):
```bash
pm2 reload cms-backend
```

### Stop All PM2 Processes:
```bash
pm2 stop all
```

### Delete All PM2 Processes:
```bash
pm2 delete all
```

### View PM2 Dashboard:
```bash
pm2 plus
```

---

## 🐛 Troubleshooting

### Server Not Starting:
1. Check logs: `npm run pm2:logs`
2. Check status: `npm run pm2:status`
3. Verify environment variables in `.env` file
4. Check MongoDB connection

### PM2 Process Keeps Restarting:
1. Check error logs: `pm2 logs cms-backend --err`
2. Verify server.js has no syntax errors
3. Check memory usage: `pm2 monit`

### Logs Not Appearing:
1. Ensure `logs/` directory exists
2. Check file permissions
3. Run: `pm2 flush` to clear old logs

---

## 📝 Notes

- PM2 will automatically restart the server if it crashes
- Logs are stored in `./logs/` directory
- Use `pm2 save` after making changes to persist them
- For production, use `--env production` flag
- PM2 runs in background, use `pm2 monit` to monitor

---

## 🔄 Switching Between PM2 and Regular Start

### Use PM2:
```bash
npm run pm2:start
```

### Use Regular Node (for development):
```bash
npm start
# or
npm run dev  # with nodemon
```

---

## 📚 More Information

- PM2 Documentation: https://pm2.keymetrics.io/
- PM2 GitHub: https://github.com/Unitech/pm2

