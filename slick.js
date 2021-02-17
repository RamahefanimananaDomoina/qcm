var slideWrapper = $(".main-slider"),
  iframes = slideWrapper.find(".embed-player"),
  lazyImages = slideWrapper.find(".slide-image"),
  lazyCounter = 0;

// POST commands to YouTube or Vimeo API
const postMessageToPlayer = (player, command) => {
  if (player == null || command == null) return;
  player.contentWindow.postMessage(JSON.stringify(command), "*");
};

// When the slide is changing

const playPauseVideo = (slick, control) => {
  var currentSlide, slideType, startTime, player, video;
  currentSlide = slick.find(".slick-current");
  slideType = currentSlide.attr("class").split(" ")[1];
  player = currentSlide.find("iframe").get(0);
  startTime = currentSlide.data("video-start");

  if (slideType === "vimeo") {
    slideWrapper.slick("slickPause");
    switch (control) {
      case "play":
        if (
          startTime != null &&
          startTime > 0 &&
          !currentSlide.hasClass("started")
        ) {
          currentSlide.addClass("started");
          postMessageToPlayer(player, {
            method: "setCurrentTime",
            value: startTime
          });
          console.log("startTime ", startTime);
        }
        postMessageToPlayer(player, {
          method: "play",
          value: 1
        });
        vimeoIsEnd();
        break;
      case "pause":
        postMessageToPlayer(player, {
          method: "pause",
          value: 1
        });
        break;
    }
  } else if (slideType === "youtube") {
    slideWrapper.slick("slickPause");
    /* video = currentSlide.children("iframe").get(0);
    console.log("youtube zan ", video); */
    switch (control) {
      case "play":
        postMessageToPlayer(player, {
          event: "command",
          func: "mute"
        });
        postMessageToPlayer(player, {
          event: "command",
          func: "playVideo"
        });
        
        //video = currentSlide.children("iframe").get(0);
        //console.log('test ', video.play())
        onYouTubeIframeAPIReady(video);
        break;
      case "pause":
        postMessageToPlayer(player, {
          event: "command",
          func: "pauseVideo"
        });
        break;
    }
  } else if (slideType === "video") {
    slideWrapper.slick("slickPause");
    video = currentSlide.children("video").get(0);
    console.log("video ", video);
    if (video != null) {
      if (control === "play") {
        video.play();
      } else {
        video.pause();
      }
    }
    mp4IsEnd();
  } else {
    slideWrapper.slick("slickPlay");
  }
};

/*
 *  build a function to check id mp4 video is end
 */
const mp4IsEnd = () => {
  let interval_video = setInterval(function() {
    var vid = document.getElementById("myVideo");
    var _current = Math.round(vid.currentTime);
    var _duration = Math.round(vid.duration);
    if (_current == _duration) {
      console.log("ended video type mp4");
      document.querySelector(".slick-next").click();
      _current = 0;
      console.log("reinitialiser _current video mp4 = ", _current);
      clearInterval(interval_video);
    }
  }, 1000);
};

/*
 * build a function to check id Youtube video is end
 */
const onYouTubeIframeAPIReady = (video) => {
  console.log("API ready_");
  var player = new YT.Player("ytplayer", {
    events: {
      
      onReady: function (event) {
        //player.playVideo();
        console.log('event.target ',event.target)
        console.log("player ready");
        console.log(player.getDuration());
      },
      'onStateChange': function (event) {
        console.log(event.data);
        switch(event.data){
          case YT.PlayerState.ENDED:
              console.log('end video youtube ', event.data)
              $(".youtube").addClass("ended");
              document.querySelector(".slick-next").click();
            break;
          case -1:
            slideWrapper.slick("slickPause");
            break;
          case YT.PlayerState.PAUSED:
              console.log('pause => playing video youtube ', event.data);
              /* //$(".youtube").addClass("pause"); */
              var videosrc = $("#ytplayer").attr("src")+"&autoplay=1";
              console.log('src video ', videosrc);
              $("#ytplayer").attr("src",videosrc);
              break;
          case YT.PlayerState.PLAYING:
            $(".youtube").removeClass("pause");
            $(".youtube").removeClass("ended");
            break;
          default:
        }

      }
    }
  });
  
  function onPlayerStateChange(event) {
    console.log(event.data);
    switch(event.data){
      case YT.PlayerState.ENDED:
          console.log('end video youtube ', event.data)
          document.querySelector(".slick-next").click();
        break;
      case -1:
          slideWrapper.slick("slickPause");
        break;
      case YT.PlayerState.PAUSED:
          console.log('pause => playing video youtube ', event.data)
          video.play();
          console.log(' get ', $('#main-slider .slick-active').find('iframe').get())
        break;
      default:
    }
  }
  
};

/*
 * build a function to check id Youtube video is end
 */
const vimeoIsEnd = () => {
  var interval_vimeo = setInterval(function() {
    console.log("test interval vimeo");

    var iframe = document.querySelector("iframe");
    var player = new Vimeo.Player(iframe);
    let _iframeSDuration = player
      .getDuration()
      .then(function(duratione_first_iframe) {
        let _iframSCurrent = player
          .getCurrentTime()
          .then(function(current_time_first_iframe) {
            if (
              Math.round(current_time_first_iframe) ==
              Math.round(duratione_first_iframe)
            ) {
              console.log("ended video type vimeo iframe");
              current_time_first_iframe = 0;
              document.querySelector(".slick-next").click();

              console.log(
                "reinitialiser _current vimeo = ",
                current_time_first_iframe
              );
              clearInterval(interval_vimeo);
            }
          });
      });
  }, 1000);
};

// Resize player
const resizePlayer = (iframes, ratio) => {
  if (!iframes[0]) return;
  var win = $(".main-slider"),
    width = win.width(),
    playerWidth,
    height = win.height(),
    playerHeight,
    ratio = ratio || 16 / 9;

  iframes.each(function() {
    var current = $(this);
    if (width / ratio < height) {
      playerWidth = Math.ceil(height * ratio);
      current
        .width(playerWidth)
        .height(height)
        .css({
          left: (width - playerWidth) / 2,
          top: 0
        });
    } else {
      playerHeight = Math.ceil(width / ratio);
      current
        .width(width)
        .height(playerHeight)
        .css({
          left: 0,
          top: (height - playerHeight) / 2
        });
    }
  });
};

// DOM Ready
$(function() {
  // Initialize
  var _slick;
  slideWrapper.on("init", function(slick) {
    slick = $(slick.currentTarget);
    _slick = $(slick.currentTarget);
    setTimeout(function() {
      playPauseVideo(slick, "play");
    }, 1000);
    resizePlayer(iframes, 16 / 9);
  });

  slideWrapper.on("beforeChange", function(event, slick) {
    slick = $(slick.$slider);
    playPauseVideo(slick, "pause");
  });
  slideWrapper.on("afterChange", function(event, slick) {
    slick = $(slick.$slider);
    console.log("slick afterChange ", slick);
    playPauseVideo(slick, "play");
  });
  slideWrapper.on("lazyLoaded", function(event, slick, image, imageSource) {
    lazyCounter++;
    if (lazyCounter === lazyImages.length) {
      lazyImages.addClass("show");
    }
  });

  //start the slider
  slideWrapper.slick({
    fade: true,
    autoplay: true,
    lazyLoad: "progressive",
    speed: 2000,
    arrows: true,
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "cubic-bezier(0.87, 0.03, 0.41, 0.9)"
  });
});

// Resize event
$(window).on("resize.slickVideoPlayer", function() {
  resizePlayer(iframes, 16 / 9);
});