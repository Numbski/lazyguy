import React from 'react';
import './App.css';
import {getTeamLogo} from './logos.js';

class Lazyguy extends React.Component {
    constructor(props) {
        super(props);
        this.state = { json: null };
        this.getGames = this.getGames.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.getNhlInfo = this.getNhlInfo.bind(this);
    }

    render() {
        return ([
            <h1 key='header'>lazyguy</h1>,
            <div key='inputDiv'>
                <input id='dateInput' type='datetime' onKeyPress={(ev) => this.keyPress(ev)} key='dateInput'></input>
                <button id='inputButton' onClick={this.getGames} key='inputButton'>Get games</button>
            </div>,
            <Games listing={this.state.json} key='games' /> // games have GMT time, may roll over to next day. compensate in Game.parseDateTime()
        ]);
    }

    keyPress(ev) {
        if (ev.key === 'Enter') {
            this.getGames();
        }
    }

    componentDidMount() {
        document.title = "lazyguy";
        // autofill today's date
        var dateInput = document.getElementById('dateInput');
        if (dateInput) {
            // convert to EST
            var d = new Date(new Date().getTime() + -5 * 3600 * 1000).toUTCString().replace(/ GMT$/, "");
            dateInput.value = `${new Date(d).getFullYear()}-${zeroFill(new Date(d).getMonth() + 1, 2)}-${zeroFill(new Date(d).getDate(), 2)}`
        }
    }

    getGames() {
        var date = document.getElementById('dateInput').value;

        if (/\d{4}-\d{2}-\d{2}/.exec(date)) {
            this.getNhlInfo(date);
        } else {
            alert('Incorrect date format. Should be yyyy-MM-dd.');
        }
    }

    getNhlInfo(dateString) {
        let parent = this;
        let url = `https://statsapi.web.nhl.com/api/v1/schedule?startDate=${dateString}&endDate=${dateString}&expand=schedule.teams,schedule.linescore,schedule.broadcasts.all,schedule.game.content.media.epg`;

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    parent.setState({ json: xhttp.responseText });
                } else {
                    alert('Invalid date.');
                }
            }
        }
        xhttp.open('GET', url, true);
        xhttp.send();
    }
}

class Games extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listing: null
        };
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    componentDidUpdate() {
        let nhl = JSON.parse(this.props.listing);

        let games = [];

        for (let i = 0; i < nhl.dates[0].games.length; i++) {
            const game = nhl.dates[0].games[i];
            let awayTeam = game.teams.away.team.name;
            let homeTeam = game.teams.home.team.name;
            let status = game.status.detailedState;
            let dateTime = game.gameDate;
            let streams = game.content.media.epg;

            games.push(<Game awayTeam={awayTeam} homeTeam={homeTeam} dateTime={dateTime} status={status} streams={streams} isExpanded={false} key={`${awayTeam}-${homeTeam}-${dateTime}`} />);
        }

        if (JSON.stringify(games) !== JSON.stringify(this.state.listing) || this.state.listing == null) {
            this.setState({ listing: games });
        }
    }

    render() {
        return (
            this.state.listing
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

        this.state = {
            homeTeam: this.props.homeTeam,
            awayTeam: this.props.awayTeam,
            dateTime: this.parseDateTime(this.props.dateTime),
            status: this.props.status,
            streams: this.props.streams,
            isExpanded: this.props.isExpanded
        };
    }

    componentDidUpdate() {
        if (JSON.stringify(this.props.homeTeam) !== JSON.stringify(this.state.homeTeam)) this.setState({ homeTeam: this.props.homeTeam, isExpanded: this.props.isExpanded });
        if (JSON.stringify(this.props.awayTeam) !== JSON.stringify(this.state.awayTeam)) this.setState({ awayTeam: this.props.awayTeam, isExpanded: this.props.isExpanded });
        if (JSON.stringify(this.props.status)   !== JSON.stringify(this.state.status))   this.setState({ status: this.props.status,     isExpanded: this.props.isExpanded });
        if (JSON.stringify(this.props.streams)  !== JSON.stringify(this.state.streams))  this.setState({ streams: this.props.streams,   isExpanded: this.props.isExpanded });

        let newDate = this.parseDateTime(this.props.dateTime);
        let currentDate = this.state.dateTime;
        let dateChange = JSON.stringify(newDate) !== JSON.stringify(currentDate);
        if (dateChange) this.setState({dateTime: newDate, isExpanded: this.props.isExpanded});
    }

    handleClick() {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    parseDateTime(string) {
        // convert to EST
        var dt = new Date(new Date(string).getTime() + -5 * 3600 * 1000).toUTCString().replace(/ GMT$/, "");

        var dateTime = {
            year: new Date(dt).getFullYear(),
            month: zeroFill(new Date(dt).getMonth() + 1, 2),
            day: zeroFill(new Date(dt).getDate(), 2),
            hour: zeroFill(new Date(dt).getHours(), 2),
            minute: zeroFill(new Date(dt).getMinutes(), 2),
        };

        return dateTime;
    }

    render() {
        var twentyFourHourClock = false;

        var time;
        if (twentyFourHourClock) {
            time = `${this.state.dateTime.hour}:${this.state.dateTime.minute}`;
        } else {
            let twelveHour;
            if (this.state.dateTime.hour > 12) {
                twelveHour = parseInt(this.state.dateTime.hour) - 12 + '';
            } else {
                twelveHour = this.state.dateTime.hour;
            }

            let period = this.state.dateTime.hour < 12 ? 'AM' : 'PM';

            time = `${twelveHour}:${this.state.dateTime.minute} ${period}`;
        }

        return (
            <div onClick={this.handleClick}>
                <div className='game'><img className='team-logo' src={getTeamLogo(this.state.awayTeam)} alt='' /> {this.state.awayTeam} @ <img className='team-logo' src={getTeamLogo(this.state.homeTeam)} alt='' /> {this.state.homeTeam} - {this.state.status} - {time}</div>
                <StreamsContainer isExpanded={this.state.isExpanded} streams={this.state.streams} dateTime={this.state.dateTime} />
            </div>
        );
    }
}

class StreamsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
            streams: this.props.streams.find(x => x.title === "NHLTV").items // todo: check for other types of streams in game.content.media.epg
        }
        this.dateTime = this.props.dateTime;
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    componentDidUpdate() {
        if (this.props.isExpanded !== this.state.isExpanded) {
            this.setState({ isExpanded: this.props.isExpanded })
        }
    }

    render() {
        if (this.state.isExpanded) {
            return (<div className='stream-container'>
                {this.state.streams.map(x => <Stream mediaFeedType={x.mediaFeedType} feedName={x.feedName} callLetters={x.callLetters} mediaPlaybackId={x.mediaPlaybackId} dateTime={this.dateTime} key={`${x.mediaPlaybackId}-${this.dateTime}`} />)}
            </div>);
        } else {
            return null;
        }
    }
}

