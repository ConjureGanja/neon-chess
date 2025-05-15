<?php
/**
 * Plugin Name: Neon Chess
 * Description: A neon-themed chess game with AI and multiplayer support
 * Version: 1.0.0
 * Author: Your Name
 * Text Domain: neon-chess
 * Domain Path: /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Define plugin constants
define('NEON_CHESS_VERSION', '1.0.0');
define('NEON_CHESS_PATH', plugin_dir_path(__FILE__));
define('NEON_CHESS_URL', plugin_dir_url(__FILE__));

// Include required files
require_once NEON_CHESS_PATH . 'includes/class-neon-chess.php';

// Activation, deactivation, and uninstall hooks
register_activation_hook(__FILE__, 'neon_chess_activate');
register_deactivation_hook(__FILE__, 'neon_chess_deactivate');

function neon_chess_activate() {
    // Activation code
}

function neon_chess_deactivate() {
    // Deactivation code
}

// Initialize the plugin
function run_neon_chess() {
    $plugin = new Neon_Chess();
    $plugin->run();
}
run_neon_chess();