export default (msg, collectorConfig, reactionControls) => {
  const emojis = Object.keys(reactionControls)
  emojis.map(emoji => msg?.guild?.emojis?.resolveID(emoji))
    .map(emoji => msg?.react(emoji))
    
  const userControllingViaReactiosn = (reaction, user) => 
    !user?.bot && emojis.includes(reaction?.emoji?.name)
  const reactionCollector = msg?.createReactionCollector(userControllingViaReactiosn, collectorConfig)
  reactionCollector?.on('collect', (reaction, user) => {
    reactionControls[reaction?.emoji?.name]({reactionCollector, msg, reaction, user})
    reaction?.users?.remove(user)
  })
}