<?php
/**
 * Main plugin class
 */
class Neon_Chess {
    /**
     * Initialize the plugin
     */
    public function __construct() {
        // Constructor
    }

    /**
     * Run the plugin
     */
    public function run() {
        // Register scripts and styles
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        
        // Register shortcodes
        add_shortcode('neon-chess', array($this, 'render_game'));
    }

    /**
     * Enqueue scripts and styles
     */
    public function enqueue_assets() {
        wp_enqueue_style(
            'neon-chess-css',
            NEON_CHESS_URL . 'assets/css/neon-chess.css',
            array(),
            NEON_CHESS_VERSION
        );
        
        wp_enqueue_script(
            'neon-chess-js',
            NEON_CHESS_URL . 'assets/js/neon-chess.js',
            array('jquery'),
            NEON_CHESS_VERSION,
            true
        );
    }

    /**
     * Render the game board
     */
    public function render_game($atts) {
        $atts = shortcode_atts(array(
            'theme' => 'blue-pink',
            'ai_level' => 'medium',
        ), $atts);
        
        ob_start();
        include NEON_CHESS_PATH . 'templates/game-board.php';
        return ob_get_clean();
    }
}