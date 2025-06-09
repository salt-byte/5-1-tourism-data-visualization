// County Tourism Heat Map Visualization

// Initialize chart when page loads
document.addEventListener('DOMContentLoaded', function() {
    initCountyMap();
});

// Global chart instance
let countyChart;

// Top 10 County Tourism Destinations Data
const countyData = [
    { 
        name: "Jiuzhaigou", 
        value: [104.236, 33.266, 100], 
        image: "images/Jiuzhaigou.jpg",
        description: "Jiuzhaigou is located in Aba Tibetan and Qiang Autonomous Prefecture, Sichuan Province, famous for its colorful lakes, waterfalls and snow mountains, known as 'Fairyland on Earth'. It has unique Tibetan culture and pristine forest ecosystem."
    },
    { 
        name: "Shennongjia", 
        value: [110.682, 31.743, 95], 
        image: "images/Shennongjia.jpg",
        description: "Shennongjia is located in western Hubei Province and is the only administrative region in China named 'Forest District'. It preserves intact primitive forests and is called the 'Roof of Central China', a paradise for rare flora and fauna."
    },
    { 
        name: "Beidaihe", 
        value: [119.470, 39.833, 90], 
        image: "images/Beidaihe.jpg",
        description: "Beidaihe is located in Qinhuangdao City, Hebei Province, and is a famous seaside resort. It has beautiful coastlines, fresh air and abundant seafood, making it an ideal summer retreat destination."
    },
    { 
        name: "Shengsi", 
        value: [122.451, 30.728, 88], 
        image: "images/Shengsi.jpg",
        description: "Shengsi Islands are located in Zhoushan City, Zhejiang Province, consisting of 404 islands. With blue seas and golden beaches, it is a pearl in the East China Sea, known as 'Fairy Mountains on the Sea'."
    },
    { 
        name: "Tashkurgan", 
        value: [75.228, 37.775, 85], 
        image: "images/Tashkurgan.jpg",
        description: "Tashkurgan is located on the Pamir Plateau in Xinjiang and is the westernmost county in China. It has magnificent plateau scenery and unique Tajik culture, known as the 'Pearl on the Roof of the World'."
    },
    { 
        name: "Wulingyuan", 
        value: [110.546, 29.347, 83], 
        image: "images/Wulingyuan.jpg",
        description: "Wulingyuan is located in Zhangjiajie City, Hunan Province, famous for its unique quartz sandstone pillar forest landforms. It is the filming location for the movie 'Avatar' and is known as 'an enlarged bonsai, a miniature fairyland'."
    },
    { 
        name: "Pingtan", 
        value: [119.791, 25.498, 82], 
        image: "images/Pingtan.jpg",
        description: "Pingtan is located in eastern Fujian Province and is the largest island in Fujian. It has unique marine erosion landforms, beautiful beaches and rich marine culture, known as the 'County of Thousand Reefs'."
    },
    { 
        name: "Changhai", 
        value: [122.588, 39.272, 80], 
        image: "images/Changhai.jpg",
        description: "Changhai County is located in Dalian City, Liaoning Province, consisting of 252 islands. It has crystal-clear waters, fresh seafood and peaceful fishing village life, making it an excellent place to experience island charm."
    },
    { 
        name: "Xingyi", 
        value: [104.897, 25.089, 78], 
        image: "images/Xingyi.jpg",
        description: "Xingyi is located in southwestern Guizhou Province, famous for its spectacular Wanfenglin and Maling River Canyon. It has typical karst landforms and rich Buyi ethnic culture."
    },
    { 
        name: "Cangyuan", 
        value: [99.245, 23.147, 75], 
        image: "images/Cangyuan.jpg",
        description: "Cangyuan is located in Lincang City, Yunnan Province, and is a Wa autonomous county. It preserves primitive Wa culture and traditional villages, known as 'Awa Mountain', an ideal place to experience ethnic minority customs."
    }
];

