export type ActId = 'letter' | 'japan' | 'sport' | 'secret' | 'yesno' | 'date' | 'send'
export type EasterId = 'kubgu' | 'vkusno'
export type LocationId = 'hub' | ActId | EasterId
export type DateFormatId = 'calm' | 'play' | 'japan' | 'custom'
export type SlotId = 'day' | 'evening'

export type TalkOption = {
  id: string
  playerLine: string
  npcReact: string
}

export type CustomTalk = {
  playerLine: string
  npcAsk: string
  placeholder: string
  npcReact: string
  stateKey: 'japanCustom' | 'sportCustom' | 'secretCustom' | 'customPlace'
}

export type Sign = {
  arch: string
  uiTitle: string
  uiObjective: string
}
