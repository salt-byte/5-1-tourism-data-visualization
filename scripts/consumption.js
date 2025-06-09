// Consumption Analysis - Polar Chart

// Global variable to track current click handler
let currentClickHandler = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initPolarChart();
});

// Initialize polar chart with enhanced interactivity
function initPolarChart() {
    const chartDom = document.getElementById('polarChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    const option = {
        title: {
            text: 'Emerging Tourism Consumption Trends',
            left: 'center',
            top: 20,
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#333'
            }
        },
        polar: {
            radius: [40, '75%']
        },
        radiusAxis: {
            max: 400,
            axisLabel: {
                formatter: '{value}%'
            }
        },
        angleAxis: {
            type: 'category',
            data: ['Heritage Tours', 'Night Tourism', 'Pet Travel', 'Camping Tours', 'Wellness Retreats'],
            startAngle: 75,
            axisLabel: {
                fontSize: 12,
                color: '#666'
            }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderColor: '#333',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 14
            },
            formatter: function(params) {
                return `<div style="padding: 10px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">${params.name}</div>
                    <div style="color: ${params.color};">Growth Rate: ${params.value}%</div>
                    <div style="font-size: 12px; color: #ccc; margin-top: 5px;">Click for details</div>
                </div>`;
            }
        },
        series: {
            type: 'bar',
            data: [162, 50, 80, 390, 30],
            coordinateSystem: 'polar',
            label: {
                show: true,
                position: 'middle',
                formatter: '{c}%',
                fontSize: 12,
                fontWeight: 'bold',
                color: '#fff'
            },
            itemStyle: {
                color: function(params) {
                    const colors = ['#E76CFD', '#74F9A6', '#69E8FF', '#FFAA60', '#FFFB7D'];
                    return colors[params.dataIndex];
                },
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    borderWidth: 3,
                    borderColor: '#fff'
                },
                label: {
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            }
        },
        animation: true,
        animationDuration: 2000,
        animationEasing: 'elasticOut'
    };
    
    myChart.setOption(option);
    
    // Add click interaction with bubble card
    myChart.on('click', function(params) {
        const trendData = {
            'Heritage Tours': {
                name: 'Heritage Tours',
                growth: '162%',
                description: 'Traditional culture experiences surge as travelers seek authentic connections. Ancient town visits spike 30% with free admission for reciting classics. Intangible cultural heritage themed tours see 132% booking increase, transforming cultural preservation into immersive travel experiences.',
                details: 'Tujia homestay data shows heritage-themed accommodations booking surge, with cultural immersion programs becoming standard offerings.'
            },
            'Night Tourism': {
                name: 'Night Tourism',
                growth: '50%',
                description: 'Urban nightlife transforms into cultural experiences as night tourism searches increase 50%. Market districts in Beijing and Suzhou see 220% hotel booking growth, while national night cultural consumption zones attract 75.95 million visitors during holidays.',
                details: 'Meituan Travel reports night tour searches up 50%, with cultural night markets becoming major tourism drivers.'
            },
            'Pet Travel': {
                name: 'Pet Travel',
                growth: '80%',
                description: 'Pet-friendly travel explodes with 80% booking increase for pet-tagged accommodations. Dog walking maps and pet snack packages become standard amenities as travelers refuse to leave their furry companions behind.',
                details: 'Tujia homestay data reveals pet-friendly properties now offer comprehensive pet services including specialized maps and welcome packages.'
            },
            'Camping Tours': {
                name: 'Camping Tours',
                growth: '390%',
                description: 'Outdoor camping experiences explosive 390% growth as travelers seek nature reconnection. Camping tent sales surge 116%, while wheeled coolers increase 400%. Outdoor sports equipment sees 32% growth, marking the outdoor revolution.',
                details: 'Hema data shows camping equipment sales skyrocketing, with Meituan Travel reporting 390% increase in leisure camping orders.'
            },
            'Wellness Retreats': {
                name: 'Wellness Retreats',
                growth: '30%',
                description: 'High-energy travel concept emerges as wellness retreats in Beijing Pinggu and other destinations achieve 30% revenue increase through yoga and meditation programs. Healing accommodations redefine luxury travel.',
                details: 'Therapeutic homestays integrate wellness programs, demonstrating how mindfulness tourism creates premium value propositions.'
            }
        };
        
        if (trendData[params.name]) {
            showTrendCard(trendData[params.name], params, myChart);
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// Show trend card with bubble effect
function showTrendCard(trendData, params, chart) {
    // Remove existing card and cleanup
    hideTrendCard();
    
    // Get click position on the chart
    const chartDom = document.getElementById('polarChart');
    const rect = chartDom.getBoundingClientRect();
    
    // Calculate position based on chart center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create card element
    const card = document.createElement('div');
    card.className = 'trend-bubble-card';
    card.innerHTML = `
        <div class="bubble-pointer"></div>
        <div class="card-header">
            <h3 class="card-title">${trendData.name}</h3>
            <div class="growth-badge">+${trendData.growth}</div>
            <button class="card-close" onclick="hideTrendCard()">&times;</button>
        </div>
        <div class="card-content">
            <div class="card-description">
                <h4>Trend Analysis</h4>
                <p>${trendData.description}</p>
            </div>
            <div class="card-details">
                <h4>Market Insights</h4>
                <p>${trendData.details}</p>
            </div>
        </div>
    `;
    
    // Position the card
    const cardWidth = 420;
    const cardHeight = 400; // Increased height
    let finalX = centerX + 100;
    let finalY = centerY - cardHeight / 2;
    
    // Adjust position if card goes off screen
    if (finalX + cardWidth > window.innerWidth) {
        finalX = centerX - cardWidth - 100;
    }
    if (finalY < 20) {
        finalY = 20;
    }
    if (finalY + cardHeight > window.innerHeight) {
        finalY = window.innerHeight - cardHeight - 20;
    }
    
    card.style.left = finalX + 'px';
    card.style.top = finalY + 'px';
    
    // Create dashed line connection
    const connection = document.createElement('div');
    connection.className = 'trend-connection';
    
    const lineLength = Math.sqrt(Math.pow(finalX - centerX, 2) + Math.pow(finalY + cardHeight/2 - centerY, 2));
    const angle = Math.atan2(finalY + cardHeight/2 - centerY, finalX - centerX) * 180 / Math.PI;
    
    connection.style.width = lineLength + 'px';
    connection.style.left = centerX + 'px';
    connection.style.top = centerY + 'px';
    connection.style.transform = `rotate(${angle}deg)`;
    connection.style.transformOrigin = '0 50%';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .trend-bubble-card {
            position: fixed;
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%);
            border-radius: 25px;
            box-shadow: 0 15px 40px rgba(34, 197, 94, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1);
            z-index: 1000;
            width: 420px;
            max-height: 350px;
            overflow: hidden;
            animation: bubbleSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .bubble-pointer {
            position: absolute;
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-bottom: 20px solid rgba(34, 197, 94, 0.2);
            left: -15px;
            top: 50%;
            transform: translateY(-50%) rotate(-90deg);
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
        
        .trend-connection {
            position: fixed;
            height: 1px;
            background: linear-gradient(90deg, 
                rgba(34, 197, 94, 0.2) 0%, 
                rgba(147, 51, 234, 0.15) 50%, 
                rgba(34, 197, 94, 0.2) 100%);
            border-top: 1px dashed rgba(255, 255, 255, 0.2);
            z-index: 999;
            animation: connectionDraw 0.6s ease-out;
        }
        
        @keyframes connectionDraw {
            from { width: 0; }
            to { width: 100%; }
        }
        
        @keyframes bubbleSlideIn {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .card-header {
            padding: 20px 25px 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .card-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .growth-badge {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
        }
        
        .card-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        
        .card-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }
        
        .card-content {
            padding: 20px 25px;
            color: rgba(255, 255, 255, 0.9);
            max-height: 280px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }
        
        .card-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .card-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
        }
        
        .card-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
        }
        
        .card-content::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
        }
        
        .card-description h4,
        .card-details h4 {
            margin: 0 0 8px 0;
            font-size: 14px;
            font-weight: 600;
            color: #22c55e;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .card-description p,
        .card-details p {
            margin: 0 0 15px 0;
            font-size: 13px;
            line-height: 1.5;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .card-details {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 15px;
        }
    `;
    
    // Remove any existing elements first
    hideTrendCard();
    
    // Add ID to style for easier cleanup
    style.id = 'trend-card-styles';
    
    // Add elements to page
    document.head.appendChild(style);
    document.body.appendChild(connection);
    document.body.appendChild(card);
    
    // Add click outside to close with proper cleanup
    currentClickHandler = function(e) {
        if (!card.contains(e.target)) {
            hideTrendCard();
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', currentClickHandler);
    }, 100);
}

// Hide trend card
function hideTrendCard() {
    const existingCard = document.querySelector('.trend-bubble-card');
    const existingConnection = document.querySelector('.trend-connection');
    const existingStyle = document.getElementById('trend-card-styles');
    
    if (existingCard) {
        existingCard.remove();
    }
    if (existingConnection) {
        existingConnection.remove();
    }
    if (existingStyle) {
        existingStyle.remove();
    }
    
    // Remove current click listener
    if (currentClickHandler) {
        document.removeEventListener('click', currentClickHandler);
        currentClickHandler = null;
    }
}

// Initialize booking rates chart with enhanced interactivity
function initBookingChart() {
    const chartDom = document.getElementById('bookingChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    const option = {
        title: {
            text: 'Booking Rates by City',
            left: 'center',
            textStyle: {
                fontSize: 14,
                fontWeight: 'bold',
                color: '#333'
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderColor: '#333',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 12
            },
            formatter: function(params) {
                const param = params[0];
                return `<div style="padding: 8px;">
                    <div style="font-weight: bold; margin-bottom: 3px;">${param.name}</div>
                    <div style="color: ${param.color};">预订率: ${param.value}%</div>
                    <div style="font-size: 10px; color: #ccc; margin-top: 3px;">点击查看详情</div>
                </div>`;
            }
        },
        xAxis: {
            type: 'category',
            data: ['Haibei', 'Diqing', 'Liuzhou', 'Shaoyang', 'Puer', 'Dandong'],
            axisLabel: {
                rotate: 45,
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            max: 100,
            axisLabel: {
                formatter: '{value}%'
            }
        },
        series: [{
            type: 'bar',
            data: [84, 74, 73, 65, 58, 52],
            itemStyle: {
                color: function(params) {
                    const colors = ['#E76CFD', '#74F9A6', '#69E8FF', '#FFAA60', '#FFFB7D', '#FF6FBD'];
                    return colors[params.dataIndex];
                },
                shadowBlur: 8,
                shadowColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 15,
                    shadowColor: 'rgba(0, 0, 0, 0.4)',
                    borderWidth: 2,
                    borderColor: '#fff'
                }
            },
            label: {
                show: true,
                position: 'top',
                formatter: '{c}%',
                fontSize: 10
            },
            animationDelay: function(idx) {
                return idx * 200;
            }
        }],
        animation: true,
        animationDuration: 1500,
        animationEasing: 'bounceOut'
    };
    
    myChart.setOption(option);
    
    // Add click interaction
    myChart.on('click', function(params) {
        const cityInfo = {
            'Haibei': '海北：84%预订率，高原湖泊美景吸引众多游客',
            'Diqing': '迪庆：74%预订率，香格里拉的神秘魅力',
            'Liuzhou': '柳州：73%预订率，螺蛳粉之乡的独特风情',
            'Shaoyang': '邵阳：65%预订率，湖南山水的宁静之美',
            'Puer': '普洱：58%预订率，茶马古道的历史韵味',
            'Dandong': '丹东：52%预订率，边境城市的异域风情'
        };
        alert(cityInfo[params.name] || '点击了：' + params.name);
    });
    
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// Show trend card with bubble effect
function showTrendCard(trendData, params, chart) {
    // Remove existing card and cleanup
    hideTrendCard();
    
    // Get click position on the chart
    const chartDom = document.getElementById('polarChart');
    const rect = chartDom.getBoundingClientRect();
    
    // Calculate position based on chart center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create card element
    const card = document.createElement('div');
    card.className = 'trend-bubble-card';
    card.innerHTML = `
        <div class="bubble-pointer"></div>
        <div class="card-header">
            <h3 class="card-title">${trendData.name}</h3>
            <div class="growth-badge">+${trendData.growth}</div>
            <button class="card-close" onclick="hideTrendCard()">&times;</button>
        </div>
        <div class="card-content">
            <div class="card-description">
                <h4>Trend Analysis</h4>
                <p>${trendData.description}</p>
            </div>
            <div class="card-details">
                <h4>Market Insights</h4>
                <p>${trendData.details}</p>
            </div>
        </div>
    `;
    
    // Position the card
    const cardWidth = 420;
    const cardHeight = 400; // Increased height
    let finalX = centerX + 100;
    let finalY = centerY - cardHeight / 2;
    
    // Adjust position if card goes off screen
    if (finalX + cardWidth > window.innerWidth) {
        finalX = centerX - cardWidth - 100;
    }
    if (finalY < 20) {
        finalY = 20;
    }
    if (finalY + cardHeight > window.innerHeight) {
        finalY = window.innerHeight - cardHeight - 20;
    }
    
    card.style.left = finalX + 'px';
    card.style.top = finalY + 'px';
    
    // Create dashed line connection
    const connection = document.createElement('div');
    connection.className = 'trend-connection';
    
    const lineLength = Math.sqrt(Math.pow(finalX - centerX, 2) + Math.pow(finalY + cardHeight/2 - centerY, 2));
    const angle = Math.atan2(finalY + cardHeight/2 - centerY, finalX - centerX) * 180 / Math.PI;
    
    connection.style.width = lineLength + 'px';
    connection.style.left = centerX + 'px';
    connection.style.top = centerY + 'px';
    connection.style.transform = `rotate(${angle}deg)`;
    connection.style.transformOrigin = '0 50%';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .trend-bubble-card {
            position: fixed;
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%);
            border-radius: 25px;
            box-shadow: 0 15px 40px rgba(34, 197, 94, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1);
            z-index: 1000;
            width: 420px;
            max-height: 350px;
            overflow: hidden;
            animation: bubbleSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .bubble-pointer {
            position: absolute;
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-bottom: 20px solid rgba(34, 197, 94, 0.2);
            left: -15px;
            top: 50%;
            transform: translateY(-50%) rotate(-90deg);
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
        
        .trend-connection {
            position: fixed;
            height: 1px;
            background: linear-gradient(90deg, 
                rgba(34, 197, 94, 0.2) 0%, 
                rgba(147, 51, 234, 0.15) 50%, 
                rgba(34, 197, 94, 0.2) 100%);
            border-top: 1px dashed rgba(255, 255, 255, 0.2);
            z-index: 999;
            animation: connectionDraw 0.6s ease-out;
        }
        
        @keyframes connectionDraw {
            from { width: 0; }
            to { width: 100%; }
        }
        
        @keyframes bubbleSlideIn {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .card-header {
            padding: 20px 25px 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .card-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .growth-badge {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
        }
        
        .card-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        
        .card-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }
        
        .card-content {
            padding: 20px 25px;
            color: rgba(255, 255, 255, 0.9);
            max-height: 280px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }
        
        .card-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .card-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
        }
        
        .card-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
        }
        
        .card-content::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
        }
        
        .card-description h4,
        .card-details h4 {
            margin: 0 0 8px 0;
            font-size: 14px;
            font-weight: 600;
            color: #22c55e;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .card-description p,
        .card-details p {
            margin: 0 0 15px 0;
            font-size: 13px;
            line-height: 1.5;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .card-details {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 15px;
        }
    `;
    
    // Remove any existing elements first
    hideTrendCard();
    
    // Add ID to style for easier cleanup
    style.id = 'trend-card-styles';
    
    // Add elements to page
    document.head.appendChild(style);
    document.body.appendChild(connection);
    document.body.appendChild(card);
    
    // Add click outside to close with proper cleanup
    currentClickHandler = function(e) {
        if (!card.contains(e.target)) {
            hideTrendCard();
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', currentClickHandler);
    }, 100);
}

// Hide trend card
function hideTrendCard() {
    const existingCard = document.querySelector('.trend-bubble-card');
    const existingConnection = document.querySelector('.trend-connection');
    const existingStyle = document.getElementById('trend-card-styles');
    
    if (existingCard) {
        existingCard.remove();
    }
    if (existingConnection) {
        existingConnection.remove();
    }
    if (existingStyle) {
        existingStyle.remove();
    }
    
    // Remove current click listener
    if (currentClickHandler) {
        document.removeEventListener('click', currentClickHandler);
        currentClickHandler = null;
    }
}

// Initialize growth chart with enhanced interactivity
function initGrowthChart() {
    const chartDom = document.getElementById('growthChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    const option = {
        title: {
            text: 'YoY Growth Rate',
            left: 'center',
            textStyle: {
                fontSize: 14,
                fontWeight: 'bold',
                color: '#333'
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderColor: '#333',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 12
            },
            formatter: function(params) {
                const param = params[0];
                return `<div style="padding: 8px;">
                    <div style="font-weight: bold; margin-bottom: 3px;">${param.name}</div>
                    <div style="color: ${param.color};">同比增长: +${param.value}%</div>
                    <div style="font-size: 10px; color: #ccc; margin-top: 3px;">点击查看趋势分析</div>
                </div>`;
            }
        },
        xAxis: {
            type: 'category',
            data: ['Shaoyang', 'Puer', 'Dandong'],
            axisLabel: {
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '+{value}%'
            }
        },
        series: [{
            type: 'line',
            data: [60, 49, 16],
            itemStyle: {
                color: '#B5FF4D',
                shadowBlur: 10,
                shadowColor: 'rgba(181, 255, 77, 0.5)'
            },
            lineStyle: {
                color: '#B5FF4D',
                width: 3,
                shadowBlur: 8,
                shadowColor: 'rgba(181, 255, 77, 0.3)'
            },
            symbol: 'circle',
            symbolSize: 8,
            emphasis: {
                itemStyle: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(181, 255, 77, 0.8)',
                    borderWidth: 3,
                    borderColor: '#fff'
                },
                symbolSize: 12
            },
            label: {
                show: true,
                position: 'top',
                formatter: '+{c}%',
                fontSize: 10,
                color: '#B5FF4D'
            },
            animationDelay: function(idx) {
                return idx * 300;
            }
        }],
        animation: true,
        animationDuration: 2000,
        animationEasing: 'cubicOut'
    };
    
    myChart.setOption(option);
    
    // Add click interaction
    myChart.on('click', function(params) {
        const growthInfo = {
            'Shaoyang': '邵阳：同比增长60%，湖南山区旅游快速发展',
            'Puer': '普洱：同比增长49%，茶文化旅游持续升温',
            'Dandong': '丹东：同比增长16%，边境旅游稳步增长'
        };
        alert(growthInfo[params.name] || '点击了：' + params.name);
    });
    
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// Show trend card with bubble effect
function showTrendCard(trendData, params, chart) {
    // Remove existing card and cleanup
    hideTrendCard();
    
    // Get click position on the chart
    const chartDom = document.getElementById('polarChart');
    const rect = chartDom.getBoundingClientRect();
    
    // Calculate position based on chart center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create card element
    const card = document.createElement('div');
    card.className = 'trend-bubble-card';
    card.innerHTML = `
        <div class="bubble-pointer"></div>
        <div class="card-header">
            <h3 class="card-title">${trendData.name}</h3>
            <div class="growth-badge">+${trendData.growth}</div>
            <button class="card-close" onclick="hideTrendCard()">&times;</button>
        </div>
        <div class="card-content">
            <div class="card-description">
                <h4>Trend Analysis</h4>
                <p>${trendData.description}</p>
            </div>
            <div class="card-details">
                <h4>Market Insights</h4>
                <p>${trendData.details}</p>
            </div>
        </div>
    `;
    
    // Position the card
    const cardWidth = 420;
    const cardHeight = 400; // Increased height
    let finalX = centerX + 100;
    let finalY = centerY - cardHeight / 2;
    
    // Adjust position if card goes off screen
    if (finalX + cardWidth > window.innerWidth) {
        finalX = centerX - cardWidth - 100;
    }
    if (finalY < 20) {
        finalY = 20;
    }
    if (finalY + cardHeight > window.innerHeight) {
        finalY = window.innerHeight - cardHeight - 20;
    }
    
    card.style.left = finalX + 'px';
    card.style.top = finalY + 'px';
    
    // Create dashed line connection
    const connection = document.createElement('div');
    connection.className = 'trend-connection';
    
    const lineLength = Math.sqrt(Math.pow(finalX - centerX, 2) + Math.pow(finalY + cardHeight/2 - centerY, 2));
    const angle = Math.atan2(finalY + cardHeight/2 - centerY, finalX - centerX) * 180 / Math.PI;
    
    connection.style.width = lineLength + 'px';
    connection.style.left = centerX + 'px';
    connection.style.top = centerY + 'px';
    connection.style.transform = `rotate(${angle}deg)`;
    connection.style.transformOrigin = '0 50%';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .trend-bubble-card {
            position: fixed;
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%);
            border-radius: 25px;
            box-shadow: 0 15px 40px rgba(34, 197, 94, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1);
            z-index: 1000;
            width: 420px;
            max-height: 350px;
            overflow: hidden;
            animation: bubbleSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .bubble-pointer {
            position: absolute;
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-bottom: 20px solid rgba(34, 197, 94, 0.2);
            left: -15px;
            top: 50%;
            transform: translateY(-50%) rotate(-90deg);
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
        
        .trend-connection {
            position: fixed;
            height: 1px;
            background: linear-gradient(90deg, 
                rgba(34, 197, 94, 0.2) 0%, 
                rgba(147, 51, 234, 0.15) 50%, 
                rgba(34, 197, 94, 0.2) 100%);
            border-top: 1px dashed rgba(255, 255, 255, 0.2);
            z-index: 999;
            animation: connectionDraw 0.6s ease-out;
        }
        
        @keyframes connectionDraw {
            from { width: 0; }
            to { width: 100%; }
        }
        
        @keyframes bubbleSlideIn {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .card-header {
            padding: 20px 25px 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .card-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .growth-badge {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
        }
        
        .card-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        
        .card-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }
        
        .card-content {
            padding: 20px 25px;
            color: rgba(255, 255, 255, 0.9);
            max-height: 280px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }
        
        .card-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .card-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
        }
        
        .card-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
        }
        
        .card-content::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
        }
        
        .card-description h4,
        .card-details h4 {
            margin: 0 0 8px 0;
            font-size: 14px;
            font-weight: 600;
            color: #22c55e;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .card-description p,
        .card-details p {
            margin: 0 0 15px 0;
            font-size: 13px;
            line-height: 1.5;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .card-details {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 15px;
        }
    `;
    
    // Remove any existing elements first
    hideTrendCard();
    
    // Add ID to style for easier cleanup
    style.id = 'trend-card-styles';
    
    // Add elements to page
    document.head.appendChild(style);
    document.body.appendChild(connection);
    document.body.appendChild(card);
    
    // Add click outside to close with proper cleanup
    currentClickHandler = function(e) {
        if (!card.contains(e.target)) {
            hideTrendCard();
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', currentClickHandler);
    }, 100);
}

// Hide trend card
function hideTrendCard() {
    const existingCard = document.querySelector('.trend-bubble-card');
    const existingConnection = document.querySelector('.trend-connection');
    const existingStyle = document.getElementById('trend-card-styles');
    
    if (existingCard) {
        existingCard.remove();
    }
    if (existingConnection) {
        existingConnection.remove();
    }
    if (existingStyle) {
        existingStyle.remove();
    }
    
    // Remove current click listener
    if (currentClickHandler) {
        document.removeEventListener('click', currentClickHandler);
        currentClickHandler = null;
    }
}

// Initialize trends chart with enhanced interactivity
function initTrendsChart() {
    const chartDom = document.getElementById('trendsChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    const option = {
        title: {
            text: 'Tourism Market Trends',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#333'
            }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderColor: '#333',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 14
            },
            formatter: function(params) {
                const percentage = ((params.value / 358) * 100).toFixed(1);
                return `<div style="padding: 10px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">${params.name}</div>
                    <div style="color: ${params.color};">增长率: ${params.value}%</div>
                    <div style="color: #ccc; font-size: 12px;">占比: ${percentage}%</div>
                    <div style="font-size: 12px; color: #ccc; margin-top: 5px;">点击查看详细分析</div>
                </div>`;
            }
        },
        legend: {
            orient: 'horizontal',
            bottom: 10,
            data: ['Rural Tourism Growth', 'B&B Booking Growth', 'Avoid Crowds Preference', 'Online Sharing Growth'],
            textStyle: {
                fontSize: 12
            }
        },
        series: [
            {
                name: 'Tourism Trends',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '45%'],
                data: [
                    {value: 20, name: 'Rural Tourism Growth', itemStyle: {color: '#E76CFD', shadowBlur: 10, shadowColor: 'rgba(231, 108, 253, 0.3)'}},
                    {value: 30, name: 'B&B Booking Growth', itemStyle: {color: '#74F9A6', shadowBlur: 10, shadowColor: 'rgba(116, 249, 166, 0.3)'}},
                    {value: 58, name: 'Avoid Crowds Preference', itemStyle: {color: '#69E8FF', shadowBlur: 10, shadowColor: 'rgba(105, 232, 255, 0.3)'}},
                    {value: 250, name: 'Online Sharing Growth', itemStyle: {color: '#FFAA60', shadowBlur: 10, shadowColor: 'rgba(255, 170, 96, 0.3)'}}
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 20,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        borderWidth: 3,
                        borderColor: '#fff'
                    },
                    label: {
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                label: {
                    show: true,
                    formatter: '{b}\n{c}%',
                    fontSize: 12
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function(idx) {
                    return Math.random() * 200;
                }
            }
        ],
        animation: true,
        animationDuration: 2000
    };
    
    myChart.setOption(option);
    
    // Add click interaction
    myChart.on('click', function(params) {
        const trendInfo = {
            'Rural Tourism Growth': '乡村旅游增长20%：回归自然，体验田园生活成为新趋势',
            'B&B Booking Growth': '民宿预订增长30%：个性化住宿体验越来越受欢迎',
            'Avoid Crowds Preference': '避开人群偏好58%：游客更倾向于选择小众目的地',
            'Online Sharing Growth': '在线分享增长250%：社交媒体改变了旅游分享方式'
        };
        alert(trendInfo[params.name] || '点击了：' + params.name);
    });
    
    // Add auto rotation effect
    let currentIndex = -1;
    setInterval(function() {
        const dataLen = option.series[0].data.length;
        // Cancel previous highlight
        myChart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: currentIndex
        });
        currentIndex = (currentIndex + 1) % dataLen;
        // Highlight current sector
        myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: currentIndex
        });
    }, 3000);
    
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// Show trend card with bubble effect
function showTrendCard(trendData, params, chart) {
    // Remove existing card and cleanup
    hideTrendCard();
    
    // Get click position on the chart
    const chartDom = document.getElementById('polarChart');
    const rect = chartDom.getBoundingClientRect();
    
    // Calculate position based on chart center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create card element
    const card = document.createElement('div');
    card.className = 'trend-bubble-card';
    card.innerHTML = `
        <div class="bubble-pointer"></div>
        <div class="card-header">
            <h3 class="card-title">${trendData.name}</h3>
            <div class="growth-badge">+${trendData.growth}</div>
            <button class="card-close" onclick="hideTrendCard()">&times;</button>
        </div>
        <div class="card-content">
            <div class="card-description">
                <h4>Trend Analysis</h4>
                <p>${trendData.description}</p>
            </div>
            <div class="card-details">
                <h4>Market Insights</h4>
                <p>${trendData.details}</p>
            </div>
        </div>
    `;
    
    // Position the card
    const cardWidth = 420;
    const cardHeight = 400; // Increased height
    let finalX = centerX + 100;
    let finalY = centerY - cardHeight / 2;
    
    // Adjust position if card goes off screen
    if (finalX + cardWidth > window.innerWidth) {
        finalX = centerX - cardWidth - 100;
    }
    if (finalY < 20) {
        finalY = 20;
    }
    if (finalY + cardHeight > window.innerHeight) {
        finalY = window.innerHeight - cardHeight - 20;
    }
    
    card.style.left = finalX + 'px';
    card.style.top = finalY + 'px';
    
    // Create dashed line connection
    const connection = document.createElement('div');
    connection.className = 'trend-connection';
    
    const lineLength = Math.sqrt(Math.pow(finalX - centerX, 2) + Math.pow(finalY + cardHeight/2 - centerY, 2));
    const angle = Math.atan2(finalY + cardHeight/2 - centerY, finalX - centerX) * 180 / Math.PI;
    
    connection.style.width = lineLength + 'px';
    connection.style.left = centerX + 'px';
    connection.style.top = centerY + 'px';
    connection.style.transform = `rotate(${angle}deg)`;
    connection.style.transformOrigin = '0 50%';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .trend-bubble-card {
            position: fixed;
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%);
            border-radius: 25px;
            box-shadow: 0 15px 40px rgba(34, 197, 94, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1);
            z-index: 1000;
            width: 420px;
            max-height: 350px;
            overflow: hidden;
            animation: bubbleSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .bubble-pointer {
            position: absolute;
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-bottom: 20px solid rgba(34, 197, 94, 0.2);
            left: -15px;
            top: 50%;
            transform: translateY(-50%) rotate(-90deg);
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
        
        .trend-connection {
            position: fixed;
            height: 1px;
            background: linear-gradient(90deg, 
                rgba(34, 197, 94, 0.2) 0%, 
                rgba(147, 51, 234, 0.15) 50%, 
                rgba(34, 197, 94, 0.2) 100%);
            border-top: 1px dashed rgba(255, 255, 255, 0.2);
            z-index: 999;
            animation: connectionDraw 0.6s ease-out;
        }
        
        @keyframes connectionDraw {
            from { width: 0; }
            to { width: 100%; }
        }
        
        @keyframes bubbleSlideIn {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .card-header {
            padding: 20px 25px 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .card-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .growth-badge {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
        }
        
        .card-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        
        .card-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }
        
        .card-content {
            padding: 20px 25px;
            color: rgba(255, 255, 255, 0.9);
            max-height: 280px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }
        
        .card-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .card-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
        }
        
        .card-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
        }
        
        .card-content::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
        }
        
        .card-description h4,
        .card-details h4 {
            margin: 0 0 8px 0;
            font-size: 14px;
            font-weight: 600;
            color: #22c55e;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .card-description p,
        .card-details p {
            margin: 0 0 15px 0;
            font-size: 13px;
            line-height: 1.5;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .card-details {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 15px;
        }
    `;
    
    // Remove any existing elements first
    hideTrendCard();
    
    // Add ID to style for easier cleanup
    style.id = 'trend-card-styles';
    
    // Add elements to page
    document.head.appendChild(style);
    document.body.appendChild(connection);
    document.body.appendChild(card);
    
    // Add click outside to close with proper cleanup
    currentClickHandler = function(e) {
        if (!card.contains(e.target)) {
            hideTrendCard();
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', currentClickHandler);
    }, 100);
}

// Hide trend card
function hideTrendCard() {
    const existingCard = document.querySelector('.trend-bubble-card');
    const existingConnection = document.querySelector('.trend-connection');
    const existingStyle = document.getElementById('trend-card-styles');
    
    if (existingCard) {
        existingCard.remove();
    }
    if (existingConnection) {
        existingConnection.remove();
    }
    if (existingStyle) {
        existingStyle.remove();
    }
    
    // Remove current click listener
    if (currentClickHandler) {
        document.removeEventListener('click', currentClickHandler);
        currentClickHandler = null;
    }
}