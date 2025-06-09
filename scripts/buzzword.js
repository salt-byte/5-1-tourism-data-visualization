// Buzzword Analysis Page JavaScript

// Initialize charts when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    setupEventListeners();
    addPageAnimations();
    // Initialize falling words animation immediately
    setupPythonWordCloudControls();
});

// Setup Dynamic Falling Word Cloud
function setupPythonWordCloudControls() {
    const wordCloudContainer = document.getElementById('wordCloudChart');
    const fallingContainer = document.getElementById('fallingWordsContainer');
    
    console.log('wordCloudContainer:', wordCloudContainer);
    console.log('fallingWordsContainer:', fallingContainer);
    
    if (wordCloudContainer && fallingContainer) {
        // Initialize falling words animation
        initializeFallingWords();
    } else {
        console.error('Container not found!');
    }
    
    // Load word cloud data for potential future use
    // loadWordCloudData(); // Commented out to avoid CORS errors, only need falling words effect
}

// Falling Words Animation Variables
let fallingWords = [];
let settledWords = [];
let isAnimationRunning = true;
let animationSpeed = 6; // Much faster falling speed
let wordDensity = 100; // Extremely fast word generation frequency while maintaining order
let lastWordTime = 0;
let currentShape = 'rounded';
let chinaMapMode = false;

// China map key coordinate points (simplified version, percentage coordinates relative to container)
const chinaMapPoints = [
    // Northeast region
    {x: 0.85, y: 0.15}, {x: 0.88, y: 0.18}, {x: 0.90, y: 0.22}, {x: 0.87, y: 0.25},
    {x: 0.83, y: 0.28}, {x: 0.80, y: 0.25}, {x: 0.78, y: 0.20}, {x: 0.82, y: 0.17},
    
    // North China region
    {x: 0.75, y: 0.30}, {x: 0.78, y: 0.33}, {x: 0.80, y: 0.36}, {x: 0.77, y: 0.39},
    {x: 0.73, y: 0.37}, {x: 0.70, y: 0.34}, {x: 0.72, y: 0.31},
    
    // East China region
    {x: 0.82, y: 0.42}, {x: 0.85, y: 0.45}, {x: 0.87, y: 0.48}, {x: 0.84, y: 0.52},
    {x: 0.81, y: 0.55}, {x: 0.78, y: 0.52}, {x: 0.80, y: 0.48}, {x: 0.83, y: 0.45},
    
    // Central China region
    {x: 0.68, y: 0.45}, {x: 0.71, y: 0.48}, {x: 0.74, y: 0.51}, {x: 0.71, y: 0.54},
    {x: 0.67, y: 0.52}, {x: 0.64, y: 0.49}, {x: 0.66, y: 0.46},
    
    // South China region
    {x: 0.65, y: 0.65}, {x: 0.68, y: 0.68}, {x: 0.71, y: 0.71}, {x: 0.74, y: 0.68},
    {x: 0.77, y: 0.65}, {x: 0.74, y: 0.62}, {x: 0.70, y: 0.64}, {x: 0.67, y: 0.67},
    
    // Southwest region
    {x: 0.45, y: 0.60}, {x: 0.48, y: 0.63}, {x: 0.51, y: 0.66}, {x: 0.54, y: 0.69},
    {x: 0.51, y: 0.72}, {x: 0.47, y: 0.70}, {x: 0.43, y: 0.67}, {x: 0.46, y: 0.63},
    
    // Northwest region
    {x: 0.35, y: 0.35}, {x: 0.38, y: 0.32}, {x: 0.42, y: 0.29}, {x: 0.45, y: 0.32},
    {x: 0.48, y: 0.35}, {x: 0.51, y: 0.38}, {x: 0.48, y: 0.41}, {x: 0.44, y: 0.39},
    {x: 0.40, y: 0.37}, {x: 0.37, y: 0.40}, {x: 0.33, y: 0.38},
    
    // Xinjiang region
    {x: 0.15, y: 0.25}, {x: 0.18, y: 0.22}, {x: 0.22, y: 0.19}, {x: 0.25, y: 0.22},
    {x: 0.28, y: 0.25}, {x: 0.31, y: 0.28}, {x: 0.28, y: 0.31}, {x: 0.24, y: 0.29},
    {x: 0.20, y: 0.27}, {x: 0.17, y: 0.30}, {x: 0.13, y: 0.28},
    
    // Tibet region
    {x: 0.25, y: 0.50}, {x: 0.28, y: 0.47}, {x: 0.32, y: 0.44}, {x: 0.35, y: 0.47},
    {x: 0.38, y: 0.50}, {x: 0.35, y: 0.53}, {x: 0.31, y: 0.51}, {x: 0.27, y: 0.53},
    
    // Inner Mongolia region
    {x: 0.55, y: 0.20}, {x: 0.58, y: 0.17}, {x: 0.62, y: 0.14}, {x: 0.66, y: 0.17},
    {x: 0.70, y: 0.20}, {x: 0.67, y: 0.23}, {x: 0.63, y: 0.21}, {x: 0.59, y: 0.23},
    
    // Hainan Island
    {x: 0.68, y: 0.80}, {x: 0.70, y: 0.82}, {x: 0.72, y: 0.80}, {x: 0.70, y: 0.78}
];

let mapPointIndex = 0;

