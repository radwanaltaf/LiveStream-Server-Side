/* eslint-disable quotes */
/* eslint-disable no-bitwise */


let channelChat = '';
// eslint-disable-next-line no-undef
let sdkViewerInstance = new SdkViewer({
    // ------------------- DEV ENV ---------------------
    // Create View instance with your config
    // key: 'KwoxHbH58+Ki7jzrfSDL6h8dVxC2UpEtFDsYndzbM8Y=',
    // endpoint: 'https://belivesdk.belive.sg/api',
    // baseUrl: 'http://localhost:8080',
    // sdpUrl: 'wss://belivesdk-wowza-origin.belive.sg/webrtc-session.json',
    // appName: 'live',
    // rtmEndpoint: 'belive-rtm.belive.sg:1010',
    // rtmKey: 'xS48nBVdsH0cb+ZUEBf9ycmhzVUvGzeDsoxQ99N7tD0=',

    // ------------------- PROD ENV ---------------------
    key: "KD8L3hqc3JAcl4Ll6P1K9gjxaAzUgSmJquGl72Nb/Cs=",
    endpoint: "https://gssb-live-api.belive.sg/api",
    baseUrl: "http://localhost:8080", // change according to your web base url
    sdpUrl: "wss://belivesdk-wowza-origin.belive.sg/webrtc-session.json", appName: "live",
    rtmEndpoint: "gssb-rtm.belive.sg:1010",
    rtmKey: "xS48nBVdsH0cb+ZUEBf9ycmhzVUvGzeDsoxQ99N7tD0=",
}, 'playerViewWrapper', {
    onVideoReady: () => {
        console.log('Video status: READY');
    },
    onVideoDestroyed: () => {
        console.log('Video status: DESTROYED');
    },
    onVideoErrors: (error) => {
        console.log('Video status: ', error);

        errFlagG = true;
        let errMsg = `Live stream has ended. Join us for next upcoming live streams!`;
        errorHandler(errMsg);

    },
});

// Dynamically from POST Req API (Req data received)
// let titleG = 'Live demo 24'
let titleG = document.getElementById("title").value;
let brandIdG = document.getElementById("brandId").value;
let usernameG = document.getElementById("username").value;
let isGuestG = document.getElementById("isGuest").value;

// Stays Same
let passwordG = 'Testing1';
let allProdArrG;
let streamType;
let errFlagG = false;

handleSDKEvents();

sdkViewerInstance.guestLogin(null, () => {
    console.log('LOGGED IN');
    watchLiveStream();
});

function handleSDKEvents() {
    sdkViewerInstance.onEventHandler(
        'ON_UPDATE_STATISTICS', (data) => {
            console.log('UPDATE STATISTICS: ', data);
            document.getElementById('viewCount').innerHTML = data.TotalViewers;
            // console.log(`UPDATE STATISTICS: ${JSON.stringify(data)}`);
        });

    sdkViewerInstance.onEventHandler('URL_NOT_AVAILABLE', (data) => {
        console.log('URL Not Avail: ', data);
        console.log('Error Video: URL NOT AVAILABLE', 'error');
    });

    sdkViewerInstance.onEventHandler('ON_UPDATE_END_RESULT', (data) => {
        errFlagG = true;
        let errMsg = `Live stream has ended. Join us for next upcoming live streams!`;
        errorHandler(errMsg);

        console.log('UPDATE END RESULT: ', data);
        console.log(`UPDATE END RESULT: ${JSON.stringify(data)}`);
    });

    sdkViewerInstance.onEventHandler('LOST_NETWORK', () => {
        console.log('NET ERR');
        console.log('ERROR: Your internet is lost, so RTM and video can not work, pls check it.', 'error');
    });

    sdkViewerInstance.onEventHandler('RECONNECT_NETWORK', () => {
        console.log('NET ERR');
        console.log(
            'Reconnected your internet, pls check and maybe you need to disconnect RTM then Reconnect to make sure RTM is keeping connection.',
            'success');
    });
}

