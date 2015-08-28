/**
 * Created by Daniel on 8/25/2015.
 */
'use strict';

if (typeof (buildfire) == "undefined") throw ("please add buildfire.js first to use BuildFire services");

if (typeof (buildfire.services) == "undefined") buildfire.services = {};

if (typeof (buildfire.services.media) == "undefined") buildfire.services.media = {};

function Track (title,url,imageUrl){
    this.title=title;
    this.url=url;
    this.imageUrl=imageUrl;
    this.startAt=0;
    this.lastPosition=0;
}

function AudioSettings(){
    this.autoPlayNext = true;
    this.loop = false;
    this.autoJumpToLastPosition= true;
}


buildfire.services.media.audioPlayer = {
    play:function(track){
        if(!track)
            console.log("resume current track");
        else if(typeof(track) == "string")
            track = new Track("unknown",track,null);

        var packet = new Packet(null,"mediaAPI.audioPlayer.play", track);
        buildfire._sendPacket(packet);
    }
    ,pause:function(){
        buildfire._sendPacket(new Packet(null,"mediaAPI.audioPlayer.pause"));
    }
    ,skip:function(sec){
        buildfire._sendPacket(new Packet(null,"mediaAPI.audioPlayer.skip",sec));
    }
    ,next:function(sec){
        buildfire._sendPacket(new Packet(null,"mediaAPI.audioPlayer.next"));
    }
    ,previous:function(sec){
        buildfire._sendPacket(new Packet(null,"mediaAPI.audioPlayer.previous"));
    }
    ,loopTrack:function(val){
        buildfire._sendPacket(new Packet(null,"mediaAPI.audioPlayer.loopTrack",val));
    }
    ,removeFromPlaylist:function(index){
        buildfire._sendPacket(new Packet(null,"mediaAPI.audioPlayer.removeFromPlaylist",index));
    }
    , addToPlaylist:function(track){
        if(!track) {
            console.error("invalid track");
            return;
        }

        if(typeof(track) == "string")
            track = new Track("unknown",track,null);


        var packet = new Packet(null,"mediaAPI.audioPlayer.addToPlaylist", track);
        buildfire._sendPacket(packet);
    }
    , getPlaylist:function(callback){
        var packet = new Packet(null,"mediaAPI.audioPlayer.getPlaylist");
        buildfire._sendPacket(packet,callback);
    }
    , getCurrentTrack:function(callback){
        var packet = new Packet(null,"mediaAPI.audioPlayer.getCurrentTrack");
        buildfire._sendPacket(packet,callback);
    }
    ,setTime:function(sec){
        var packet = new Packet(null,"mediaAPI.audioPlayer.setTime",sec);
        buildfire._sendPacket(packet);
    }
    ,setVolume:function(percent){
        if(percent > 1 && percent <= 100) percent= percent/100;
        var packet = new Packet(null,"mediaAPI.audioPlayer.setVolume",percent);
        buildfire._sendPacket(packet);
    }
    , settings:{
        set: function(audioSettings){
            buildfire._sendPacket(new Packet(null,"mediaAPI.audioPlayer.setSettings",audioSettings));
        }
        ,get: function(callback){
            buildfire._sendPacket(new Packet(null,"mediaAPI.audioPlayer.getSettings"),callback);
        }
    }
    , triggerOnEvent: function (e) {
        var event = new CustomEvent('audioPlayer.onEvent', {'detail': e});
        buildfire.logger.log(e);
        document.dispatchEvent(event);
    }
    ,onEvent:function(callback){
        var handler = function (e) { if (callback)callback(e.detail); };
        document.addEventListener('audioPlayer.onEvent', handler, false);
        return {
            clear:function () {document.removeEventListener('audioPlayer.onEvent', handler, false); }
        };
    }

};
/*
(function(){
    var packet = new Packet(null,"mediaAPI.audioPlayer.subscribe", track);
    buildfire._sendPacket(packet);
})();*/