// Initialize county map chart
function initCountyMap() {
    console.log('Initializing county map...');
    
    // Initialize chart
    const chartDom = document.getElementById('heatMapChart');
    countyChart = echarts.init(chartDom);
    
    // Show loading indicator
    countyChart.showLoading();
    
    // Fetch China map data from local file
    fetch('./geo.datav.aliyun.com:areas_v3:bound:100000_full.json')
        .then(response => {
            console.log('Fetch response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Map data loaded successfully:', data);
            
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
            if (data.features) {
                data.features.forEach(feature => {
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
            
            // Register the map with ECharts - this is the key step!
            echarts.registerMap('china', data);
            console.log('Map registered successfully');
            
            console.log('Setting ECharts option...');
            
            const option = {
                tooltip: {
                    trigger: 'none', // 禁用默认tooltip
                    show: false
                },
                geo: {
                    map: 'china',
                    roam: true,
                    zoom: 1.2,
                    center: [104.114129, 37.550339],
                    label: {
                        show: false
                    },
                    itemStyle: {
                        areaColor: '#f3e8ff',
                        borderColor: '#999',
                        borderWidth: 0.5
                    },
                    emphasis: {
                        label: {
                            show: false
                        },
                        itemStyle: {
                            areaColor: '#e9d5ff'
                        }
                    }
                },
                series: [{
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                 data: countyData,
                 symbolSize: function(val) {
                        return Math.max(val[2] / 8, 6);
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        color: 'rgba(144, 238, 144, 0.6)',
                        brushType: 'fill',
                        scale: 5,
                        period: 3
                    },
                    hoverAnimation: true,
                    label: {
                        formatter: '{b}',
                        position: 'right',
                        show: true,
                        fontSize: 11,
                        color: '#333',
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 3,
                        padding: [2, 4]
                    },
                    itemStyle: {
                        color: 'rgba(144, 238, 144, 0.3)',
                        shadowBlur: 35,
                        shadowColor: 'rgba(144, 238, 144, 0.8)'
                    }
                }
                ]
            };
            
            console.log('About to set option:', option);
            countyChart.setOption(option);
            console.log('Option set successfully');
            
            countyChart.hideLoading();
        })
        .catch(error => {
            console.error('Error loading map data:', error);
            countyChart.hideLoading();
            // Show error message to user
            const chartDom = document.getElementById('heatMapChart');
            chartDom.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">地图加载失败: ${error.message}</div>`;
        });
    
    // Click event for showing location card
    countyChart.on('click', function(params) {
        if (params.seriesType === 'effectScatter') {
            // Find the corresponding county data
            const countyInfo = countyData.find(county => 
                county.value[0] === params.data.value[0] && 
                county.value[1] === params.data.value[1]
            );
            if (countyInfo) {
                showLocationCard(countyInfo, countyChart);
            }
        }
    });

    // Make chart responsive
    window.addEventListener('resize', function() {
        countyChart.resize();
    });
}

// Fallback chart when map fails to load
function createFallbackChart() {
    const option = {
        title: {
            text: 'May Day 2025 - Top County Tourism Destinations',
            left: 'center',
            top: 20,
            textStyle: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#333'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                const data = params.data;
                return `
                    <div style="padding: 10px; max-width: 300px;">
                        <img src="${data.image}" style="width: 200px; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" onerror="this.style.display='none'"/>
                        <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">#${data.rank} ${data.shortName}</div>
                        <div style="color: #666; font-size: 12px;">Popularity: ${data.popularity}%</div>
                        <div style="color: #666; font-size: 12px;">Coordinates: [${data.coords[0]}, ${data.coords[1]}]</div>
                    </div>
                `;
            }
        },
        xAxis: {
            type: 'value',
            name: 'Longitude',
            min: 70,
            max: 140
        },
        yAxis: {
            type: 'value',
            name: 'Latitude',
            min: 15,
            max: 55
        },
        series: [{
            name: 'County Destinations',
            type: 'scatter',
            data: countyData.map(item => ({
                value: item.value,
                name: item.name,
                image: item.image
            })),
            symbolSize: function(data) {
                return Math.max(15, data[2] || 20);
            },
            itemStyle: {
                color: function(params) {
                    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'];
                    return colors[params.dataIndex % colors.length];
                }
            }
        }]
    };
    
    countyChart.setOption(option);
}

// Export chart as image
function exportChart() {
    if (countyChart) {
        const url = countyChart.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
        });
        
        const link = document.createElement('a');
        link.download = 'county-tourism-map.png';
        link.href = url;
        link.click();
    }
}

