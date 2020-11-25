export default (msg, collectorConfig, reactionControls) => {
  const emojis = Object.keys(reactionControls)
  emojis.map(emoji => msg?.guild?.emojis?.resolveID(emoji))
    .map(emoji => msg?.react(emoji))
    
  const userControllingViaReactions = (reaction, user) => 
    !user?.bot && emojis.includes(reaction?.emoji?.name)
  const reactionCollector = msg?.createReactionCollector(userControllingViaReactions, collectorConfig)
  reactionCollector?.on('collect', (reaction, user) => {
    reactionCollector?.resetTimer()
    reactionControls[reaction?.emoji?.name]({reactionCollector, msg, reaction, user})
    reaction?.users?.remove(user)
  })?.on('end', () => msg?.reactions?.removeAll())
}