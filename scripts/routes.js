// Travel Routes Page JavaScript

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initChinaMapChart();
    initRouteControls();
    addTableStyles();
});

function initRouteControls() {
    // Add event listeners for route type filters if needed
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.dataset.filter || 'all';
            updateChinaMapChart(filterType);
            
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Global chart instance
let chinaMapChart;

// 火车路线数据
const trainRoutes = [
    { 
        coords: [[113.2644, 23.1291], [114.0579, 22.5431]], 
        fromName: 'Guangzhou South', 
        toName: 'Shenzhen North', 
        region: 'south', 
        value: 280000,
        distance: '140km',
        time: '30min'
    },
    { 
        coords: [[102.7123, 25.0389], [103.7976, 25.5031]], 
        fromName: 'Kunming', 
        toName: 'Qujing', 
        region: 'southwest', 
        value: 250000,
        distance: '135km',
        time: '1h'
    },
    { 
        coords: [[116.3683, 39.8648], [117.2008, 39.0842]], 
        fromName: 'Beijing South', 
        toName: 'Tianjin', 
        region: 'north', 
        value: 230000,
        distance: '120km',
        time: '30min'
    },
    { 
        coords: [[125.3245, 43.8868], [126.5502, 43.8436]], 
        fromName: 'Changchun', 
        toName: 'Jilin City', 
        region: 'north', 
        value: 220000,
        distance: '111km',
        time: '45min'
    },
    { 
        coords: [[102.7123, 25.0389], [102.5437, 24.3505]], 
        fromName: 'Kunming', 
        toName: 'Yuxi', 
        region: 'southwest', 
        value: 210000,
        distance: '102km',
        time: '40min'
    },
    { 
        coords: [[106.5516, 29.5630], [108.4080, 30.8073]], 
        fromName: 'Chongqing North', 
        toName: 'Wanzhou North', 
        region: 'southwest', 
        value: 200000,
        distance: '228km',
        time: '1.5h'
    },
    { 
        coords: [[106.7135, 26.5783], [105.2840, 27.3017]], 
        fromName: 'Guiyang North', 
        toName: 'Bijie', 
        region: 'southwest', 
        value: 190000,
        distance: '170km',
        time: '1h'
    },
    { 
        coords: [[120.6194, 31.2990], [121.4737, 31.2304]], 
        fromName: 'Suzhou', 
        toName: 'Shanghai', 
        region: 'south', 
        value: 180000,
        distance: '84km',
        time: '25min'
    },
    { 
        coords: [[104.0657, 30.5728], [104.6794, 31.4677]], 
        fromName: 'Chengdu East', 
        toName: 'Mianyang', 
        region: 'southwest', 
        value: 170000,
        distance: '104km',
        time: '40min'
    },
    { 
        coords: [[112.9388, 28.2282], [113.1519, 27.8274]], 
        fromName: 'Changsha', 
        toName: 'Zhuzhou', 
        region: 'south', 
        value: 160000,
        distance: '40km',
        time: '20min'
    }
];

// 城市数据
const cityData = [
    { name: 'Guangzhou South', value: [113.2644, 23.1291, 280] },
    { name: 'Shenzhen North', value: [114.0579, 22.5431, 280] },
    { name: 'Kunming', value: [102.7123, 25.0389, 460] },
    { name: 'Qujing', value: [103.7976, 25.5031, 250] },
    { name: 'Beijing South', value: [116.3683, 39.8648, 230] },
    { name: 'Tianjin', value: [117.2008, 39.0842, 230] },
    { name: 'Changchun', value: [125.3245, 43.8868, 220] },
    { name: 'Jilin City', value: [126.5502, 43.8436, 220] },
    { name: 'Yuxi', value: [102.5437, 24.3505, 210] },
    { name: 'Chongqing North', value: [106.5516, 29.5630, 200] },
    { name: 'Wanzhou North', value: [108.4080, 30.8073, 200] },
    { name: 'Guiyang North', value: [106.7135, 26.5783, 190] },
    { name: 'Bijie', value: [105.2840, 27.3017, 190] },
    { name: 'Suzhou', value: [120.6194, 31.2990, 180] },
    { name: 'Shanghai', value: [121.4737, 31.2304, 180] },
    { name: 'Chengdu East', value: [104.0657, 30.5728, 170] },
    { name: 'Mianyang', value: [104.6794, 31.4677, 170] },
    { name: 'Changsha', value: [112.9388, 28.2282, 160] },
    { name: 'Zhuzhou', value: [113.1519, 27.8274, 160] }
];

// Initialize China map chart
function initChinaMapChart() {
    const chartDom = document.getElementById('chinaMapChart');
    chinaMapChart = echarts.init(chartDom);
    
    // Show loading
    chinaMapChart.showLoading({
        text: '加载中国地图数据...',
        color: '#667eea',
        textColor: '#333',
        maskColor: 'rgba(255, 255, 255, 0.8)'
    });
    
    // Load China map and initialize from local file
    fetch('./geo.datav.aliyun.com:areas_v3:bound:100000_full.json')
        .then(response => response.json())
        .then(chinaGeoJson => {
            // Replace Chinese province names with English names in GeoJSON
            const provinceNameMap = {
                '北京市': 'Beijing',
                '天津市': 'Tianjin',
                '河北省': 'Hebei',
                '山西省': 'Shanxi',
                '内蒙古自治区': 'Inner Mongolia',
                '辽宁省': 'Liaoning',
                '吉林省': 'Jilin',
                '黑龙江省': 'Heilongjiang',
                '上海市': 'Shanghai',
                '江苏省': 'Jiangsu',
                '浙江省': 'Zhejiang',
                '安徽省': 'Anhui',
                '福建省': 'Fujian',
                '江西省': 'Jiangxi',
                '山东省': 'Shandong',
                '河南省': 'Henan',
                '湖北省': 'Hubei',
                '湖南省': 'Hunan',
                '广东省': 'Guangdong',
                '广西壮族自治区': 'Guangxi',
                '海南省': 'Hainan',
                '重庆市': 'Chongqing',
                '四川省': 'Sichuan',
                '贵州省': 'Guizhou',
                '云南省': 'Yunnan',
                '西藏自治区': 'Tibet',
                '陕西省': 'Shaanxi',
                '甘肃省': 'Gansu',
                '青海省': 'Qinghai',
                '宁夏回族自治区': 'Ningxia',
                '新疆维吾尔自治区': 'Xinjiang',
                '台湾省': 'Taiwan',
                '香港特别行政区': 'Hong Kong',
                '澳门特别行政区': 'Macao'
            };
            
            // Modify GeoJSON features to use English names
            if (chinaGeoJson.features) {
                chinaGeoJson.features.forEach(feature => {
                    if (feature.properties && feature.properties.name) {
                        const chineseName = feature.properties.name;
                        const englishName = provinceNameMap[chineseName];
                        if (englishName) {
                            feature.properties.name = englishName;
                            // Keep original Chinese name as backup
                            feature.properties.name_zh = chineseName;
                        }
                    }
                });
            }
            
            echarts.registerMap('china', chinaGeoJson);
            updateChinaMapChart('all');
            chinaMapChart.hideLoading();
        })
        .catch(() => {
            // Fallback: create simple chart without map
            updateChinaMapChart('all');
            chinaMapChart.hideLoading();
        });
    
    // Make chart responsive
    window.addEventListener('resize', function() {
        chinaMapChart.resize();
    });
}

// Update China map chart
function updateChinaMapChart(filterType) {
    let filteredRoutes = trainRoutes;
    let filteredCities = cityData;
    
    // Filter routes based on region
    if (filterType !== 'all') {
        filteredRoutes = trainRoutes.filter(route => route.region === filterType);
        
        // Filter cities based on filtered routes
        const routeCityNames = new Set();
        filteredRoutes.forEach(route => {
            routeCityNames.add(route.fromName);
            routeCityNames.add(route.toName);
        });
        filteredCities = cityData.filter(city => routeCityNames.has(city.name));
    }
    
    const option = {
        title: {
            text: 'Popular High-Speed Rail Routes During May Day Holiday 2025',
            subtext: 'Top 10 High-Speed Rail Routes Distribution Map in China',
            left: 'center',
            textStyle: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#333',
                textShadowColor: 'rgba(244, 114, 182, 0.3)',
                textShadowBlur: 10
            },
            subtextStyle: {
                color: '#666',
                fontSize: 14
            }
        },
        tooltip: {
            show: false
        },
        geo: {
            map: 'china',
            roam: true,
            zoom: 1.2,
            center: [104.114129, 37.550339],
            itemStyle: {
                areaColor: '#fce7f3',
                borderColor: 'rgba(244, 114, 182, 0.4)',
                borderWidth: 1.5
            },
            emphasis: {
                itemStyle: {
                    areaColor: '#fbcfe8'
                }
            },
            label: {
                show: false
            }
        },
        series: [
            {
                type: 'lines',
                coordinateSystem: 'geo',
                data: filteredRoutes,
                lineStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#fbbf24' },
                        { offset: 0.5, color: '#f59e0b' },
                        { offset: 1, color: '#d97706' }
                    ]),
                    width: 8,
                    opacity: 0.8,
                    curveness: 0.3
                },
                emphasis: {
                    lineStyle: {
                        width: 12,
                        opacity: 1
                    }
                },
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: '#f59e0b',
                    symbolSize: 8
                },
                zlevel: 2
            },
            {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: filteredCities,
                symbolSize: function(val) {
                    return Math.max(val[2] / 15, 8);
                },
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke',
                    color: 'rgba(245, 158, 11, 0.6)',
                    scale: 2.5
                },
                hoverAnimation: true,
                label: {
                    show: true,
                    position: 'bottom',
                    fontSize: 10,
                    color: '#333',
                    fontWeight: 'bold',
                    formatter: '{b}'
                },
                itemStyle: {
                    color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.8, [
                        { offset: 0, color: '#fde047' },
                        { offset: 0.7, color: '#f59e0b' },
                        { offset: 1, color: '#d97706' }
                    ]),
                    shadowBlur: 15,
                    shadowColor: 'rgba(245, 158, 11, 0.6)'
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.8, [
                            { offset: 0, color: '#fef3c7' },
                            { offset: 0.7, color: '#fbbf24' },
                            { offset: 1, color: '#f59e0b' }
                        ]),
                        shadowBlur: 20,
                        shadowColor: 'rgba(245, 158, 11, 0.8)'
                    }
                }
            }
        ]
    };
    
    chinaMapChart.setOption(option, true);
    
    // Add click event for lines
    chinaMapChart.off('click');
    chinaMapChart.on('click', function(params) {
        if (params.seriesType === 'lines') {
            const routeData = params.data;
            showRouteCard(routeData, params.event.offsetX, params.event.offsetY);
        }
    });
}

