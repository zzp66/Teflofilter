var baseWidth = 1440;
var pageCaseIndex = 0;
var tefloCaseStudyAnimateArr = [];
function updateBaseWidth() {
  const width = window.innerWidth;
  if (width > 1700) {
    baseWidth = 1700;
    document.documentElement.style.setProperty('--base-width', 1700);
  } else if (width > 1500) {
    baseWidth = 1600;
    document.documentElement.style.setProperty('--base-width', 1600);
  } else if (width > 1400) {
    baseWidth = 1440;
    document.documentElement.style.setProperty('--base-width', 1440);
  } else if (width > 1200) {
    baseWidth = 1300;
    document.documentElement.style.setProperty('--base-width', 1350);
  }
  else if (width > 1024) {
    baseWidth = 1250;
    document.documentElement.style.setProperty('--base-width', 1250);
  } else if (width > 768) {
    baseWidth = 1000;
    document.documentElement.style.setProperty('--base-width', 1050);
  } else if (width > 680) {
    baseWidth = 1000;
    document.documentElement.style.setProperty('--base-width', 950);
  }
  else {
    baseWidth = 750;
    document.documentElement.style.setProperty('--base-width', 750);
  }

  if(pageCaseIndex>0){

    tefloCaseStudyAnimate();
  }
 
  
}
updateBaseWidth();
window.addEventListener('resize', updateBaseWidth);



function tefloCaseStudyAnimate() {
    if(window.innerWidth > 1024){
      if(tefloCaseStudyAnimateArr.length == 0){
        try {
            const items = document.querySelectorAll(".teflo-case-studie-list-item-animate");
            items.forEach((item,index) => {
            const lt = item.querySelector(".teflo-case-studie-list-item-img");

            var  tefloCaseStudyAnimateEle =  ScrollTrigger.create({
                    trigger: item,
                    start: "top top",
                    end: () => "+=" + item.offsetHeight,
                    pin: lt,
                    pinSpacing: false,
                    onEnter: () => lt.style.zIndex = items.length - index,
                    onLeaveBack: () => lt.style.zIndex = index,
                });
                tefloCaseStudyAnimateArr.push(tefloCaseStudyAnimateEle);
            });

           
         
        } catch (error) {
          
        }
      }
  }else{
    if(tefloCaseStudyAnimateArr.length>0){
      destroyAnimations(tefloCaseStudyAnimateArr);
    }
  }
}

function destroyAnimations(animations) {
  animations.forEach((animation, index) => {
    if (animation) {
      animation.kill(); 
    
      gsap.set(animation.target, { clearProps: "all" }); 
      // animation.target.forEach((el) => {
      //   
      // });
    }
  });
  animations.length = 0;
}





// disable scroll
function disableScroll() {
  if (window.innerWidth <= 1024) {
    document.body.style.overflow = 'hidden';
  }
}

//scroll 
function enableScroll() {
  if (window.innerWidth <= 1024) {
    document.body.style.overflow = '';
  }
}