// eslint-disable-next-line no-unused-vars
class Stream extends React.Component {
    constructor(props) {
        super(props);
        this.mediaFeedType = this.props.mediaFeedType;
        this.feedName = this.props.feedName;
        this.callLetters = this.props.callLetters;
        this.mediaPlaybackId = this.props.mediaPlaybackId;
        this.handleClick = this.handleClick.bind(this);
        this.getM3u8Link = this.getM3u8Link.bind(this);
        this.dateTime = this.props.dateTime;
    }

    handleClick(ev) {
        ev.stopPropagation();
        var dateString = `${this.dateTime.year}-${this.dateTime.month}-${this.dateTime.day}`;
        this.getM3u8Link('NHL', dateString, this.mediaPlaybackId, 'akc', (link) => {
            // check if link available
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        let body = this.responseText;
                        if (body.includes('m3u8')) {
                            playHls(link);
                        } else {
                            alert('Stream Not available.');
                        }
                    } else {
                        alert('Stream Not available.');
                    }
                }
            }
            xhttp.open('GET', link, true);
            xhttp.send();
        });
    }

    getM3u8Link(league, date, id, cdn, callback) {
        // todo: if date is not today, cdn = 'akc'
        let gameUrl = `http://nhl.freegamez.ga/getM3U8.php?league=${league}&date=${date}&id=${id}&cdn=${cdn}`;

        let proxyUrl = 'https://lazyguy-nhl-proxy.herokuapp.com/';

        let proxiedGameUrl = proxyUrl + gameUrl;

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let res = this.responseText;
                callback(res);
            }
        }
        xhttp.open('GET', proxiedGameUrl, true);
        xhttp.setRequestHeader('User-Agent', "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36");
        xhttp.send();
    }

    render() {
        var availableInfo = [this.mediaFeedType, this.feedName, this.callLetters].filter(x => !!x);
        var streamString = availableInfo.join(' - ');

        return (
            <div className='stream' onClick={this.handleClick}>
                {streamString}
            </div>
        );
    }
}

function playHls(url) {
    window.open('player.html?source=' + encodeURIComponent(url));
}

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + '';
}

function App() {
    return (
        <Lazyguy />
    );
}

export default App;