// Function to get shape styles
function getShapeStyle(shape) {
    const shapeStyles = {
        'rounded': {
            borderRadius: '25px',
            padding: '10px 20px',
            clipPath: 'none'
        },
        'pill': {
            borderRadius: '50px',
            padding: '12px 24px',
            clipPath: 'none'
        },
        'square': {
            borderRadius: '8px',
            padding: '12px 16px',
            clipPath: 'none'
        },
        'diamond': {
            borderRadius: '8px',
            padding: '16px 16px',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        },
        'hexagon': {
            borderRadius: '8px',
            padding: '14px 20px',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
        },
        'circle': {
            borderRadius: '50%',
            padding: '16px 16px',
            clipPath: 'none',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: '11px'
        }
    };
    return shapeStyles[shape] || shapeStyles['rounded'];
}

// Word pool with buzzwords and their weights
const buzzwordPool = [
    // High importance words (appear more frequently)
    'chill', 'chill', 'chill', 'chill', 'chill', 'chill', 'chill', 'chill', 'chill', 'chill',
    'citywalk', 'citywalk', 'citywalk', 'citywalk', 'citywalk', 'citywalk', 'citywalk', 'citywalk', 'citywalk',
    'suburb', 'suburb', 'suburb', 'suburb', 'suburb', 'suburb',
    'concert', 'concert', 'concert', 'concert', 'concert',
    'hiking', 'hiking', 'hiking', 'hiking', 'hiking',
    'homestay', 'homestay', 'homestay', 'homestay', 'homestay',
    'BBQ', 'BBQ', 'BBQ', 'BBQ',
    'cost performance', 'cost performance', 'cost performance', 'cost performance',
    'fun', 'fun', 'fun',
    'healing', 'healing', 'healing',
    'niche', 'niche', 'niche',
    'lie flat', 'lie flat'
];

// Original word data with importance scores for reference
const wordData = {
    'chill': 10,
    'citywalk': 9,
    'suburb': 6,
    'concert': 5,
    'hiking': 5,
    'homestay': 5,
    'BBQ': 4,
    'cost performance': 4,
    'fun': 3,
    'healing': 3,
    'niche': 3,
    'lie flat': 2
};

// Initialize falling words animation
function initializeFallingWords() {
    console.log('Initialize falling words animation');
    setupFallingWordsEventListeners();
    gameLoop();
}



