import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import moment from 'moment';

import SongsList from './components/SongsList';
import SongDetails from './components/SongDetails';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      currentSongChanged: false,
      currentSongDuration: 0,
      currentSongId: 'fmaFNKY-01',
      currentSongNewPlay: true,
      currentSongPlaying: false,
      currentSongTime: 0,
      keepSongPlaybackSetting: false,
      selectedSongId: 'fmaFNKY-01',
      songs: this.props.songs,
    };

    // Bindings
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.incrementDownloadCount = this.incrementDownloadCount.bind(this);
    this.selectCurrentSong = this.selectCurrentSong.bind(this);
    this.setCurrentSongDuration = this.setCurrentSongDuration.bind(this);
    this.setCurrentSongTime = this.setCurrentSongTime.bind(this);
    this.showSongDetails = this.showSongDetails.bind(this);
    this.starSong = this.starSong.bind(this);
    this.toggleCurrentSong = this.toggleCurrentSong.bind(this);
  }
  
  // check triggered after changes to state
  // select appropriate response to changes
  componentDidUpdate(){
    // console.log(this.state.currentSongPlaying, this.state.currentSongNewPlay, this.state.currentSongTime);    
    // if song id has changed
    if (this.state.currentSongChanged){
      // if required to keep playback settings
      if(this.state.keepSongPlaybackSetting){
        // if music was playing
        if(this.state.currentSongPlaying){ // start new song
          document.getElementById("currentAudio").play();
          this.setState({
            currentSongChanged: false,
            currentSongNewPlay: true,
            keepSongPlaybackSetting: false,
          });
        }else{ // otherwise just change song settings
          document.getElementById("currentAudio").pause();
          this.setState({
            currentSongChanged: false,
            currentSongNewPlay: true,
            keepSongPlaybackSetting: false,
          });
        }
      }else{ // otherwise start new song
        document.getElementById("currentAudio").play();
        this.setState({
          currentSongChanged: false,
          currentSongNewPlay: true,
          currentSongPlaying: true,       
        });
      }
    // if song is playing and playback time is reaching 30 seconds for the first time
    }else if(this.state.currentSongPlaying && this.state.currentSongNewPlay && this.state.currentSongTime > 30){
      // make a copy of songs array
      let  copy = this.state.songs.map(song=>{
        if(song.id === this.state.currentSongId){
          song.listens += 1;
        }
        return song;
      });
      
      // increment 'listens' count
      this.setState({
        songs: copy,
        currentSongNewPlay: false,
      });


    }  
  }

  // increment download count on file download
  // automatic file download does not work yet...
  incrementDownloadCount(event, songId){
    // prevent page reload
    event.preventDefault();
    
    // make a copy of songs array
    let  copy = this.state.songs.map(song=>{
      if(song.id === songId){
        song.downloads += 1;
      }
      return song;
    });

    // update state
    this.setState({
      songs: copy,
    });
  }

  // change id of current audio track
  // and trigger case-specific playback behaviors
  selectCurrentSong(songId, keepSongPlayback){
    // if required to remember song playback setting
    if(keepSongPlayback){
      this.setState({
        currentSongId: songId,
        currentSongChanged: true,
        keepSongPlaybackSetting: true,
      });
    }else{ // otherwise
      this.setState({
        currentSongId: songId,
        currentSongChanged: true,
      });
    }
  }

  // get value of audio track duration in seconds
  setCurrentSongDuration(){
    this.setState({
      currentSongDuration: document.getElementById("currentAudio").duration,
      });
  }

  // get value of current playback time position along audio track in seconds
  setCurrentSongTime(){
    this.setState({
      currentSongTime: document.getElementById("currentAudio").currentTime,
    });
  }

  // flag component change to display details of specified song id
  showSongDetails(songId){
    this.setState({
      selectedSongId: songId,
    });
  }

  // increment starred count if user has not starred song yet
  // otherwise decrease starred count
  starSong(songId){
    // make a copy of songs array
    let  copy = this.state.songs.map(song=>{
      if(song.id === songId){
        if(song.userStar){          
            song.starred += -1;
            song.userStar = false;
        }else{
          song.starred += 1;
          song.userStar = true;
        }
      }
      return song;
    });

    // update state
    this.setState({
      songs: copy,
    });
  }

  // toggle play/pause audio settings
  toggleCurrentSong(){
    if(this.state.currentSongPlaying){
      document.getElementById("currentAudio").pause();
      this.setState({
        currentSongPlaying: false,
      });
    }else{
      document.getElementById("currentAudio").play();
      this.setState({
        currentSongPlaying: true,
      });      
    }
  }

  render(){

    // get data of current song, including current index position in song list array
    let currentSong;
    for(let i = 0; i < this.props.songs.length; i++){
      if(this.props.songs[i].id === this.state.currentSongId){
        currentSong = this.props.songs[i];
        currentSong.index = i;
      }
    }
    
    // get data of next song in song list    
    let nextSong;
    if(currentSong.index === this.state.songs.length - 1){
      nextSong = this.state.songs[0];
    }else{
      nextSong = this.state.songs[currentSong.index + 1];
    }
    
    // get data of previous song in song list
    let previousSong;
    if(currentSong.index === 0){
      previousSong = this.props.songs[this.props.songs.length - 1];
    }else{
      previousSong = this.props.songs[currentSong.index - 1];
    }
    
    // toggle between play/pause button
    let playBtn = "button__play";
    if(this.state.currentSongPlaying){
      playBtn = "button__pause";
    }

    // keep playback settings
    let keepPlayBackSetting = true;

    return (
      <div className="App">
        <div className="title-bar">
          <img className="logo" src="/Cloud.png" alt=""/>
          <h1> SoundNuage Music Library </h1>
        </div>
        <div className="container">
          <div className="row">
            <Route exact path="/" render={()=><SongsList songs={ this.state.songs } btnHandler={ this.selectCurrentSong } linkHandler={ this.showSongDetails } currentSongId={ this.state.currentSongId } />}/>
            <Route path="/:songId" render={(props)=><SongDetails song={ this.state.songs.find((song)=>song.id === props.match.params.songId) } playSong={ this.selectCurrentSong }  downloadSong={ this.incrementDownloadCount } starSong={ this.starSong }/>}/>
          </div>
          <div className="row">
            <div className="footer">
              <div className="media-player">
                <audio id="currentAudio" src={ "/audio/" + currentSong.source } onDurationChange={ this.setCurrentSongDuration } onTimeUpdate={ this.setCurrentSongTime }></audio>
                <div className="media-player__text">
                  <span className="media-player__text--left"> Now playing: { currentSong.title } </span>
                  <span className="media-player__text--right"> { moment( this.state.currentSongTime * 1000 ).format('m:ss') } / { moment( this.state.currentSongDuration * 1000 ).format('m:ss') } </span>
                </div>
                <div className="media-player__controls">
                  <div className="button__previous" onClick={ ()=>{ this.selectCurrentSong(previousSong.id, keepPlayBackSetting) } }></div>
                  <div className={ playBtn } onClick={ this.toggleCurrentSong }></div>
                  <div className="button__next" onClick={ ()=>{ this.selectCurrentSong(nextSong.id, keepPlayBackSetting) } }></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;