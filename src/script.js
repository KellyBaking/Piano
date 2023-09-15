var sound = [];
var sound_name = [1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,8,8.5,9,9.5,10,11,11.5,12,12.5,13,13.5,14,15];
var dodoro_url = "url(https://i03piccdn.sogoucdn.com/42834ce9dc564396)"

for(var i=0;i<sound_name.length;i++){
  sound.push({
    name: sound_name[i],
    url: "https://awiclass.monoame.com/pianosound/set/" + sound_name[i] + ".wav",
  });
}

const vm = Vue.createApp({
  data(){
    return{
      music: sound,
      gui: [{num:10,time:244},{num:8,time:394},{num:6,time:552},{num:6,time:634},{num:5,time:734},{num:10,time:922},{num:8,time:1092},{num:6,time:1274},{num:6,time:1362},{num:5,time:1462},{num:8,time:1652},{num:8,time:1740},{num:8,time:1828},{num:10,time:1904},{num:12,time:2000},{num:10,time:2152},{num:9,time:2348},{num:9,time:2434},{num:6,time:2536},{num:7,time:2636},{num:8,time:2850},{num:8,time:2962}],
      star: [],
      audio_num: 0,
      audio_next: 0,
      play_time: 0,
      player: null,
      record_time: 0,
      recorder: null,
      keyboard: [
        {num: 1,key: 90  ,type:'white'},
        {num: 1.5,key: 83  ,type:'black'},
        {num: 2,key: 88  ,type:'white'},
        {num: 2.5,key: 68  ,type:'black'},
        {num: 3,key: 67  ,type:'white'},
        {num: 4,key: 86  ,type:'white'},
        {num: 4.5,key: 71  ,type:'black'},
        {num: 5,key: 66  ,type:'white'},
        {num: 5.5,key: 72  ,type:'black'},
        {num: 6,key: 78  ,type:'white'},
        {num: 6.5,key: 74  ,type:'black'},
        {num: 7,key: 77  ,type:'white'},
        {num: 8,key: 81  ,type:'white'},
        {num: 8.5,key: 50  ,type:'black'},
        {num: 9,key: 87  ,type:'white'},
        {num: 9.5,key: 51,type:'black'},
        {num: 10,key: 69  ,type:'white'},
        {num: 11,key: 82  ,type:'white'},
        {num: 11.5,key: 53  ,type:'black'},
        {num: 12,key: 84  ,type:'white'},
        {num: 12.5,key: 54  ,type:'black'},
        {num: 13,key: 89  ,type:'white'},
        {num: 13.5,key: 55  ,type:'black'},
        {num: 14,key: 85  ,type:'white'},
        {num: 15,key: 73  ,type:'white'}],
      
      ascii: -1,
      
    }    
  },
  
  methods:{
    sound_play: function(N,V){
      var sp = $("audio[data_name = '" +N+ "']")[0];
      sp.currentTime=0;
      sp.volume=V;
      sp.play();
    },
   
    playnext: function(V){
      
      var np = this.star[this.audio_num].num;
      this.sound_play(np,V);
      this.audio_num++;
      
      if(this.audio_num>=this.star.length){
        this.stopmusic();
        this.audio_num = 0;
        this.play_time=0;
      };
    },
    
    playmusic: function(){
      this.play_time=0;
      this.audio_num=0;
      this.audio_next=0;
      var vobj = this
      if(this.record_time<=0){
      this.player = setInterval(function(){
        if(vobj.star.length>0){
          vobj.play_time++;
          if(vobj.play_time >= vobj.star[vobj.audio_next].time){
            vobj.playnext(1);
            vobj.audio_next++;
          };
        }
        
        // vobj.play_time++;
      },1);
    }},
    
    stopmusic: function(){
      clearInterval(this.player);
      this.play_time=0;
      this.audio_num=0;
      this.audio_next=0;
    },
    
    record: function(){
      this.record_time=0;
      var vobj = this;
      if(this.play_time<=0){
      this.star=[];
      $(".img").removeClass("totoro");
      $(".img").removeClass("guigui");
      this.recorder=setInterval(function(){
        vobj.record_time++;    
      },1);
    }},
    
    stoprecord: function(){
      clearInterval(this.recorder);
      this.record_time=0;
    },
    
    addaudio: function(an){
      if(this.record_time>0){
        this.star.push({num: an,time: this.record_time})
        };
      this.sound_play(an,1);
    },
    
    totoro: function(){
      if(this.play_time<=0 && this.record_time<=0){
        clearInterval(this.player);
        
        $(".img").removeClass("guigui");
        $(".img").addClass("totoro");
        $(".sheet_right").css("top","0px");
        $(".sheet_right").css("width","800px");
        
        axios.get('https://awiclass.monoame.com/api/command.php?type=get&name=music_dodoro')
           .then(res =>{
            console.log(res);
            this.star=res.data;
      })
      };      
    },
    
    guigui: function(){
      if(this.play_time<=0 && this.record_time<=0){
        this.star=this.gui;
        $(".img").removeClass("totoro");
        $(".img").addClass("guigui");
        $(".sheet_right").css("top","100px");
        $(".sheet_right").css("width","500px");
        
      }    
    },
    
    clear: function(){
      if(this.record_time<=0 && this.play_time<=0){
        this.star=[];
        $(".img").removeClass("totoro");
        $(".img").removeClass("guigui");
      }
    },
    
    highlight: function(h,kk){
      
      // 注意順序!!!
      // 放在下面會因為play_time=0而沒反應
      if(this.ascii==kk) return true;
      
      if(this.star.length<=0)
        return false
      if(this.play_time==0)
        return false
      
      // var nowkey=this.audio_num-1
      // if(nowkey<0) nowkey=0
      
      if(this.star[this.audio_num].num==h)
        return true
      return false
      
    },
    
    // 用時間判斷的話因為閃得太快,看起來會跟沒效果一樣
    hightlightlabel: function(t){
      if(this.audio_num-1==t)
        return true
      return false
      
    },
      
    
    
    },
  
  
  mounted: function(){
    
    
  },
}).mount("#crazy");


$(window).keydown(function(e){
  var asc = e.which;
  vm.ascii=asc
  console.log(asc);
  for(i=0;i<vm.keyboard.length;i++){
    if(asc==vm.keyboard[i].key){
    vm.addaudio(vm.keyboard[i].num)
    // vm.sound_play(vm.keyboard[i].num,1)
  }}
});

$(window).keyup(function(){
  vm.ascii=-1
});