// Create falling word element at a specific position
function createWordAtPosition() {
    console.log('Create new word in sequence');
    const word = document.createElement('div');
    const text = buzzwordPool[Math.floor(Math.random() * buzzwordPool.length)];
    word.textContent = text;
    word.className = 'falling-word';
    
    // Track current drop position
    if (!window.currentDropPosition) {
        window.currentDropPosition = 0;
    }
    
    // Cycle through 5 fixed positions for ordered appearance
    const positions = [0.1, 0.3, 0.5, 0.7, 0.9]; // Positions as percentage of container width
    const positionIndex = window.currentDropPosition % positions.length;
    window.currentDropPosition++;
    
    // Set fixed drop position
    const dropPosition = positions[positionIndex];
    
    // Diffusion style gradient background - rich dreamy colors (adjusted to dark, opacity 1.0)
    const diffusionGradients = [
        // Pink and blue gradients
        'linear-gradient(135deg, rgba(255, 182, 193, 1.0), rgba(135, 206, 250, 1.0))', // Light pink to sky blue
        'linear-gradient(135deg, rgba(255, 105, 180, 1.0), rgba(70, 130, 180, 1.0))', // Hot pink to steel blue
        'linear-gradient(135deg, rgba(255, 20, 147, 1.0), rgba(30, 144, 255, 1.0))', // Deep pink to dodger blue
        'linear-gradient(135deg, rgba(255, 192, 203, 1.0), rgba(173, 216, 230, 1.0))', // Pink to light blue
        
        // Orange and grapefruit red gradients
        'linear-gradient(135deg, rgba(255, 165, 0, 1.0), rgba(220, 20, 60, 1.0))', // Orange to crimson
        'linear-gradient(135deg, rgba(255, 140, 0, 1.0), rgba(255, 69, 0, 1.0))', // Dark orange to orange red
        'linear-gradient(135deg, rgba(255, 215, 0, 1.0), rgba(255, 99, 71, 1.0))', // Gold to tomato red
        'linear-gradient(135deg, rgba(255, 160, 122, 1.0), rgba(205, 92, 92, 1.0))', // Light salmon to indian red
        
        // Blue and green gradients
        'linear-gradient(135deg, rgba(0, 191, 255, 1.0), rgba(50, 205, 50, 1.0))', // Deep sky blue to lime green
        'linear-gradient(135deg, rgba(30, 144, 255, 1.0), rgba(0, 255, 127, 1.0))', // Dodger blue to spring green
        'linear-gradient(135deg, rgba(70, 130, 180, 1.0), rgba(60, 179, 113, 1.0))', // Steel blue to medium sea green
        'linear-gradient(135deg, rgba(100, 149, 237, 1.0), rgba(144, 238, 144, 1.0))', // Cornflower blue to light green
        
        // Blue and purple gradients
        'linear-gradient(135deg, rgba(65, 105, 225, 1.0), rgba(138, 43, 226, 1.0))', // Royal blue to blue violet
        'linear-gradient(135deg, rgba(30, 144, 255, 1.0), rgba(147, 112, 219, 1.0))', // Dodger blue to medium orchid
        'linear-gradient(135deg, rgba(0, 191, 255, 1.0), rgba(186, 85, 211, 1.0))', // Deep sky blue to medium orchid
        'linear-gradient(135deg, rgba(135, 206, 250, 1.0), rgba(221, 160, 221, 1.0))', // Sky blue to plum
        
        // Other beautiful gradient combinations
        'linear-gradient(135deg, rgba(255, 218, 185, 1.0), rgba(255, 182, 193, 1.0))', // Peach to light pink
        'linear-gradient(135deg, rgba(240, 230, 140, 1.0), rgba(255, 160, 122, 1.0))', // Khaki to light salmon
        'linear-gradient(135deg, rgba(152, 251, 152, 1.0), rgba(175, 238, 238, 1.0))', // Pale green to pale turquoise
        'linear-gradient(135deg, rgba(255, 228, 225, 1.0), rgba(255, 182, 193, 1.0))', // Misty rose to light pink
        'linear-gradient(135deg, rgba(230, 230, 250, 1.0), rgba(221, 160, 221, 1.0))', // Lavender to plum
        'linear-gradient(135deg, rgba(255, 239, 213, 1.0), rgba(255, 218, 185, 1.0))', // Papaya whip to peach
        'linear-gradient(135deg, rgba(176, 224, 230, 1.0), rgba(173, 216, 230, 1.0))', // Powder blue to light blue
        'linear-gradient(135deg, rgba(255, 250, 205, 1.0), rgba(255, 228, 181, 1.0))', // Lemon chiffon to moccasin
        'linear-gradient(135deg, rgba(250, 240, 230, 1.0), rgba(255, 228, 196, 1.0))', // Linen to bisque
        'linear-gradient(135deg, rgba(255, 245, 238, 1.0), rgba(255, 218, 185, 1.0))', // Seashell to peach
        'linear-gradient(135deg, rgba(240, 248, 255, 1.0), rgba(230, 230, 250, 1.0))', // Alice blue to lavender
        'linear-gradient(135deg, rgba(245, 255, 250, 1.0), rgba(240, 255, 240, 1.0))', // Mint cream to honeydew
        'linear-gradient(135deg, rgba(255, 240, 245, 1.0), rgba(255, 228, 225, 1.0))', // Lavender blush to misty rose
        'linear-gradient(135deg, rgba(248, 248, 255, 1.0), rgba(230, 230, 250, 1.0))' // Ghost white to lavender
    ];
    const gradientBg = diffusionGradients[Math.floor(Math.random() * diffusionGradients.length)];
    
    // Diffusion style white text
    const textColor = 'rgba(255, 255, 255, 0.95)';
    
    let baseStyles = {
        position: 'absolute',
        background: gradientBg,
        color: textColor,
        fontSize: `${16 + Math.random() * 10}px`,
        fontWeight: '600',
        fontFamily: '"SF Pro Rounded", "Nunito", "Comic Neue", -apple-system, BlinkMacSystemFont, sans-serif',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'diffusionGlow 3s ease-in-out infinite alternate',
        boxShadow: '0 0 30px rgba(138, 43, 226, 0.4), 0 0 60px rgba(138, 43, 226, 0.2), 0 0 90px rgba(138, 43, 226, 0.1), 0 4px 15px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(15px) saturate(1.4)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '8px 16px',
        margin: '0',
        borderRadius: '20px',
        zIndex: '25',
        pointerEvents: 'auto',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 255, 255, 0.5)',
        letterSpacing: '0.2px'
    };
    
    // Convert styles object to CSS string
    let cssText = Object.entries(baseStyles).map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssKey}: ${value}`;
    }).join('; ');
    
    word.style.cssText = cssText;
    word.style.background = gradientBg;
    
    // Use fixed starting position for ordered appearance
    const container = document.getElementById('fallingWordsContainer');
    if (!container) {
        console.error('fallingWordsContainer not found!');
        return null;
    }
    const containerRect = container.getBoundingClientRect();
    const leftPosition = dropPosition * containerRect.width;
    word.style.left = (leftPosition - 50) + 'px'; // Center word at position
    word.style.top = '-50px';
    
    // Diffusion style hover effect - dreamy glow
    word.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.15) translateY(-3px)';
        this.style.boxShadow = '0 0 40px rgba(138, 43, 226, 0.6), 0 0 80px rgba(138, 43, 226, 0.4), 0 0 120px rgba(138, 43, 226, 0.2), 0 8px 25px rgba(0, 0, 0, 0.15)';
        this.style.backdropFilter = 'blur(20px) saturate(1.6)';
        this.style.filter = 'brightness(1.2) saturate(1.3)';
        this.style.animation = 'none'; // Pause glow animation
    });
    
    word.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 0 30px rgba(138, 43, 226, 0.4), 0 0 60px rgba(138, 43, 226, 0.2), 0 0 90px rgba(138, 43, 226, 0.1), 0 4px 15px rgba(0, 0, 0, 0.1)';
        this.style.backdropFilter = 'blur(15px) saturate(1.4)';
        this.style.filter = 'none';
        this.style.animation = 'diffusionGlow 3s ease-in-out infinite alternate'; // Resume glow animation
    });
    
    // Add click effect
    word.addEventListener('click', function(e) {
        e.stopPropagation();
        this.style.animation = 'explode 0.6s ease-out forwards';
        setTimeout(() => {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
                // Remove from arrays
                fallingWords = fallingWords.filter(w => w !== this);
                settledWords = settledWords.filter(w => w !== this);
                updateStats();
            }
        }, 600);
    });
    
    container.appendChild(word);
    fallingWords.push(word);
    console.log('Word added to container, current falling words count:', fallingWords.length);
    
    return word;
}

// Check if two rectangles overlap with padding
function checkOverlap(rect1, rect2, padding = 15) {
    return !(rect1.right + padding < rect2.left || 
             rect1.left - padding > rect2.right || 
             rect1.bottom + padding < rect2.top || 
             rect1.top - padding > rect2.bottom);
}

// Find non-overlapping position for word
function findNonOverlappingPosition(word, container) {
    const containerRect = container.getBoundingClientRect();
    const wordRect = word.getBoundingClientRect();
    const currentX = parseFloat(word.style.left);
    
    let bestX = currentX;
    let bestY = containerRect.height - wordRect.height - 10;
    
    // Try different positions to avoid overlap
    for (let attempts = 0; attempts < 50; attempts++) {
        let testX = bestX + (Math.random() - 0.5) * 100;
        let testY = bestY;
        
        // Ensure within container bounds
        testX = Math.max(10, Math.min(testX, containerRect.width - wordRect.width - 10));
        
        // Create test rectangle
        const testRect = {
            left: testX,
            top: testY,
            right: testX + wordRect.width,
            bottom: testY + wordRect.height
        };
        
        // Check for overlaps with settled words
        let hasOverlap = false;
        for (let settledWord of settledWords) {
            const settledRect = {
                left: parseFloat(settledWord.style.left),
                top: parseFloat(settledWord.style.top),
                right: parseFloat(settledWord.style.left) + settledWord.offsetWidth,
                bottom: parseFloat(settledWord.style.top) + settledWord.offsetHeight
            };
            
            if (checkOverlap(testRect, settledRect, 20)) {
                hasOverlap = true;
                // Move up to avoid overlap
                testY = settledRect.top - wordRect.height - 20;
                testRect.top = testY;
                testRect.bottom = testY + wordRect.height;
                break;
            }
        }
        
        if (!hasOverlap || testY < 10) {
            bestX = testX;
            bestY = Math.max(10, testY);
            break;
        }
    }
    
    return { x: bestX, y: bestY };
}

// Settle word at bottom with physics-based stacking (inspired by falling_words_animation.html)
function settleWord(word) {
    const container = document.getElementById('fallingWordsContainer');
    if (!container) {
        console.error('settleWord: fallingWordsContainer not found!');
        return;
    }
    
    word.classList.add('settled');
    
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const wordWidth = word.offsetWidth;
    const wordHeight = word.offsetHeight;
    const currentX = parseInt(word.style.left) || 0;
    
    // Find suitable stacking position from bottom up
    let stackHeight = 20; // Base height from bottom
    
    // Check overlap with other stacked words
    for (let settledWord of settledWords) {
        if (settledWord !== word) {
            const settledX = parseInt(settledWord.style.left) || 0;
            const settledBottom = parseInt(settledWord.style.bottom) || 20;
            const settledRight = settledX + settledWord.offsetWidth;
            const currentRight = currentX + wordWidth;
            
            // Check horizontal overlap - fix overlap detection logic
            const hasHorizontalOverlap = (currentX < settledRight && currentRight > settledX);
            
            if (hasHorizontalOverlap) {
                // If horizontal overlap, need to stack on top
                stackHeight = Math.max(stackHeight, settledBottom + settledWord.offsetHeight + 5);
            }
        }
    }
    
    // Ensure not exceeding container top
    stackHeight = Math.min(stackHeight, containerHeight - wordHeight - 20);
    
    // Set final position
    word.style.bottom = stackHeight + 'px';
    word.style.top = 'auto';
    word.style.transform = 'none';
    word.style.animation = 'none';
    
    // Maintain brightness, don't darken
    word.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
        word.style.transform = 'scale(0.95)';
        // Remove darkening effect, maintain original brightness
    }, 100);
    
    // Move from falling to settled
    fallingWords = fallingWords.filter(w => w !== word);
    settledWords.push(word);
}

// Draw China map outline animation
function drawChinaMapOutline() {
    const container = document.getElementById('fallingWordsContainer');
    if (!container || !chinaMapMode) return;
    
    // Create SVG for outline drawing
    let svg = document.getElementById('chinaMapOutline');
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'chinaMapOutline';
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '15';
        container.appendChild(svg);
    }
    
    // Simplified China map outline path (key points)
    const outlinePath = `M 0.15,0.3 Q 0.2,0.25 0.3,0.28 Q 0.4,0.2 0.5,0.25 Q 0.6,0.15 0.7,0.2 Q 0.8,0.18 0.85,0.25 Q 0.9,0.3 0.88,0.4 Q 0.85,0.5 0.8,0.6 Q 0.75,0.7 0.7,0.75 Q 0.6,0.8 0.5,0.78 Q 0.4,0.75 0.3,0.7 Q 0.2,0.65 0.15,0.6 Q 0.1,0.5 0.12,0.4 Z`;
    
    // Create path element
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', outlinePath);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgba(255, 215, 0, 0.8)');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('stroke-dasharray', '10,5');
    path.style.filter = 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))';
    
    // Add drawing animation
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength + ' ' + pathLength;
    path.style.strokeDashoffset = pathLength;
    path.style.animation = 'drawOutline 3s ease-in-out forwards';
    
    svg.appendChild(path);
    
    // Add CSS animation if not exists
    if (!document.getElementById('outlineAnimation')) {
        const style = document.createElement('style');
        style.id = 'outlineAnimation';
        style.textContent = `
            @keyframes drawOutline {
                to {
                    stroke-dashoffset: 0;
                }
            }
            @keyframes glowPulse {
                0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6)); }
                50% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 1)); }
            }
            @keyframes textDiffusion {
                 0% {
                     background: linear-gradient(135deg, 
                         rgba(255, 255, 255, 0.1), 
                         rgba(255, 255, 255, 0.03)
                     );
                     box-shadow: 
                         0 0 15px rgba(255, 255, 255, 0.2),
                         0 0 30px rgba(255, 255, 255, 0.15),
                         0 0 45px rgba(255, 255, 255, 0.08),
                         inset 0 0 15px rgba(255, 255, 255, 0.08);
                     text-shadow: 
                          0 0 3px currentColor,
                          0 0 6px currentColor,
                          0 0 9px currentColor,
                          0 0 12px currentColor;
                      filter: brightness(1.2) contrast(1.1) saturate(1.2) drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
                     backdrop-filter: blur(6px) saturate(1.1);
                     opacity: 1;
                 }
                 50% {
                     background: linear-gradient(135deg, 
                         rgba(255, 255, 255, 0.2), 
                         rgba(255, 255, 255, 0.1)
                     );
                     box-shadow: 
                         0 0 25px rgba(255, 255, 255, 0.4),
                         0 0 50px rgba(255, 255, 255, 0.25),
                         0 0 75px rgba(255, 255, 255, 0.15),
                         inset 0 0 25px rgba(255, 255, 255, 0.15);
                     text-shadow: 
                         0 0 5px currentColor,
                         0 0 10px currentColor,
                         0 0 15px currentColor,
                         0 0 20px currentColor;
                     filter: brightness(1.4) contrast(1.2) saturate(1.3) drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
                     backdrop-filter: blur(10px) saturate(1.4);
                     opacity: 1;
                 }
                 100% {
                     background: linear-gradient(135deg, 
                         rgba(255, 255, 255, 0.15), 
                         rgba(255, 255, 255, 0.05)
                     );
                     box-shadow: 
                         0 0 20px rgba(255, 255, 255, 0.3),
                         0 0 40px rgba(255, 255, 255, 0.2),
                         0 0 60px rgba(255, 255, 255, 0.1),
                         inset 0 0 20px rgba(255, 255, 255, 0.1);
                     text-shadow: 
                          0 0 3px currentColor,
                          0 0 6px currentColor,
                          0 0 9px currentColor,
                          0 0 12px currentColor;
                      filter: brightness(1.2) contrast(1.1) saturate(1.2) drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
                     backdrop-filter: blur(8px) saturate(1.2);
                     opacity: 1;
                 }
             }
        `;
        document.head.appendChild(style);
    }
    
    // Add pulsing glow effect after drawing
    setTimeout(() => {
        path.style.animation = 'glowPulse 2s ease-in-out infinite';
    }, 3000);
    
    console.log('China map outline animation triggered');
}

// Update statistics
// Update statistics function
function updateStats() {
    const fallingCountEl = document.getElementById('fallingCount');
    const settledCountEl = document.getElementById('settledCount');
    const totalCountEl = document.getElementById('totalCount');
    
    if (fallingCountEl) fallingCountEl.textContent = fallingWords.length;
    if (settledCountEl) settledCountEl.textContent = settledWords.length;
    if (totalCountEl) totalCountEl.textContent = fallingWords.length + settledWords.length;
}

// Toggle animation
function toggleAnimation() {
    isAnimationRunning = !isAnimationRunning;
    const btn = document.getElementById('toggleBtn');
    btn.textContent = isAnimationRunning ? 'Pause' : 'Start';
    btn.style.background = isAnimationRunning ? 
        'linear-gradient(135deg, rgba(138, 43, 226, 0.9), rgba(30, 144, 255, 0.9))' : 
        'linear-gradient(135deg, rgba(255, 99, 132, 0.9), rgba(255, 159, 64, 0.9))';
    btn.style.boxShadow = isAnimationRunning ? 
        '0 4px 15px rgba(138, 43, 226, 0.4)' : 
        '0 4px 15px rgba(255, 99, 132, 0.4)';
}

// Clear all words
function clearAllWords() {
    [...fallingWords, ...settledWords].forEach(word => {
        if (word.parentNode) {
            word.parentNode.removeChild(word);
        }
    });
    fallingWords = [];
    settledWords = [];
    updateStats();
}

// Clear settled words only
function clearSettledWords() {
    settledWords.forEach(word => {
        if (word.parentNode) {
            word.parentNode.removeChild(word);
        }
    });
    settledWords = [];
    updateStats();
}

// Setup event listeners for falling words controls
function setupFallingWordsEventListeners() {
    const shapeSelector = document.getElementById('shapeSelector');
    const chinaMapBtn = document.getElementById('chinaMapBtn');
    
    document.getElementById('toggleBtn')?.addEventListener('click', toggleAnimation);
    document.getElementById('clearAllBtn')?.addEventListener('click', clearAllWords);
    document.getElementById('clearSettledBtn')?.addEventListener('click', clearSettledWords);
    
    document.getElementById('speedSlider')?.addEventListener('input', function(e) {
        animationSpeed = parseFloat(e.target.value);
    });
    
    document.getElementById('densitySlider')?.addEventListener('input', function(e) {
        wordDensity = parseInt(e.target.value);
    });
    
    // Shape selector event listener
    if (shapeSelector) {
        shapeSelector.addEventListener('change', function(e) {
            currentShape = e.target.value;
            console.log('Shape changed to:', currentShape);
        });
    }
    
    // China map mode toggle
    if (chinaMapBtn) {
        chinaMapBtn.addEventListener('click', function() {
            chinaMapMode = !chinaMapMode;
            mapPointIndex = 0; // Reset map point index
            this.textContent = chinaMapMode ? 'China Map: ON' : 'China Map: OFF';
            this.style.background = chinaMapMode ? 
                'linear-gradient(135deg, rgba(255, 99, 132, 0.9), rgba(255, 159, 64, 0.9))' : 
                'linear-gradient(135deg, rgba(34, 193, 195, 0.9), rgba(253, 187, 45, 0.9))';
            this.style.boxShadow = chinaMapMode ? 
                '0 4px 15px rgba(255, 99, 132, 0.4)' : 
                '0 4px 15px rgba(34, 193, 195, 0.4)';
            console.log('China map mode:', chinaMapMode);
        });
    }
}

// Main game loop
// Optimized game loop for animation with reduced reflows
let frameCount = 0;
let lastPerformanceTime = 0;
const FRAME_THROTTLE = 1000 / 30; // Cap at 30fps for better performance

function gameLoop() {
    if (!isAnimationRunning) {
        requestAnimationFrame(gameLoop);
        return;
    }
    
    const now = performance.now();
    const elapsed = now - lastPerformanceTime;
    
    // Throttle frame rate for better performance
    if (elapsed < FRAME_THROTTLE) {
        requestAnimationFrame(gameLoop);
        return;
    }
    
    lastPerformanceTime = now;
    frameCount++;
    
    // Cache container reference to avoid repeated DOM lookups
    const container = document.getElementById('fallingWordsContainer');
    if (!container) {
        requestAnimationFrame(gameLoop);
        return;
    }
    
    const containerHeight = container.offsetHeight;
    
    // Generate new words in sequence - start next word when previous word has fallen some distance
    const currentTime = Date.now();
    if (currentTime - lastWordTime > wordDensity && fallingWords.length < 5) {
        // Check if we should create a new word based on the position of existing words
        let shouldCreateWord = true;
        if (fallingWords.length > 0) {
             // Only create new word if the most recent word has fallen at least 20px
              const lastWord = fallingWords[fallingWords.length - 1];
              const lastWordTop = parseFloat(lastWord.style.top) || 0;
              shouldCreateWord = lastWordTop > 20;
         }
        
        if (shouldCreateWord) {
            // Create word at a fixed horizontal position for ordered appearance
            const word = createWordAtPosition();
            lastWordTime = currentTime;
        }
    }
    
    // Batch update positions with throttling to reduce reflows
    if (frameCount % 2 === 0) {
        for (let i = 0; i < fallingWords.length; i++) {
            const word = fallingWords[i];
            const currentTop = parseFloat(word.style.top) || 0;
            word.style.top = (currentTop + animationSpeed) + 'px';
        }
    }
    
    // Check for settling with reduced frequency
    if (frameCount % 3 === 0) {
        const wordsToSettle = [];
        for (let i = 0; i < fallingWords.length; i++) {
            const word = fallingWords[i];
            const wordTop = parseFloat(word.style.top) || 0;
            const wordHeight = word.offsetHeight || 30;
            
            if (wordTop + wordHeight >= containerHeight - 50) {
                wordsToSettle.push(word);
            }
        }
        
        // Batch process settling words
        for (let i = 0; i < wordsToSettle.length; i++) {
            settleWord(wordsToSettle[i]);
        }
    }
    
    // Reduce statistics update frequency and clean up excess words
    if (frameCount % 15 === 0) {
        updateStats();
        
        // Clean up excess settled words to prevent performance issues
        if (settledWords.length > 20) {
            const wordsToRemove = settledWords.splice(0, settledWords.length - 15);
            for (let i = 0; i < wordsToRemove.length; i++) {
                const word = wordsToRemove[i];
                if (word.parentNode) {
                    word.style.transition = 'opacity 0.5s ease-out';
                    word.style.opacity = '0';
                    setTimeout(() => {
                        if (word && word.parentNode) {
                            word.parentNode.removeChild(word);
                        }
                    }, 500);
                }
            }
        }
    }
    
    requestAnimationFrame(gameLoop);
}

// Add CSS animations
if (!document.getElementById('fallingWordsAnimations')) {
    const style = document.createElement('style');
    style.id = 'fallingWordsAnimations';
    style.textContent = `
        @keyframes diffusionGlow {
             0% {
                 filter: brightness(1) saturate(1.2) hue-rotate(0deg);
                 box-shadow: 0 0 30px rgba(138, 43, 226, 0.4), 0 0 60px rgba(138, 43, 226, 0.2), 0 0 90px rgba(138, 43, 226, 0.1), 0 4px 15px rgba(0, 0, 0, 0.1);
             }
             50% {
                 filter: brightness(1.1) saturate(1.4) hue-rotate(10deg);
                 box-shadow: 0 0 35px rgba(255, 20, 147, 0.5), 0 0 70px rgba(255, 20, 147, 0.3), 0 0 105px rgba(255, 20, 147, 0.15), 0 4px 20px rgba(0, 0, 0, 0.15);
             }
             100% {
                 filter: brightness(1.05) saturate(1.3) hue-rotate(-5deg);
                 box-shadow: 0 0 32px rgba(34, 193, 195, 0.45), 0 0 64px rgba(34, 193, 195, 0.25), 0 0 96px rgba(34, 193, 195, 0.12), 0 4px 18px rgba(0, 0, 0, 0.12);
             }
         }
        @keyframes glow {
            0% { box-shadow: 0 4px 15px rgba(138, 43, 226, 0.3); }
            100% { box-shadow: 0 6px 25px rgba(138, 43, 226, 0.6); }
        }
        @keyframes explode {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.7; filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.8)) brightness(1.3); }
            100% { transform: scale(0); opacity: 0; }
        }
        .falling-word:hover {
             transform: scale(1.05) !important;
             box-shadow: 0 0 20px rgba(138, 43, 226, 0.6), 0 0 40px rgba(138, 43, 226, 0.4), 0 0 60px rgba(138, 43, 226, 0.2) !important;
             transition: all 0.3s ease !important;
        }
        .settled {
            cursor: pointer;
            opacity: 0.85;
        }
        .settled:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.6), 0 0 40px rgba(138, 43, 226, 0.4), 0 0 60px rgba(138, 43, 226, 0.2) !important;
            transition: all 0.3s ease !important;
        }
    `;
    document.head.appendChild(style);
}

// Add interactive effects to the word cloud image
function addWordCloudInteractivity(wordCloudImg) {
    if (wordCloudImg) {
        // Hover effects
        wordCloudImg.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.filter = 'brightness(1.1) drop-shadow(0 0 20px rgba(102, 126, 234, 0.6))';
        });
        
        wordCloudImg.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'brightness(1) drop-shadow(0 0 10px rgba(102, 126, 234, 0.3))';
        });
        
        // Click effects
            wordCloudImg.addEventListener('click', function(e) {
                // Create ripple effect
                createRippleEffect(e, this);
                
                // Pulse animation
                this.style.animation = 'wordCloudPulse 0.6s ease-out';
                setTimeout(() => {
                    this.style.animation = '';
                }, 600);
            });
            
            // Add CSS animation for pulse effect
            if (!document.getElementById('wordCloudAnimations')) {
                const style = document.createElement('style');
                style.id = 'wordCloudAnimations';
                style.textContent = `
                    @keyframes wordCloudPulse {
                        0% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 10px rgba(102, 126, 234, 0.3)); }
                        50% { transform: scale(1.1); filter: brightness(1.3) drop-shadow(0 0 30px rgba(102, 126, 234, 0.8)); }
                        100% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 10px rgba(102, 126, 234, 0.3)); }
                    }
                    @keyframes ripple {
                        0% { transform: scale(0); opacity: 1; }
                        100% { transform: scale(4); opacity: 0; }
                    }
                    .ripple {
                        position: absolute;
                        border-radius: 50%;
                        background: radial-gradient(circle, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.4) 100%);
                        transform: scale(0);
                        animation: ripple 0.6s linear;
                        pointer-events: none;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    // Create ripple effect on click
    function createRippleEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.parentNode.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }


