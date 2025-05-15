<div id="chess-container" 
     data-theme="<?php echo esc_attr($atts['theme']); ?>" 
     data-ai-level="<?php echo esc_attr($atts['ai_level']); ?>">
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('chess-container');
    const theme = container.dataset.theme;
    const aiLevel = container.dataset.aiLevel;
    
    let difficulty = DIFFICULTY.MEDIUM;
    switch(aiLevel) {
        case 'easy': difficulty = DIFFICULTY.EASY; break;
        case 'hard': difficulty = DIFFICULTY.HARD; break;
        case 'master': difficulty = DIFFICULTY.MASTER; break;
    }
    
    const game = new Game({
        gameMode: 'player-vs-ai',
        aiDifficulty: difficulty,
        theme: THEMES[theme.toUpperCase()] || THEMES.BLUE_PINK
    });
    
    game.initialize(container);
});
</script>