// Helper functions
function getCategoryColor(category) {
    const colors = {
        'tier1': '#ff6b6b',
        'reverse': '#feca57',
        'traditional': '#48dbfb',
        'emerging': '#ff9ff3'
    };
    return colors[category] || '#999';
}

function getCategoryName(category) {
    const names = {
        'tier1': 'Tier 1 Cities',
        'reverse': 'Reverse Tourism',
        'traditional': 'Traditional Routes',
        'emerging': 'Emerging Destinations'
    };
    return names[category] || 'Unknown';
}

function getRouteTypeColor(type) {
    const colors = {
        'reverse': '#feca57',
        'traditional': '#48dbfb',
        'emerging': '#ff9ff3'
    };
    return colors[type] || '#999';
}

// Initialize controls
function initRouteControls() {
    const routeTypeFilter = document.getElementById('routeType');
    const durationFilter = document.getElementById('duration');
    
    if (routeTypeFilter) {
        routeTypeFilter.addEventListener('change', function() {
            const selectedType = this.value;
            routeChart.showLoading();
            setTimeout(() => {
                updateRouteChart(selectedType);
                routeChart.hideLoading();
            }, 300);
        });
    }
    
    if (durationFilter) {
        durationFilter.addEventListener('change', function() {
            // For demo purposes, just show loading effect
            routeChart.showLoading();
            setTimeout(() => {
                routeChart.hideLoading();
            }, 300);
        });
    }
}