// Show location card
function showLocationCard(locationData, chart) {
    // Remove existing card
    hideLocationCard();
    
    // Get click position on the map
    const chartDom = document.getElementById('heatMapChart');
    const rect = chartDom.getBoundingClientRect();
    
    // Convert geo coordinates to pixel coordinates
    const pixelCoord = chart.convertToPixel('geo', [locationData.value[0], locationData.value[1]]);
    const cardX = rect.left + pixelCoord[0];
    const cardY = rect.top + pixelCoord[1];
    
    // Create card element
    const card = document.createElement('div');
    card.className = 'location-bubble-card';
    card.innerHTML = `
        <div class="bubble-pointer"></div>
        <div class="card-header">
            <h3 class="card-title">${locationData.name}</h3>
            <button class="card-close" onclick="hideLocationCard()">&times;</button>
        </div>
        <div class="card-content">
            <div class="card-image-container">
                <img src="${locationData.image}" alt="${locationData.name}" class="card-image" />
            </div>
            <div class="card-info">
                <div class="info-item">
                    <span class="info-label">Heat Rank</span>
                    <span class="info-value heat-value">${locationData.value[2]}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Coordinates</span>
                    <span class="info-value">${locationData.value[0].toFixed(2)}, ${locationData.value[1].toFixed(2)}</span>
                </div>
                <div class="card-description">
                    <h4>Area Introduction</h4>
                    <p>${locationData.description}</p>
                </div>
            </div>
        </div>
    `;
    
    // Position the card near the clicked point
    const cardWidth = 400;
    const cardHeight = 500;
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
    
    // Create dashed line connection
    const connection = document.createElement('div');
    connection.className = 'bubble-connection';
    
    const lineLength = Math.sqrt(Math.pow(finalX - cardX, 2) + Math.pow(finalY + cardHeight/2 - cardY, 2));
    const angle = Math.atan2(finalY + cardHeight/2 - cardY, finalX - cardX) * 180 / Math.PI;
    
    connection.style.width = lineLength + 'px';
    connection.style.left = cardX + 'px';
    connection.style.top = cardY + 'px';
    connection.style.transform = `rotate(${angle}deg)`;
    connection.style.transformOrigin = '0 50%';
    
    // Add styles
     const style = document.createElement('style');
     style.textContent = `
         .location-bubble-card {
              position: fixed;
              background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%);
              border-radius: 25px;
              box-shadow: 0 15px 40px rgba(34, 197, 94, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1);
              z-index: 1000;
              width: 400px;
              max-height: 500px;
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
         
         .bubble-connection {
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
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            backdrop-filter: blur(10px);
        }
        
        .card-title {
            color: white;
            font-size: 24px;
            font-weight: 600;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .card-close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 24px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .card-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }
        
        .card-content {
            background: white;
            padding: 0;
            overflow-y: auto;
            max-height: calc(80vh - 80px);
        }
        
        .card-image-container {
            width: 100%;
            height: 250px;
            overflow: hidden;
            position: relative;
        }
        
        .card-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .card-image:hover {
            transform: scale(1.05);
        }
        
        .card-info {
            padding: 25px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        
        .info-label {
            font-weight: 600;
            color: #333;
            font-size: 14px;
        }
        
        .info-value {
            font-weight: 700;
            color: #667eea;
            font-size: 16px;
        }
        
        .heat-value {
            background: linear-gradient(45deg, #ff6b6b, #ffa502);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 18px;
        }
        
        .card-description {
            margin-top: 20px;
        }
        
        .card-description h4 {
            color: #333;
            font-size: 18px;
            margin-bottom: 12px;
            font-weight: 600;
            border-bottom: 2px solid #667eea;
            padding-bottom: 8px;
        }
        
        .card-description p {
            color: #666;
            line-height: 1.6;
            font-size: 15px;
            margin: 0;
            text-align: justify;
        }
        
        .location-card-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: transparent;
              z-index: 998;
              animation: fadeIn 0.3s ease-out;
          }
         
         @keyframes fadeIn {
             from { opacity: 0; }
             to { opacity: 1; }
         }
         
         @media (max-width: 768px) {
             .location-bubble-card {
                 width: 350px;
                 max-height: 450px;
             }
             
             .card-header {
                 padding: 15px;
             }
             
             .card-title {
                 font-size: 18px;
             }
             
             .card-info {
                 padding: 20px;
             }
             
             .card-image-container {
                 height: 180px;
             }
             
             .bubble-connection {
                 display: none;
             }
         }
    `;
    
    // Add overlay
     const overlay = document.createElement('div');
     overlay.className = 'location-card-overlay';
     overlay.onclick = hideLocationCard;
     
     // Add to document
     document.head.appendChild(style);
     document.body.appendChild(overlay);
     document.body.appendChild(connection);
     document.body.appendChild(card);
     
     // Store connection reference for cleanup
     card.connectionElement = connection;
}

// Hide location card
function hideLocationCard() {
    const card = document.querySelector('.location-bubble-card');
    const overlay = document.querySelector('.location-card-overlay');
    const connection = document.querySelector('.bubble-connection');
    const style = document.querySelector('style');
    
    if (card) card.remove();
    if (overlay) overlay.remove();
    if (connection) connection.remove();
    if (style && style.textContent.includes('.location-card')) style.remove();
}

// Add export functionality if needed
if (typeof window !== 'undefined') {
    window.exportChart = exportChart;
}