# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Recommended - Cloud Database)

1. **Create MongoDB Atlas Account**

   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**

   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Set Up Database Access**

   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Select "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**

   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**

   - Go to "Database" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

6. **Update Environment Variables**
   - Replace the `MONGO_URI` in `server/config.env` with your Atlas connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `job-tracker`

Example:

```
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/job-tracker
```

## Option 2: Local MongoDB Installation

### Windows

1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a service and start automatically
4. The default connection string will be: `mongodb://localhost:27017/job-tracker`

### macOS

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu)

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Testing the Connection

After setting up MongoDB, you can test the connection by starting the server:

```bash
cd server
npm run dev
```

You should see "Connected to MongoDB" in the console if the connection is successful.

## Troubleshooting

### Common Issues

1. **Connection Refused**

   - Make sure MongoDB is running
   - Check if the port 27017 is not blocked
   - Verify the connection string is correct

2. **Authentication Failed**

   - Double-check username and password
   - Ensure the database user has proper permissions

3. **Network Access Issues (Atlas)**
   - Make sure your IP is whitelisted in Atlas
   - Try "Allow Access from Anywhere" for development

### Getting Help

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Community Forums](https://developer.mongodb.com/community/forums/)
