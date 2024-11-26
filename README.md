# Connect 4 Game

## Overview

A Connect 4 implementation with configurable board sizes and AI agents. Players can play against each other or against different AI strategies.

## Play Online

[Play Connect 4](https://josegibson.github.io/Connect-4/)

## Features

- Configurable board dimensions (default 6x7)
- Adjustable win condition (how many pieces in a row)
- Player options:
  - Human vs Human
  - Human vs AI
  - AI vs AI
- Available Algorithms:
  - Random
  - Lookahead

## Technical Stack

### Frontend
- React 18
- SCSS for styling
- Responsive design using CSS Grid
- Bootstrap 5.3

### Backend
- AWS Lambda functions
- Kaggle Environments integration for AI agents while testing

### Development Tools
- Node.js
- Docker for local development
- SASS for CSS preprocessing

## Known Limitations

- AI response time varies due to Lambda cold starts
- Mobile layout optimized for screens > 480px
- Limited error handling for network failures
