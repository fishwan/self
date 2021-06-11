   
    const map = L.map('map',{
        zoomControl: false // 是否顯示預設的縮放按鈕（左上角）
    }).setView([24.8090765, 120.9709791], 16);

    // const marker = L.marker([0, 0] , {icon:redIcon}).addTo(map);

    // const geocoder = L.Control.geocoder({
    //     defaultMarkGeocode: true,
    //     position: 'topleft'
    // }).addTo(map);

    // 自訂縮放按鈕位置
    const zoom = L.control.zoom({
        position: 'topright'
    }).addTo(map);

    let data;
    // 定義 marker 顏色
    let mask;
    // 綠色marker
    const greenIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        // 只要更改上面這一段的 green.png 成專案裡提供的顏色如：red.png，就可以更改 marker 的顏色
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    // 橘色marker
    const orangeIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    // 紅色marker
    const redIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // 執行 init
    init();

    function getData(){
        const xhr = new XMLHttpRequest;
        xhr.open('get','json/points.json',true)
        xhr.send(null);
        xhr.onload = function(){
            data = JSON.parse(xhr.responseText).features;
            // 為地圖加上 marker的函式
            addMarker();
            
        }
    }

    // 新增 init 函式，讓網頁載入時可以預設執行 init 裡的函式
    function init(){
        getUserPosition();
        getData();
    }

    // 添加Markers
    function addMarker(){

        for(let i = 0; i < data.length; i++){

            // 獲得位址
            const lat = data[i].geometry.coordinates[1];
            const lng = data[i].geometry.coordinates[0];
            
            // maker顏色
            mask = redIcon;

            const shopName = data[i].properties.name;
            const shopAddress = data[i].properties.address;
            const shopPhone = data[i].properties.phone;
            const shopavAilable = data[i].properties.available;
            const shopNote = data[i].properties.note;
            const shopUpdated = data[i].properties.updated;
            const shopUpload = data[i].properties.upload;

            // 將 marker 標至地圖上
            L.marker([lat,lng],{icon: mask})
                .on('click', function(){
                    let str = '';
                    let shopImg = '';
                    let shopTags = '';
                    const closeShop = '<div class="close">關閉</div>';

                    $.each(data[i].properties.img, function (j, imgUrl) {
                        shopImg += '<div class="swiper-slide"><a class="lightbox" href="'+ imgUrl +'"><img src="'+ imgUrl +'" alt=""></a></div>'
                    });

                    $.each(data[i].properties.tags, function (k, tags) {
                        shopTags += '<a href="#">'+ tags +'</a>'
                    });

                    str =`${closeShop}
                        <div class="shop__inner">
                            <div class="swiper-container">
                                <div class="shop-img swiper-wrapper">
                                    ${shopImg}
                                </div>
                                <div class="swiper-pagination"></div>
                            </div>
                            <h2 class="shop-name">${shopName}</h2>
                            
                            <ul class="shop-info m-list--none">
                                <li class="shop-info__adress">
                                    <dt>地址</dt>
                                    <dd>${shopAddress}</dd>
                                </li>
                                <li class="shop-info__phone">
                                    <dt>電話</dt>
                                    <dd><a href="tel:${shopPhone}">${shopPhone}</a></dd>
                                </li>
                                <li class="shop-info__available">
                                    <dt>營業時間</dt>
                                    <dd>${shopavAilable}</dd>
                                </li>
                                <li class="shop-info__custom">
                                    <dt>其他資訊</dt>
                                    <dd>${shopNote}</dd>
                                </li>
                                <li class="align-center"><a class="m-btn m-btn-outline--primary m-btn--sm" href="#">提出修改</a></li>
                            </ul>
                            <hr>
                            <div class="shop-tags">${shopTags}</div>
                            <hr>
                            <div>
                                <small>由 <span class="shop-info__upload">${shopUpload}</span> 提供，<span class="shop-info__updated"></span>最後更新時間 ${shopUpdated}</small>
                            </div>
                        </div>`
                        
                    $('.shop').removeClass('hidden');
                    $('.shop__inner').remove();
                    $('#Shop').append(str);

                    // 輪播圖片
                    let swiper = new Swiper(".swiper-container", {
                        slidesPerView: "auto",
                        spaceBetween: 30,
                        pagination: {
                            el: ".swiper-pagination",
                        },
                    });
                    // 點擊放大圖片
                    let lightbox = new SimpleLightbox('.lightbox');
                })
                .addTo(map);
        }
    }

    // 取得使用者的地理位置
    function getUserPosition() {
        if(navigator.geolocation) {
            function showPosition(position) {
                L.marker([position.coords.latitude, position.coords.longitude], {icon: redIcon}).addTo(map);
                map.setView([position.coords.latitude, position.coords.longitude], 16);
            }
            function showError() {
                console.log('抱歉，現在無法取的您的地理位置。')
            }
        
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            console.log('抱歉，您的裝置不支援定位功能。');
        }
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © ESUN'
    }).addTo(map);
    // contributors 後方可加入自己的名字及網址，如 GitHub 網址或個人網頁網址