const db = require("../models");
const Academy = db.academy;
const Team = db.team;
const Competition = db.compitition;
const Fixture = db.fixture;
const League = db.league;
const Player = db.player;


exports.getDashboardContents = async (req, resp, next) => {
    try {
        console.log(req.user,":::::: req");
        const academies = await Academy.find({}).populate("coach").exec();
        const competitions = await Competition.find({}).populate(["organiser", "user_id"]).exec();
        const fixtures = await Fixture.find({}).populate(["league", "homeTeam", "awayTeam", "user_id"]);
        const leagues = await League.find({});
        const players = await Player.find({}).populate("league").populate("academy").populate("team").populate("user").sort({ createdAt: -1}).exec();
        let teams = await Team.find({}).populate(["academy_id", "leagues", "user_id"]).exec();
        if(teams) {
            teams = JSON.parse(JSON.stringify(teams));
            teams = teams.map(team => {
               return { ...team, count: team.leagues.length };
                });
        }
        return  resp.status(200).json({
            success: true,
            data: { 
                teams,            
                players,
                academies,
                competitions,
                fixtures,
                leagues
            },
            message: 'Dashboard data fetched successfully'
        });
        
    } catch (error) {
        return  resp.status(404).json({
            success: false,           
            message: 'Dashboard data fetching failed'
        });
    }
 }



