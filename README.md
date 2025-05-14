# neon-chess
A neon-themed chess game with AI and multiplayer support
# WordPress Integration Guide for Neon Chess

This guide will help you integrate the Neon Chess game into your WordPress site, configure user management, implement online multiplayer, and customize the game to fit your site's style.

## 1. Installation

### Basic Installation

1. **Download the plugin files**:
   - Download the `neon-chess.zip` file from the plugin page
   - Alternatively, clone the GitHub repository: `git clone https://github.com/yourusername/neon-chess.git`

2. **Upload to WordPress**:
   - Log in to your WordPress admin dashboard
   - Navigate to **Plugins > Add New**
   - Click the **Upload Plugin** button at the top of the page
   - Choose the `neon-chess.zip` file and click **Install Now**
   - After installation completes, click **Activate Plugin**

3. **Add to a page using shortcode**:
   - Create a new page or edit an existing one
   - Add the shortcode `[neon-chess]` where you want the game to appear
   - Publish or update the page
   - Visit the page to see the game in action

### Manual Installation

If you prefer manual installation:

1. Extract the `neon-chess.zip` file
2. Upload the `neon-chess` directory to your `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Use the shortcode `[neon-chess]` to display the game on any page or post

## 2. User Management Configuration

The Neon Chess plugin integrates with WordPress user accounts, but you can customize how this works.

### Integration with WordPress Users

By default, the plugin uses WordPress user accounts:

1. **Enable WordPress integration**:
   - Go to **Settings > Neon Chess** in your WordPress admin
   - Ensure the "Use WordPress User Accounts" option is checked
   - Save changes

When this option is enabled:
- Logged-in users play as registered users
- Game stats are saved to their WordPress user profile
- Guest mode is available for non-logged in visitors

### Custom User Management

If you prefer to use the plugin's built-in user system (independent from WordPress accounts):

1. **Switch to plugin user management**:
   - Go to **Settings > Neon Chess**
   - Uncheck "Use WordPress User Accounts"
   - Configure custom user settings:
     - Allow guest play (yes/no)
     - Required fields for registration
     - Email verification (yes/no)
     - Password requirements
   - Save changes

2. **Customize the login/register forms**:
   - Go to the "User Interface" tab
   - Modify form fields, labels, and styling
   - Set redirect URLs after login/registration
   - Save changes

### User Stats & Leaderboards

To set up leaderboards and user statistics:

1. **Configure stat tracking**:
   - Go to **Settings > Neon Chess > Stats**
   - Select which stats to track (wins, losses, draws, etc.)
   - Choose how to calculate ratings (ELO, custom formula)
   - Save changes

2. **Display leaderboards**:
   - Use the shortcode `[neon-chess-leaderboard]` to show rankings
   - Customize with parameters:
     - `[neon-chess-leaderboard count="10" stat="wins"]` - Top 10 players by wins
     - `[neon-chess-leaderboard count="5" stat="rating"]` - Top 5 players by rating

3. **Profile integration**:
   - Use `[neon-chess-profile]` to display a player's stats on their profile
   - Or enable automatic integration with selected WordPress themes

## 3. Online Multiplayer Implementation

### Setting Up Multiplayer

1. **Server Requirements**:
   - PHP 7.4+ with WebSocket support
   - MySQL or MariaDB database
   - Redis (recommended for game state caching)

2. **Configure Multiplayer Settings**:
   - Go to **Settings > Neon Chess > Multiplayer**
   - Select multiplayer mode:
     - Built-in WebSocket server
     - External service (Chess.io, GameSparks, etc.)
   - Enter necessary API keys or connection information
   - Set game matching preferences (random, ELO-based, friend invites)
   - Save changes

3. **Built-in WebSocket Server Setup**:
   - Ensure your hosting supports WebSockets
   - Configure the server URL and port
   - Set up cron jobs for server maintenance:
     - Add to crontab: `* * * * * php /path/to/wordpress/wp-content/plugins/neon-chess/server/cron.php`
     - Or use WP-Cron by enabling the option in settings

4. **External Service Configuration**:
   - Follow the documentation for your chosen service
   - Add required API keys and endpoints in plugin settings
   - Test the connection using the built-in diagnostics tool

### Multiplayer Features

Configure available multiplayer features:

1. **Game Modes**:
   - Quick match (random opponent)
   - Ranked match (ELO-based matching)
   - Friend challenge (via invitation)
   - Tournament mode (bracket-style competition)

2. **Communication Options**:
   - Enable/disable chat
   - Preset messages only
   - Voice chat integration
   - Spectator mode and comments

3. **Security Settings**:
   - Anti-cheating measures
   - Report system
   - Timeout handling
   - Automatic moderation

## 4. Customization Options

### Theme Customization

1. **Built-in Themes**:
   - Go to **Settings > Neon Chess > Appearance**
   - Choose from available themes:
     - Blue-Pink (default)
     - Green-Yellow
     - Purple-Orange
   - Save changes

2. **Custom Theme Creation**:
   - Create a new CSS file in your theme directory: `neon-chess-custom.css`
   - Add your custom CSS styles (use the existing themes as reference)
   - Enable "Custom Theme" in the plugin settings
   - Specify the path to your CSS file

3. **Color Picker**:
   - Use the built-in color picker to customize:
     - Board colors
     - Piece colors and glow effects
     - UI element colors
     - Background effects

### Layout and Positioning

1. **Size and Responsiveness**:
   - Set default board size
   - Configure responsive breakpoints
   - Adjust mobile-specific layouts

2. **Element Positioning**:
   - Re-arrange UI components
   - Hide/show specific elements
   - Create custom layouts using the visual editor

3. **Shortcode Options**:
   - Control appearance via shortcode parameters:
     - `[neon-chess theme="green-yellow" size="large"]`
     - `[neon-chess show_captured="false" ai_level="3"]`

### Integration with WordPress Themes

For seamless integration with your WordPress theme:

1. **Theme-Specific Styling**:
   - Enable "Inherit from Theme" option to match your site's style
   - Add theme-specific CSS hooks for better integration
   - Use theme color schemes when available

2. **Widget Integration**:
   - Add the Neon Chess game to widget areas
   - Display leaderboards in sidebars
   - Show player stats in header/footer areas

3. **Block Editor Support**:
   - Use the Neon Chess blocks in the Gutenberg editor
   - Customize appearance directly in the block settings
   - Combine with other blocks for advanced layouts

## 5. Advanced Configurations

### Performance Optimization

1. **Caching Settings**:
   - Configure asset caching
   - Enable/disable specific features for performance
   - Adjust animation quality based on device capability

2. **Database Optimization**:
   - Schedule automatic cleanup of old game data
   - Index tuning for large user bases
   - Data export/import options

### Developer Hooks and Filters

The plugin provides various hooks and filters for developers:

```php
// Example: Customize piece movement animation
add_filter('neon_chess_animation_speed', function($speed) {
    return 0.5; // Make animations twice as fast
});

