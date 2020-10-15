import Discord from 'discord.js'

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const ADMINS = ['86648389457956864']
const SERVERS = ['361291881059057664', '86657080152317952']

/** { guildId: { uid: nick } }  **/
const NICKNAMES = {
    '361291881059057664': {
        '356219476523483137': 'EscensionBot',
        '157303237601394689': 'Kevin'
    },
    '86657080152317952': {
        '356219476523483137': 'EscensionBot',
        '157303237601394689': 'Kevin',
        '224018890190094336': 'John',
        '90182872316510208': 'Noah',
        '86651286853816320': 'Julia',
        '319606429331750922': 'Dio',
        '84884648089354240': 'Masom',
        '120252256929972224': 'Tim',
        '135402084601298945': 'Ian',
        '198257991869267968': 'Brayden',
        '82175417502408704': 'Conre',
        '230915866156335104': 'David',
        '123214564417339394': 'Jared',
        '275400169242099713': 'Aengus',
        '84862641763274752': 'Brian',
        '155517881004720129': 'Evan',
        '424744189859987466': 'Sean',
        '674412307220135953': 'Hayden',
        '86848713695203328': 'Jerry',
        '167770002236243968': 'Jasper',
        '114359142658867209': 'BenK',
        '295987522314567682': 'Sebastian',
        '94982424953364480': 'Mike',
        '363132405571387393': 'Molnar',
        '196879006862147595': 'Jeff',
        '138140254895996928': 'Amir',
        '152243482357006336': 'Jason',
        '81909621194752000': 'Alexei',
        '401860236526354432': 'Dan',
        '125616901798756354': 'Danny',
        '84757953520877568': 'Steven',
        '125072422054395904': 'Teegan',
        '82337393524350976': 'DJ',
        '571458541882310676': 'Kyle',
        '689195119035154441': 'Ashton',
        '330189876035321866': 'Taylor',
        '89156421945409536': 'Isaac',
        '694665366470787172': 'Saini',
        '159135628724928512': 'Liam',
        '159985870458322944': 'Mee6',
        '138732408580079617': 'Vance',
        '761765292643713055': 'Ang',
        '84810872899244032': 'Arjun',
        '122521463692591104': 'Nikhil',
        '411649889643134977': 'Sabrina',
        '95352494091145216': 'Derek',
        '86669355424694272': 'Thomas',
        '137764381646782464': 'Neil',
        '120664010352754692': 'Brychard',
        '186704586562600961': 'Miller',
        '125391702528753665': 'Adam',
        '578378021027840014': 'Max',
        '86521343910109184': 'JP',
        '124329002000187394': 'James',
        '399824819895664641': 'Jade',
        '456229050202193943': 'Brian',
        '184112684663439362': 'Jonny',
        '242130561911619584': 'Kristine',
        '124626896704110594': 'Joe',
        '82175008926871552': 'LiamMon',
        '91653545429864448': 'Micah',
        '319633412883218435': 'George',
        '257341202775408641': 'Rob',
        '198232633170329600': 'Evan',
        '122434595105931267': 'Ajay',
        '249041078248931329': 'Sam',
        '87719455060164608': 'Jordan',
        '179396950641213440': 'Ethan',
        '86890710090936320': 'Ben',
        '206157741591363584': 'Edgar',
        '179731909008556034': 'Tommy',
        '129376507117174784': 'Suri',
        '194176739621076992': 'Jason',
        '120251527343374340': 'Patrick',
        '282350866080464897': 'Elizabeth',
        '651230227439026187': 'Emily',
        '246492604542353410': 'Yang',
        '85927425216638976': 'Liz',
        '95620062731304960': 'Anthony',
        '173576765170647040': 'Elaine',
        '148109851174764545': 'Richard',
        '89460065316139008': 'Nick',
        '86836496350318592': 'Colin',
        '391797020198699009': 'Joar'
    }
}


client.on('message', async msg => {
  if (msg.content.startsWith('sc!reset') && ADMINS.includes(msg.author.id) && SERVERS.includes(msg.guild.id)) {
    const memberCache = msg.guild.members.cache
    const guildNicknames = NICKNAMES[msg.guild.id]
    const reasoning = 'Resetting nicknames serverwide'

    const nicknamePromises = []
    memberCache.forEach((guildMember) => {
        const nick = guildNicknames[guildMember.user.id]
        if (nick && nick !== guildMember.nickname) {
            nicknamePromises.push(guildMember.setNickname(nick, reasoning))
        }
    })

    await Promise.all(nicknamePromises)
    msg.reply('Server reset')
  }
});

client.login(process.env.DISCORD_CLIENT_TOKEN);