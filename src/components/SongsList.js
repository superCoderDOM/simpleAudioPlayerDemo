import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SongsList extends Component {
    render() {
        // console.log(this.props);
        let songListJSX = this.props.songs.map((song)=>{
            let classList = "";
            if(this.props.currentSongId === song.id){
                classList += " song-card__playing"
            }
            return(
                <div className={ "song-card" + classList } key={ song.id }>
                    <span className="play-btn" onClick={ ()=>{ this.props.btnHandler(song.id) } }> &#9658; </span>
                    <img className="song-card__img" src={ song.albumCover } alt="" />
                    <div className="song-card__title">
                        <Link to={"/" + song.id} onClick={ ()=>{ this.props.linkHandler(song.id) } }>
                            <h2> { song.title } </h2>
                        </Link>
                    </div>
                </div>
            );
        });

        return (
            <div className="playlist">
                <div className="playlist__title">
                    <h1> Featured Playlist: Funky Beats </h1>
                </div>
                <div className="playlist__content">
                    { songListJSX }
                </div>
            </div>
        )
    }
}

export default SongsList;