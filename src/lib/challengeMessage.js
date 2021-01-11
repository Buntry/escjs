const challengeMessage = async (msg, amt, gameName, beginChallenge) => {
  if (amt <= 0) {
    return msg?.channel?.send("Please specify a positive, non-zero amount to challenge with.")
  }

  const challengeText = `${msg?.author} is challenging anyone to a game of **${gameName}** for **${amt}** esc credits.`
  const challengeMsg = await msg?.channel?.send(`${challengeText}

  Click the ✅ button to accept the challenge.`)
  const filter = (reaction, user) => !user?.bot &&
            reaction?.emoji?.name === '✅' //&& user?.id !== msg?.author?.id
  challengeMsg?.react('✅')
  const collector = challengeMsg?.createReactionCollector(filter, { time: 30000 })
    .on('collect', (reaction, challenger) => {
      beginChallenge(msg?.channel, msg?.author, challenger, amt)
      collector?.stop()
    }).on('end', () => challengeMsg?.reactions?.removeAll())
  return challengeMsg
}

export default challengeMessage