// Example: Add custom game mode
add_action('neon_chess_init', function($game) {
    $game->registerGameMode('speed_chess', [
        'time_limit' => 300, // 5 minutes
        'increment' => 2,    // 2 seconds per move
    ]);
});
```

See the developer documentation for a complete list of available hooks and filters.

### Troubleshooting

1. **Common Issues**:
   - WebSocket connection problems
   - User account synchronization
   - Theme compatibility issues
   - Performance bottlenecks

2. **Diagnostic Tools**:
   - Access the built-in diagnostics at **Settings > Neon Chess > Tools**
   - Run connection tests for multiplayer setup
   - Check system compatibility
   - View error logs and debug information

3. **Support Resources**:
   - Documentation: [docs.neonchess.com](https://docs.neonchess.com)
   - Support forum: [support.neonchess.com](https://support.neonchess.com)
   - GitHub issues: [github.com/yourusername/neon-chess/issues](https://github.com/yourusername/neon-chess/issues)

## 6. Updating the Plugin

1. **Automatic Updates**:
   - WordPress will notify you of available updates
   - Update directly from the Plugins page

2. **Manual Updates**:
   - Download the latest version
   - Deactivate and delete the current plugin (your settings will be preserved)
   - Install and activate the new version

3. **Version-Specific Notes**:
   - Always check the changelog before updating
   - Back up your customizations
   - Some updates may require database migrations (handled automatically)