// Add table styles
function addTableStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .table-container {
            overflow-x: auto;
            border-radius: 10px;
        }
        
        .route-type {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .route-type.reverse {
            background: linear-gradient(135deg, #feca57, #ff9ff3);
            color: white;
        }
        
        .route-type.traditional {
            background: linear-gradient(135deg, #48dbfb, #0abde3);
            color: white;
        }
        
        .route-type.emerging {
            background: linear-gradient(135deg, #ff9ff3, #ff6b6b);
            color: white;
        }
        
        .data-table tbody tr:hover {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            transform: scale(1.01);
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Export chart functionality
function exportChinaMapChart() {
    if (chinaMapChart) {
        const url = chinaMapChart.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
        });
        
        const link = document.createElement('a');
        link.download = 'china-train-routes-chart.png';
        link.href = url;
        link.click();
    }
}

// Make export function globally available
if (typeof window !== 'undefined') {
    window.exportChinaMapChart = exportChinaMapChart;
}

// Show route card function
function showRouteCard(routeData, cardX, cardY) {
    // Remove existing card
    hideRouteCard();
    
    // Find route rank
    const routeIndex = trainRoutes.findIndex(route => 
        route.fromName === routeData.fromName && route.toName === routeData.toName
    );
    const rank = routeIndex + 1;
    
    // Create card element
    const card = document.createElement('div');
    card.className = 'route-bubble-card';
    card.id = 'routeBubbleCard';
    
    // Add pointer
    const pointer = document.createElement('div');
    pointer.className = 'bubble-pointer';
    card.appendChild(pointer);
    
    document.body.appendChild(card);
    
    card.innerHTML = `
        <div class="bubble-pointer"></div>
        <div class="card-header">
            <h3 class="card-title">🚄 ${routeData.fromName} → ${routeData.toName}</h3>
            <button class="card-close" onclick="hideRouteCard()">&times;</button>
        </div>
        <div class="card-content">
            <div class="card-info">
                <div class="info-item rank-item">
                    <span class="info-label">🏆 Popularity Rank</span>
                    <span class="info-value rank-value">#${rank}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📏 Distance</span>
                    <span class="info-value">${routeData.distance}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">⏱️ Travel Time</span>
                    <span class="info-value">${routeData.time}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">👥 Daily Passengers</span>
                    <span class="info-value passenger-value">${(routeData.value/1000).toFixed(0)}K</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🗺️ Route Category</span>
                    <span class="info-value route-type-badge ${routeData.region}">${getRouteTypeName(routeData.region)}</span>
                </div>
            </div>
        </div>
    `;
    
    // Position the card
    const cardWidth = 380;
    const cardHeight = 350;
    let finalX = cardX + 50;
    let finalY = cardY - cardHeight / 2;
    
    // Adjust position if card goes off screen
    if (finalX + cardWidth > window.innerWidth) {
        finalX = cardX - cardWidth - 50;
    }
    if (finalY < 20) {
        finalY = 20;
    }
    if (finalY + cardHeight > window.innerHeight) {
        finalY = window.innerHeight - cardHeight - 20;
    }
    
    card.style.left = finalX + 'px';
    card.style.top = finalY + 'px';
    
    // Create connection line
    const connection = document.createElement('div');
    connection.className = 'bubble-connection';
    connection.id = 'routeBubbleConnection';
    
    const lineLength = Math.sqrt(Math.pow(finalX - cardX, 2) + Math.pow(finalY + cardHeight/2 - cardY, 2));
    const angle = Math.atan2(finalY + cardHeight/2 - cardY, finalX - cardX) * 180 / Math.PI;
    
    connection.style.width = lineLength + 'px';
    connection.style.left = cardX + 'px';
    connection.style.top = cardY + 'px';
    connection.style.transform = `rotate(${angle}deg)`;
    connection.style.transformOrigin = '0 50%';
    
    document.body.appendChild(connection);
    
    // Add styles if not already added
    if (!document.getElementById('routeCardStyles')) {
        addRouteCardStyles();
    }
}

// Hide route card function
function hideRouteCard() {
    const card = document.getElementById('routeBubbleCard');
    const connection = document.getElementById('routeBubbleConnection');
    
    if (card) {
        card.remove();
    }
    if (connection) {
        connection.remove();
    }
}

// Get route type name
function getRouteTypeName(region) {
    const names = {
        'north': '🌸 Cherry Blossom Line',
        'south': '🌺 Tropical Paradise Line', 
        'southwest': '🌈 Rainbow Mountain Line'
    };
    return names[region] || '✨ Mystery Line';
}

// Add route card styles
function addRouteCardStyles() {
    const style = document.createElement('style');
    style.id = 'routeCardStyles';
    style.textContent = `
        .route-bubble-card {
            position: fixed;
            background: linear-gradient(135deg, 
                rgba(255, 182, 193, 0.9) 0%, 
                rgba(255, 218, 185, 0.9) 25%,
                rgba(221, 160, 221, 0.9) 50%,
                rgba(173, 216, 230, 0.9) 75%,
                rgba(255, 192, 203, 0.9) 100%);
            border-radius: 25px;
            box-shadow: 
                0 20px 60px rgba(255, 182, 193, 0.3),
                0 8px 32px rgba(221, 160, 221, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.3);
            z-index: 1000;
            width: 380px;
            max-height: 450px;
            overflow: hidden;
            animation: bubbleSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.4);
        }
        
        .bubble-pointer {
            position: absolute;
            width: 0;
            height: 0;
            border-left: 18px solid transparent;
            border-right: 18px solid transparent;
            border-bottom: 24px solid rgba(255, 182, 193, 0.8);
            left: -18px;
            top: 50%;
            transform: translateY(-50%) rotate(-90deg);
            filter: drop-shadow(0 4px 8px rgba(255, 182, 193, 0.3));
        }
        
        .bubble-connection {
            position: fixed;
            height: 2px;
            background: linear-gradient(90deg, 
                rgba(255, 182, 193, 0.6) 0%, 
                rgba(221, 160, 221, 0.4) 25%,
                rgba(173, 216, 230, 0.4) 50%,
                rgba(255, 218, 185, 0.4) 75%,
                rgba(255, 182, 193, 0.6) 100%);
            border-top: 1px dashed rgba(255, 255, 255, 0.5);
            z-index: 999;
            animation: connectionDraw 0.8s ease-out;
            border-radius: 2px;
        }
        
        @keyframes connectionDraw {
            from {
                width: 0;
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        @keyframes bubbleSlideIn {
            from {
                opacity: 0;
                transform: scale(0.3) translateY(-50px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .card-header {
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.3) 0%, 
                rgba(255, 182, 193, 0.2) 100%);
            padding: 20px 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            backdrop-filter: blur(15px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .card-title {
            color: #2d3748;
            font-size: 20px;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 1px 3px rgba(255, 255, 255, 0.8);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .card-close {
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
            border: none;
            color: white;
            font-size: 22px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 154, 158, 0.4);
        }
        
        .card-close:hover {
            background: linear-gradient(135deg, #fecfef 0%, #ff9a9e 100%);
            transform: scale(1.15) rotate(90deg);
            box-shadow: 0 6px 20px rgba(255, 154, 158, 0.6);
        }
        
        .card-content {
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.95) 0%, 
                rgba(255, 248, 250, 0.95) 100%);
            padding: 0;
            overflow-y: auto;
        }
        
        .card-info {
            padding: 25px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 15px 20px;
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.8) 0%, 
                rgba(255, 248, 250, 0.6) 100%);
            border-radius: 15px;
            border: 2px solid transparent;
            background-clip: padding-box;
            box-shadow: 0 4px 20px rgba(255, 182, 193, 0.15);
            transition: all 0.3s ease;
        }
        
        .info-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(255, 182, 193, 0.25);
        }
        
        .rank-item {
            background: linear-gradient(135deg, 
                rgba(255, 218, 185, 0.8) 0%, 
                rgba(255, 182, 193, 0.6) 100%);
            border: 2px solid rgba(255, 154, 158, 0.3);
        }
        
        .info-label {
            font-weight: 700;
            color: #4a5568;
            font-size: 15px;
            letter-spacing: 0.5px;
        }
        
        .info-value {
            font-weight: 600;
            color: #2d3748;
            font-size: 15px;
        }
        
        .rank-value {
            background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 800;
            font-size: 20px;
        }
        
        .passenger-value {
            background: linear-gradient(135deg, #48dbfb 0%, #0abde3 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
        }
        
        .route-type-badge {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        .route-type-badge:hover {
            transform: scale(1.05);
        }
        
        .route-type-badge.north {
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
            color: #2d3748;
            text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
        }
        
        .route-type-badge.south {
            background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
            color: #2d3748;
            text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
        }
        
        .route-type-badge.southwest {
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            color: #2d3748;
            text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
        }
    `;
    document.head.appendChild(style);
}

// Make functions globally available
if (typeof window !== 'undefined') {
    window.hideRouteCard = hideRouteCard;
}