function watchLiveStream() {
    // let title = "LiveStreamTestRoom";
    // let password = "Testing1*";
    let title = titleG;
    let password = passwordG;

    let isPrivate = password ? true : false;
    let streamInfo = {
        'streamName': title,
        'passwordStream': password,
    };

    sdkViewerInstance.getDetailStream(
        streamInfo,
        isPrivate,
        // On Success Event Listener
        async (res) => {
            console.log(res);
            if (res.data.status === 1) {
                streamType = 'LIVE';
            } else if (res.data.status === 2) {
                streamType = 'REC';
                let mainOverlay = document.getElementById('vid-overlay-main');
                mainOverlay.style.top = '87.75vh';
            }
            channelChat = res.data.slug;

            await sdkViewerInstance.createRtmServer(() => {
                // create RTM success callback
                console.log('Create RTM Success!', 'success');
            // eslint-disable-next-line no-sequences
            }), () => { // error callback
                console.log('Create RTM Error!', 'error');
            };


            await sdkViewerInstance.getRtmServer().createChatRoom(channelChat, (msgJson) => {
                if (msgJson.messageType === 1) { // Text messsage
                    console.log('msgJson', msgJson);
                    let value = `
                    <div
                    id="dynamicMsgText"
                    class="bg-black mr-5 mb-4">
                        <div
                        id="dynamicMsgText"
                        class="message-box border-rad-round px-4 py-2">
                            ${msgJson.message}
                        </div>
                    </div>            
                    `;
                    document.getElementById('dynamicMsgBox').innerHTML += value;
                }
                else if (msgJson.messageType === 201) {
                    // Stream ended
                    console.log('Stream ended!');

                    errFlagG = true;
                    let errMsg = 'Live stream has ended. Join us for next upcoming live streams!';
                    errorHandler(errMsg);
                }
            },
            (data) => { // Open callback
                console.log(`RTM logs: ${data}`);
            },
            (data) => { // Close callback
                console.log(`RTM logs: ${data}`);
            },
            (data) => { // Error callback
                console.log(`RTM Error: ${JSON.stringify(data)}`, 'error');
            }
        );

            let vcElem = document.getElementById('viewCount');
            vcElem.innerHTML = res.data.viewCount;

            let stElem = document.getElementById('streamType');
            stElem.innerHTML = streamType;

            let seekLiveIconCB = document.getElementsByClassName('vjs-seek-to-live-control')[0];
            seekLiveIconCB !== undefined ? seekLiveIconCB.style.display = 'none' : null;

            let fullScreenIconCB = document.getElementsByClassName('vjs-fullscreen-control')[0];
            fullScreenIconCB !== undefined ? fullScreenIconCB.style.display = 'none' : null;

            let mainCB = document.getElementsByClassName('vjs-control-bar')[0];
            mainCB !== undefined ? mainCB.style.fontSize = '30px' : null;

            let chatHistoryLink = res.data.historyChat;

            if (chatHistoryLink !== '') {
                let chatHistoryRes = await fetch(chatHistoryLink)
                .then(handleErrors)
                .catch(
                    () => {
                        document.getElementById('loadingSpinner').style.display = 'none';
                    });
                let chatHistoryResJSON = await chatHistoryRes.json();
                console.log(chatHistoryResJSON);

                renderEachMessage(chatHistoryResJSON);
            }

            setTimeout(() => {
                document.getElementById('loadingSpinner').style.display = 'none';
            }, 800);

        },
            // On Error Event Listener
            (err) => {
                errFlagG = true;
                let errMsg = `Livestream could not be loaded.
                Please try again`;
                errorHandler(errMsg);
                console.log('CustomErr', err);
            }
    );

}

function errorHandler(msg) {
    document.getElementById('playerViewWrapper').innerHTML = '<div></div>';

    // let liveCapsule = document.getElementsByClassName('live-capsule')[0];
    // liveCapsule !== undefined ? liveCapsule.style.zIndex = 1 : null;

    let lsSpinnner = document.getElementById('loadingSpinner');
    lsSpinnner.className = 'loading-ls-end';
    lsSpinnner.style.display = 'block';

    let myModapMainCust = document.getElementById('myModal');
    myModapMainCust.style.display = 'block';
    myModapMainCust.style.zIndex = 999999;
    document.getElementById('myModalSpan').innerText = `${msg}`;
}