// Load word cloud data from JSON
async function loadWordCloudData() {
    try {
        const response = await fetch('wordcloud_data.json');
        if (response.ok) {
            const data = await response.json();
            console.log('Word cloud data loaded:', data);
            
            // Update the interactive word cloud with new data
            updateInteractiveWordCloud(data.words);
        }
    } catch (error) {
        console.log('Using default word cloud data');
    }
}

// Update interactive word cloud with Python-generated data
function updateInteractiveWordCloud(pythonData) {
    if (pythonData && pythonData.length > 0) {
        // Merge Python data with existing data
        const mergedData = [...pythonData.slice(0, 50)]; // Use top 50 words from Python
        
        // Update the existing word cloud chart
        if (wordCloudChart) {
            wordCloudChart.setOption({
                series: [{
                    data: mergedData
                }]
            });
        }
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    } else {
        notification.style.backgroundColor = '#3b82f6';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

let wordCloudChart;

// Sample data for word cloud
const wordCloudData = {
    all: [
        {name: 'chill', value: 1000},
        {name: 'citywalk', value: 900},
        {name: 'suburb', value: 600},
        {name: 'concert', value: 500},
        {name: 'hiking', value: 500},
        {name: 'homestay', value: 500},
        {name: 'BBQ', value: 400},
        {name: 'cost performance', value: 400},
        {name: 'fun', value: 300},
        {name: 'healing', value: 300},
        {name: 'niche', value: 300},
        {name: 'lie flat', value: 200}
    ],
    weibo: [
        {name: 'reverse tourism', value: 800},
        {name: 'May Day niche', value: 600},
        {name: 'avoid crowds', value: 500},
        {name: 'slow life', value: 450},
        {name: 'local travel', value: 400},
        {name: 'city walk', value: 350},
        {name: 'deep experience', value: 300},
        {name: 'cultural exploration', value: 250},
        {name: 'food hunting', value: 200},
        {name: 'photo check-in', value: 180}
    ],
    xiaohongshu: [
        {name: 'reverse tourism', value: 900},
        {name: 'May Day niche', value: 750},
        {name: 'avoid crowds', value: 650},
        {name: 'slow life', value: 600},
        {name: 'local travel', value: 550},
        {name: 'city walk', value: 500},
        {name: 'deep experience', value: 450},
        {name: 'cultural exploration', value: 400},
        {name: 'food hunting', value: 350},
        {name: 'photo check-in', value: 300}
    ],
    douyin: [
        {name: 'reverse tourism', value: 700},
        {name: 'May Day niche', value: 550},
        {name: 'avoid crowds', value: 450},
        {name: 'slow life', value: 400},
        {name: 'local travel', value: 380},
        {name: 'city walk', value: 350},
        {name: 'deep experience', value: 320},
        {name: 'cultural exploration', value: 300},
        {name: 'food hunting', value: 280},
        {name: 'photo check-in', value: 250}
    ],
    wechat: [
        {name: 'reverse tourism', value: 400},
        {name: 'May Day niche', value: 350},
        {name: 'avoid crowds', value: 300},
        {name: 'slow life', value: 280},
        {name: 'local travel', value: 250},
        {name: 'city walk', value: 220},
        {name: 'deep experience', value: 200},
        {name: 'cultural exploration', value: 180},
        {name: 'food hunting', value: 160},
        {name: 'photo check-in', value: 140}
    ]
};

// Sample data for hashtag trends
const hashtagTrendData = {
    categories: ['May 1', 'May 2', 'May 3', 'May 4', 'May 5'],
    series: [
        {
            name: '#ReverseTravel',
            data: [1200, 1500, 1800, 1600, 1400],
            color: '#FF6B6B'
        },
        {
            name: '#MayDayNiche',
            data: [800, 1200, 1500, 1300, 1100],
            color: '#4ECDC4'
        },
        {
            name: '#AvoidCrowds',
            data: [600, 1000, 1200, 1100, 900],
            color: '#45B7D1'
        },
        {
            name: '#SlowLife',
            data: [500, 800, 950, 850, 750],
            color: '#96CEB4'
        },
        {
            name: '#LocalTravel',
            data: [400, 700, 900, 800, 700],
            color: '#FFEAA7'
        }
    ]
};

function initializeCharts() {
    // initWordCloudChart() disabled

}



function initWordCloudChart() {
    const chartDom = document.getElementById('wordCloudChart');
    wordCloudChart = echarts.init(chartDom);
    
    updateWordCloud('all');
}

function updateWordCloud(platform) {
    const data = wordCloudData[platform] || wordCloudData.all;
    console.log('Word cloud data:', data);
    console.log('Mask image path:', 'china-map.png');
    
    // Check if image can load
    const img = new Image();
    img.onload = function() {
        console.log('Mask image loaded successfully:', this.width, 'x', this.height);
    };
    img.onerror = function() {
        console.error('Failed to load mask image: china-map.png');
    };
    img.src = 'china-map.png';
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            show: true
        },
        series: [{
            type: 'wordCloud',
            gridSize: 2,
            sizeRange: [14, 80],
            rotationRange: [0, 0],
            shape: 'circle',
            maskImage: 'china-map.png',
            left: 'center',
            top: 'center',
            width: '70%',
            height: '80%',
            right: null,
            bottom: null,
            textStyle: {
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                color: function() {
                    const colors = [
                        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
                        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
                    ];
                    return colors[Math.floor(Math.random() * colors.length)];
                }
            },
            emphasis: {
                textStyle: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: data
        }]
    };
    
    wordCloudChart.setOption(option, true);
}



function setupEventListeners() {
    // Platform filter
    const platformFilter = document.getElementById('platformFilter');
    if (platformFilter) {
        platformFilter.addEventListener('change', function() {
            updateWordCloud(this.value);
        });
    }
    
    // Time range filter (placeholder for future implementation)
    const timeRange = document.getElementById('timeRange');
    if (timeRange) {
        timeRange.addEventListener('change', function() {
            // Future implementation for time-based filtering
            console.log('Time range changed to:', this.value);
        });
    }
    
    // Hashtag interactions
    const hashtags = document.querySelectorAll('.hashtag');
    hashtags.forEach(hashtag => {
        hashtag.addEventListener('click', function() {
            this.classList.toggle('selected');
            // Future implementation for hashtag filtering
        });
    });
}

function addPageAnimations() {
    // Animate stats cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Animate hashtag categories
    const hashtagCategories = document.querySelectorAll('.hashtag-category');
    hashtagCategories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            category.style.transition = 'all 0.6s ease';
            category.style.opacity = '1';
            category.style.transform = 'translateX(0)';
        }, 800 + index * 150);
    });
    

    
    // Animate insight cards
    const insightCards = document.querySelectorAll('.insight-card');
    insightCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 1500 + index * 200);
    });
}

// Handle window resize
window.addEventListener('resize', function() {
    if (wordCloudChart) {
        wordCloudChart.resize();
    }

});

// Export chart functionality
function exportChart(chartInstance, filename) {
    if (chartInstance) {
        const url = chartInstance.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
        });
        
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
    }
}

// Add export buttons functionality (if needed)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 's':
                e.preventDefault();
                exportChart(wordCloudChart, 'word-cloud.png');
                break;
            case 'e':
                e.preventDefault();
                // Hashtag chart removed
                break;
        }
    }
});
