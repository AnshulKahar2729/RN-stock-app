# StocksApp 📈

A modern React Native mobile application for tracking stock market data, managing watchlists, and viewing detailed financial information.

## Overview

StocksApp is a comprehensive stock market tracking application that allows users to monitor top gainers and losers, view detailed stock information with interactive charts, and manage personalized watchlists. Built with React Native and TypeScript for cross-platform compatibility.

## ✨ Features

### 🏠 Home Screen
- **Top Gainers & Losers**: Real-time display of best and worst performing stocks
- **Pull-to-Refresh**: Update stock data with a simple pull gesture
- **Quick Navigation**: Tap to view detailed stock information
- **View All**: Paginated views for comprehensive market data

### 📊 Stock Details
- **Interactive Charts**: Time series charts with multiple timeframes (1D, 1W, 1M, 3M, 6M, 1Y, 5Y)
- **Company Overview**: Complete company information including sector, industry, and description
- **Financial Metrics**: Key financial ratios and performance indicators
- **Price Analysis**: 52-week high/low, moving averages, and price ranges
- **Quick Stats**: Market cap, P/E ratio, dividend yield, and more

### 📋 Watchlist Management
- **Multiple Watchlists**: Create and manage multiple custom watchlists
- **Add to Watchlist**: Easy stock addition via bottom sheet interface
- **Watchlist Overview**: Quick access to all your tracked stocks
- **Persistent Storage**: Watchlists saved locally for offline access

### 🎨 User Experience
- **Dark/Light Theme**: Automatic theme switching support
- **Lazy Loading**: Optimized performance with lazy-loaded screens
- **Error Handling**: Graceful error states with retry functionality
- **Search Functionality**: Find stocks quickly with search capabilities
- **Responsive Design**: Optimized for various screen sizes

## 🛠️ Tech Stack

### Core Framework
- **React Native** (0.80.0) - Cross-platform mobile development
- **TypeScript** (5.0.4) - Type-safe JavaScript
- **React** (19.1.0) - UI library

### Navigation & State Management
- **React Navigation** (7.x) - Navigation library with bottom tabs and stack navigation
- **TanStack Query** (5.x) - Server state management and caching
- **React Context** - Global state management for themes and watchlists

### UI & Styling
- **React Native Vector Icons** - Icon library
- **React Native Gesture Handler** - Gesture recognition
- **React Native Reanimated** - Smooth animations
- **React Native Safe Area Context** - Safe area handling

### Charts & Visualization
- **React Native Chart Kit** - Chart components

### Data & Storage
- **Axios** - HTTP client for API requests
- **AsyncStorage** - Local data persistence
- **TanStack Query Persist Client** - Query result persistence

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Metro** - JavaScript bundler
- **React Native Config** - Environment configuration

## 📱 Screens

### Main Navigation
- **Home Tab**
  - Home Screen - Market overview with top gainers/losers
  - Product Screen - Detailed stock information
  - View All Screen - Paginated stock lists
  - Watchlist Detail Screen - Individual watchlist view

- **Watchlist Tab**
  - Watchlist Home Screen - All watchlists overview
  - Product Screen - Stock details from watchlist
  - View All Screen - Extended watchlist views
  - Watchlist Detail Screen - Specific watchlist management


## 📦 Installation

### Prerequisites
- Node.js >= 18
- React Native development environment set up
- Android Studio (for Android development)
- Xcode (for iOS development)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stocksApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   # Install CocoaPods dependencies
   bundle install
   bundle exec pod install
   cd ios && pod install && cd ..
   ```

4. **Environment Configuration**
   ```bash
   # Create your environment configuration
   cp .env.example .env
   # Add your API keys and configuration
   ```

## 🚀 Running the App

### Start Metro Server
```bash
npm start
# or
yarn start
```

### Build and Run

#### Android
```bash
npm run android
# or
yarn android
```

#### iOS
```bash
npm run ios
# or
yarn ios
```

### Development Commands
```bash
# Reset Metro cache
npm run reset-cache

# Run tests
npm test

# Lint code
npm run lint
```

## 🔧 Configuration

The app uses React Native Config for environment management. Create a `.env` file in the root directory with your API configuration:

```env
API_BASE_URL=your_api_endpoint
API_KEY=your_api_key
```

## 🏗️ Architecture

### Data Flow
- **TanStack Query** manages server state and caching
- **React Context** handles global app state (themes, watchlists)
- **AsyncStorage** provides persistent local storage
- **Axios** handles all HTTP requests with interceptors

## 🧪 Testing

Run the test suite:
```bash
npm test
# or
yarn test
```


## 🐛 Troubleshooting

### Common Issues

- **Metro bundler issues**: Try `npm run reset-cache`
- **iOS build failures**: Ensure CocoaPods are properly installed
- **Android build issues**: Check Android SDK and build tools versions

For more help, see the [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting).

---

Built with ❤️ using React Native and TypeScript
