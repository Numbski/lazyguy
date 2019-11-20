import anaheimDucks from './logos/anaheim-ducks.png';
import arizonaCoyotes from './logos/arizona-coyotes.png';
import bostonBruins from './logos/boston-bruins.png';
import buffaloSabres from './logos/buffalo-sabres.png';
import calgaryFlames from './logos/calgary-flames.png';
import carolinaHurricanes from './logos/carolina-hurricanes.png';
import chicagoBlackhawks from './logos/chicago-blackhawks.png';
import coloradoAvalanche from './logos/colorado-avalanche.png';
import columbusBluejackets from './logos/columbus-bluejackets.png';
import dallasStars from './logos/dallas-stars.png';
import detroitRedwings from './logos/detroit-redwings.png';
import edmontonOilers from './logos/edmonton-oilers.png';
import floridaPanthers from './logos/florida-panthers.png';
import losAngelesKings from './logos/los-angeles-kings.png';
import minnesotaWild from './logos/minnesota-wild.png';
import montrealCanadiens from './logos/montreal-canadiens.png';
import nashvillePredators from './logos/nashville-predators.png';
import newJerseyDevils from './logos/new-jersey-devils.png';
import newYorkIslanders from './logos/new-york-islanders.png';
import newYorkRangers from './logos/new-york-rangers.png';
import ottowaSenators from './logos/ottowa-senators.png';
import philadelphiaFlyers from './logos/philadelphia-flyers.png';
import pittsburghPenguins from './logos/pittsburgh-penguins.png';
import sanJoseSharks from './logos/san-jose-sharks.png';
import stLouisBlues from './logos/st-louis-blues.png';
import tampaBayLightning from './logos/tampa-bay-lightning.png';
import torontoMapleLeafs from './logos/toronto-maple-leafs.png';
import vancouverCanucks from './logos/vancouver-canucks.png';
import vegasGoldenKnights from './logos/vegas-golden-knights.png';
import washingtonCapitals from './logos/washington-capitals.png';
import winnipegJets from './logos/winnipeg-jets.png';

export function getTeamLogo(teamName) {
    switch (teamName) {
        case 'AnaheimDucks':
            return anaheimDucks;
        case 'Arizona Coyotes':
            return arizonaCoyotes;
        case 'Boston Bruins':
            return bostonBruins;
        case 'Buffalo Sabres':
            return buffaloSabres;
        case 'Calgary Flames':
            return calgaryFlames;
        case 'Carolina Hurricanes':
            return carolinaHurricanes;
        case 'Chicago Blackhawks':
            return chicagoBlackhawks;
        case 'Colorado Avalanche':
            return coloradoAvalanche;
        case 'Columbus Blue Jackets':
            return columbusBluejackets;
        case 'Dallas Stars':
            return dallasStars;
        case 'Detroit Red Wings':
            return detroitRedwings;
        case 'Edmonton Oilers':
            return edmontonOilers;
        case 'Florida Panthers':
            return floridaPanthers;
        case 'Los Angeles Kings':
            return losAngelesKings;
        case 'Minnesota Wild':
            return minnesotaWild;
        case 'Montréal Canadiens':
            return montrealCanadiens;
        case 'Nashville Predators':
            return nashvillePredators;
        case 'New Jersey Devils':
            return newJerseyDevils;
        case 'New York Islanders':
            return newYorkIslanders;
        case 'New York Rangers':
            return newYorkRangers;
        case 'Ottawa Senators':
            return ottowaSenators;
        case 'Philadelphia Flyers':
            return philadelphiaFlyers;
        case 'Pittsburgh Penguins':
            return pittsburghPenguins;
        case 'San Jose Sharks':
            return sanJoseSharks;
        case 'St. Louis Blues':
            return stLouisBlues;
        case 'Tampa Bay Lightning':
            return tampaBayLightning;
        case 'Toronto Maple Leafs':
            return torontoMapleLeafs;
        case 'Vancouver Canucks':
            return vancouverCanucks;
        case 'Vegas Golden Knights':
            return vegasGoldenKnights;
        case 'Washington Capitals':
            return washingtonCapitals;
        case 'Winnipeg Jets':
            return winnipegJets;
        default:
            console.error("Team logo not found: " + teamName);
            return null;
    }
}