// eslint-disable-next-line no-unused-vars
function handleVideoEvents() {
    // Handle Video Events
    sdkViewerInstance.getVideoPlayer().onEventHandler('READY', () => {
        console.log('VID REDY');
    });

    sdkViewerInstance.getVideoPlayer().onEventHandler('TIME_UPDATE', (currentTime) => {
        console.log('TIME UPDAYE', currentTime);
        // console.log(`Current time video: ${currentTime}`);
    });

    sdkViewerInstance.getVideoPlayer().onEventHandler('LOADED_METADATA', (data) => {
        console.log(`Video loaded metadata: ${JSON.stringify(data)}`);
    });

    sdkViewerInstance.getVideoPlayer().onEventHandler('CAN_PLAY', () => {
        console.log('Video can play');
    });

    sdkViewerInstance.getVideoPlayer().onEventHandler('PLAYING', async () => {
        console.log('Video is playing.');
    });

    sdkViewerInstance.getVideoPlayer().onEventHandler('PAUSED', () => {
        console.log('Video paused.');
    });

    sdkViewerInstance.getVideoPlayer().onEventHandler('ERROR', (err) => {
        console.log(`Video error: ${JSON.stringify(err)}`, 'error');
    });

    sdkViewerInstance.getVideoPlayer().onEventHandler('RETRY_PLAYLIST', (err) => {
        console.log(`Video error: ${JSON.stringify(err)}`, 'error');
    });

    sdkViewerInstance.getVideoPlayer().onEventHandler('ENDED', () => {
        let msgToShow = 'The replay has ended.';
        errorHandler(msgToShow);
        console.log('Video ended.');
    });

    sdkViewerInstance.getVideoPlayer().onEventHandler('ON_VIDEO_ENDED', () => {
        let msgToShow = 'The replay has ended.';
        errorHandler(msgToShow);
        console.log('Video Ended ON.');
    });

    sdkViewerInstance.getVideoPlayer().onEventHandler('RELOAD_VIDEO', (urlPlaying) => {
        console.log(`Video reload: ${urlPlaying}`);
    });

    sdkViewerInstance.getVideoPlayer().onEventHandler('RETRY_LOAD_VIDEO', () => {
        console.log('RETRY LOAD VIDEO!');
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    setTimeout(async () => {
    // Get the modal
    var modal = document.getElementById('myModal');
    // var span = document.getElementsByClassName("close")[0];
    // span.onclick = async function () {
    //     modal.style.display = "none";
    //     await sdkViewerInstance.getVideoPlayer().unMuteVideo();
    // }
    window.onclick = async function (event) {
        if (event.target === modal && errFlagG === false) {
            modal.style.display = 'none';
            await sdkViewerInstance.getVideoPlayer().unMuteVideo();
        }

        if (event.target === document.getElementById('messageBox') ||
        event.target === document.getElementById('dynamicMsgBox') ||
        event.target === document.getElementById('dynamicMsgText')) {
            document.getElementById('messageBox').style.height = '25vh';
            console.log(event);
            let mainCB = document.getElementsByClassName('vjs-control-bar')[0];
            mainCB !== undefined ? mainCB.style.visibility = 'visible' : null;
        }
    };
        // let isPaused = await sdkViewerInstance.getVideoPlayer().checkVideoIsPaused();
        // isPaused ? await
        // sdkViewerInstance.getVideoPlayer().resumeVideo()
        // : null;

        // document.getElementsByClassName('vjs-control-bar')[0] !== undefined ? document.getElementsByClassName('vjs-control-bar')[0].style.display = 'none' : null;

        modal.style.display = 'block';
    }, 1000);
}, false);

// eslint-disable-next-line no-unused-vars
async function openCartModal() {
    let cart = document.getElementById('cartContainer');
    cart.style.top = '30vh';
    // await getAllProducts();
    renderEachProduct();
}

// eslint-disable-next-line no-unused-vars
function closeCartModal() {
    let cart = document.getElementById('cartContainer');
    cart.style.top = '200vh';
}

function onAddToCartClick(post) {
    console.log('ADD TO CART');
    window.ReactNativeWebView.postMessage(JSON.stringify(post));
    console.log(post);
}

async function getAllProducts() {
    document.getElementById('dynamicContainer').innerHTML = '<div id="loadingSpinnerCart" class="loading-cart">Loading&#8230;</div>';

    let response = await fetch(`https://shop.premiumoutlets.com.my/rest/${selectedCenterG}/V1/productsByBrandId/${brandIdG}`)
    .then(handleErrors)
    .catch(
        () => {
            document.getElementById('loadingSpinnerCart') ? document.getElementById('loadingSpinnerCart').style.display = 'none' : null;
            document.getElementById('dynamicContainer').innerHTML = `
            <div class="center-in-cart d-flex justify-content-center align-items-center">
                <span class="empty-cart-text text-danger">Something went wrong. Please try again.</span>
            </div>`;
        });;
    let responseJSON = await response.json();
    console.log(responseJSON.items.filter((prodElem) => prodElem.status === 1 && prodElem.visibility === 4));
    let finalResJSON = [...responseJSON.items].reverse();

    document.getElementById('loadingSpinnerCart').style.display = 'none';

    return finalResJSON.filter((prodElem) => {
        if (prodElem.status === 1 &&
            prodElem.visibility === 4 &&
            // eslint-disable-next-line eqeqeq
            getAttribute(prodElem, 'allow_shipping').value == 1
            ) {
            return true;
        } else {
            return false;
        }
    } );
}

function getAttribute(data, str) {
    if (data) {
      const attribute = data?.custom_attributes?.find(
        (item) => item.attribute_code === str,
      );

      return attribute;
    }
    return str;
  }

async function renderEachProduct() {
    allProdArrG = await getAllProducts();
    // let allProductsArray = returnData();
    let value = '';
    let discVal;
    if (allProdArrG.length > 0) {
        allProdArrG.forEach((post, i) => {
            let specialPrice = getAttribute(post, 'special_price');
            if (specialPrice.value !== undefined) {
                discVal = validateDiscount(post.price, specialPrice.value);
            }
            value += `
                <div class="d-flex flex-row align-items-center p-2">
                    <div class="prod-thumbnail mr-4">
                        <span class="num-font px-3 py-1 rounded">${allProdArrG.length - i}</span>
                        <img src="https://shop.premiumoutlets.com.my/pub/media/catalog/product${post.media_gallery_entries[0].file}" class="img-cust" alt="Responsive image">
                    </div>
                    <div class="prod-desc mr-4">
                        <span class="desc-font">${post.name}</span>
                        <br>
                        <span class="font-price mr-3">MYR ${specialPrice.value ? ~~specialPrice.value : ~~post.price}</span>

                        ${discVal !== 0 ? `
                        <span class="font-ori-price">
                        MYR ${ ~~post.price}
                        </span>` : ''}

                        
                        ${discVal !== 0 ?  `
                        <br>
                        <span class="font-discount">
                        ${discVal} % Off
                        </span>` : ''}
                        
    
                    </div>
    
                    <div id="${i}" class="shop-cart-icon ml-auto bg-dark text-white p-3">
                        <i class="material-icons-outlined basket-icon-cart">
                            shopping_basket
                        </i>
                        
                    </div>
                
                </div>
                <hr style="border: 1px solid gray; width: 100%;">
            `;

            setTimeout(() => {
                let ngForEachElem = document.getElementById(i);
                ngForEachElem.onclick = function() {onAddToCartClick(post);};
            }, 100);

            // ngForEachElem.addEventListener("click", function(ev) {
            //     onAddToCartClick(ev);
            // });

            // document.getElementById('addCartToCheckOut').onclick = function() {console.log("addCartToCheckOut")}
        });
    } else {
        value = `
        <div class="center-in-cart d-flex justify-content-center align-items-center">
            <span class="empty-cart-text">No Products listed by this brand</span>
        </div>
        `;
    }


    document.getElementById('dynamicContainer').innerHTML = value;
}

// eslint-disable-next-line no-unused-vars
function sendLiveMessage() {
    console.log('CLICK')
    if (isGuestG === false || isGuestG === 'false' ||
        isGuestG === 'false' || isGuestG === 'False') {
        let message = {
            message: `${usernameG + ': ' + document.getElementById('messageInput').value}`,
            messageType: 1, // 1 for send text message
        };
        if (message.message !== '' && message.message !== null) {
            sdkViewerInstance.sendMessageRTM(channelChat, message, (res) => { // success callback
                console.log(res);
                if (res.status === 'Success') {
                    document.getElementById('messageInput').value = '';
                    document.getElementById('send-btn').disabled = true;
                    let mainCB = document.getElementsByClassName('vjs-control-bar')[0];
                    mainCB !== undefined ? mainCB.style.visibility = 'visible' : null;
                }
            });
        } else {
            console.log('Please type something!');
        }
    } else if (isGuestG === true || isGuestG === 'true' ||
            isGuestG === 'true' || isGuestG === 'True') {
        window.ReactNativeWebView.postMessage('navToLogin');
    }

}


async function renderEachMessage(chatHistoryArr) {
    let value = '';
    chatHistoryArr.forEach((post, i) => {
        if (post.message !== undefined) {
            value += `
            <div
            id="dynamicMsgText"
            class="bg-black mr-5 mb-4">
                <div
                id="dynamicMsgText"
                class="message-box border-rad-round px-4 py-2">
                    ${post.message}
                </div>
            </div>            
            `;
        }

    });
    // setTimeout(() => {
    // }, 200);

    document.getElementById('dynamicMsgBox').innerHTML = value;
}

// eslint-disable-next-line no-unused-vars
function onInputChanged() {
    let sendBtn = document.getElementById('send-btn');
    let msgInput = document.getElementById('messageInput').value;
    if (msgInput !== null && msgInput !== '') {
        sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }
}

// eslint-disable-next-line no-unused-vars
function onMsgBoxClick() {
    console.log('clicked');

    let mainCB = document.getElementsByClassName('vjs-control-bar')[0];
    mainCB !== undefined ? mainCB.style.visibility = 'hidden' : null;
}

function handleErrors(response) {
    if (!response.ok) {
        console.log('ERROORRR');
        document.getElementById('dynamicContainer').innerHTML = `
        <div class="center-in-cart d-flex justify-content-center align-items-center">
            <span class="empty-cart-text text-danger">Something went wrong. Please try again.</span>
        </div>`;

        document.getElementById('loadingSpinner').style.display = 'none';

        throw Error(response.statusText);
    }
    return response;
}

function validateDiscount(Price, splPrice) {
    let Cost = parseInt(Price, 10);
    let SplCost = parseInt(splPrice, 10);
    let discount = Math.round(((Cost - SplCost) / Cost) * 100);

    return discount;
  }

// allProdArrG.forEach((post, i) => {
//     selectedProd = post
//     // value += `<li>${post.tittle} - ${post.body}</li>`;
//     value += `
//         <div class="d-flex flex-row align-items-center p-2">
//             <div class="prod-thumbnail mr-4">
//                 <img src="https://shop.premiumoutlets.com.my/pub/media/catalog/product${post.media_gallery_entries[0].file}" class="img-fluid rounded" alt="Responsive image">
//             </div>
//             <div class="prod-desc mr-4">
//                 <span class="desc-font">${post.name}</span>
//                 <br>
//                 <span class="font-price">MYR ${post.price}</span>
//                 <br>
//                 <span class="font-discount">50% Off</span>

//             </div>

//             <div onclick="onAddToCartClick(event)" id="addCartToCheckOut" class="shop-cart-icon ml-auto bg-dark text-white p-3">
//                 <i class="material-icons-outlined basket-icon-cart">
//                     shopping_basket
//                 </i>

//             </div>

//         </div>
//         <hr style="border: 1px solid gray; width: 100%;">
//     `

//     // let ngForEachElem = document.getElementById('addCartToCheckOut');
//     // ngForEachElem.addEventListener("click", function(ev) {
//     //     onAddToCartClick(ev);
//     // });

//     // document.getElementById('addCartToCheckOut').onclick = function() {console.log("addCartToCheckOut")}
// });


    // // status 1 is Live
// // status 2 is Rec
// if (res.data.status == 2) {
// 	// let liveStreamPlayerContainer =
// 	// document.getElementById("playerViewWrapper").style.display = "none";
// 	// document.getElementById("live-ended-msg").style.display = "flex";
// 	// document.getElementById("live-ended-msg").innerHTML = "<h1>OOPSS</h1>";

// } -->
