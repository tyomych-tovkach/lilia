import { useEffect, useState } from 'react'
import {
  copy,
  DATE_CHIPS,
  DATE_MAX,
  DATE_MIN,
  DATE_CHAT,
  farewells,
  flavors,
  formatOptions,
  greetings,
  japanCustom,
  japanOptions,
  letterPaper,
  limits,
  npcs,
  placeCustom,
  secretCustom,
  secretOptions,
  slotOptions,
  sportCustom,
  sportKindOptions,
  sportModeOptions,
} from '../content/evening'
import type { DateFormatId, LocationId } from '../content/types'
import { formatRuDate, japanDone, secretDone, sportDone, summaryLines, toggleLimited } from '../logic'
import { sendInvite } from '../mail'
import { useInvite } from '../state'
import { talkLock } from '../game/playerRef'
import { onTalk } from '../game/talkBus'

function npcName(loc: LocationId) {
  if (loc === 'hub') return npcs.tanya.name
  if (loc === 'letter') return npcs.sonya.name
  if (loc === 'japan') return npcs.aya.name
  if (loc === 'sport') return npcs.rita.name
  if (loc === 'secret') return npcs.nina.name
  if (loc === 'yesno') return npcs.olya.name
  if (loc === 'date') return npcs.katya.name
  if (loc === 'send') return npcs.gena.name
  if (loc === 'kubgu') return npcs.max.name
  return npcs.lena.name
}

type Phase =
  | 'lines'
  | 'paper'
  | 'multi'
  | 'sportMode'
  | 'custom'
  | 'yesno'
  | 'format'
  | 'flavor'
  | 'place'
  | 'when'
  | 'slot'
  | 'send'

export function Talk() {
  const { state, patch } = useInvite()
  const [open, setOpen] = useState(false)
  const [loc, setLoc] = useState<LocationId>('hub')
  const [line, setLine] = useState(0)
  const [phase, setPhase] = useState<Phase>('lines')
  const [busy, setBusy] = useState(false)
  const [react, setReact] = useState('')
  const [sendError, setSendError] = useState('')

  const close = () => {
    setOpen(false)
    setReact('')
    setSendError('')
    talkLock.current = false
    document.exitPointerLock?.()
  }

  useEffect(() => {
    return onTalk((id) => {
      setLoc(id)
      setOpen(true)
      setLine(0)
      setPhase('lines')
      setReact('')
      setSendError('')
      talkLock.current = true
      document.exitPointerLock?.()
    })
  }, [])

  if (!open) return null

  const lines = greetings[loc]
  const text =
    phase === 'paper'
      ? ''
      : react
        ? react
        : phase === 'lines'
          ? lines[Math.min(line, lines.length - 1)]
          : phase === 'yesno'
            ? greetings.yesno[1]
            : phase === 'multi' && loc === 'japan'
              ? greetings.japan[1]
              : phase === 'multi' && loc === 'sport'
                ? greetings.sport[0]
                : phase === 'sportMode'
                  ? greetings.sport[1]
                  : phase === 'multi' && loc === 'secret'
                    ? greetings.secret[1]
                    : phase === 'format'
                      ? greetings.date[0]
                      : phase === 'flavor'
                        ? 'Что ближе из этого?'
                        : phase === 'place'
                          ? placeCustom.npcAsk
                          : phase === 'when'
                            ? 'Какой день удобен? Можно свой в окне дат или написать в чате.'
                            : phase === 'slot'
                              ? 'День или вечер? Точный час — уже в чате.'
                              : phase === 'send'
                                ? greetings.send[0]
                                : phase === 'custom'
                                  ? loc === 'japan'
                                    ? japanCustom.npcAsk
                                    : loc === 'sport'
                                      ? sportCustom.npcAsk
                                      : loc === 'date'
                                        ? placeCustom.npcAsk
                                        : secretCustom.npcAsk
                                  : lines[0]

  const advanceLines = () => {
    if (line + 1 < lines.length) {
      setLine(line + 1)
      return
    }
    if (loc === 'letter') {
      setPhase('paper')
      return
    }
    if (loc === 'japan' || loc === 'sport' || loc === 'secret') {
      setPhase('multi')
      return
    }
    if (loc === 'yesno') {
      if (state.saidYes) {
        patch({ toast: farewells.yesno })
        close()
        return
      }
      setPhase('yesno')
      return
    }
    if (loc === 'date') {
      setPhase('format')
      return
    }
    if (loc === 'send') {
      setPhase('send')
      return
    }
    close()
  }

  const finishLetter = () => {
    patch({ letterDone: true, toast: farewells.letter })
    close()
  }

  const pickMulti = (id: string) => {
    const opt =
      loc === 'japan' ? japanOptions.find((o) => o.id === id) : loc === 'sport' ? sportKindOptions.find((o) => o.id === id) : secretOptions.find((o) => o.id === id)
    if (opt) setReact(opt.npcReact)
    if (loc === 'japan') patch({ japanIds: toggleLimited(state.japanIds, id, limits.japan.max) })
    if (loc === 'sport') patch({ sportIds: toggleLimited(state.sportIds, id, limits.sport.max) })
    if (loc === 'secret') patch({ secretIds: toggleLimited(state.secretIds, id, limits.secret.max) })
  }

  const doneMulti = loc === 'japan' ? japanDone(state) : loc === 'sport' ? sportDone(state) : secretDone(state)
  const options = loc === 'japan' ? japanOptions : loc === 'sport' ? sportKindOptions : secretOptions
  const selected = loc === 'japan' ? state.japanIds : loc === 'sport' ? state.sportIds : state.secretIds
  const customVal =
    loc === 'japan' ? state.japanCustom : loc === 'sport' ? state.sportCustom : loc === 'secret' ? state.secretCustom : state.customPlace
  const customOk = customVal.trim().length > 0

  return (
    <div className={`talk ${phase === 'paper' ? 'is-letter' : ''}`}>
      {phase === 'paper' ? (
        <div className="letter-sheet">
          {letterPaper.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <button type="button" className="talk-btn is-on" onClick={finishLetter}>
            Пойду дальше.
          </button>
        </div>
      ) : (
        <>
          <p className="talk-name">{npcName(loc)}</p>
          <p className="talk-body">{text}</p>
        </>
      )}

      {phase === 'lines' && loc !== 'letter' && line >= lines.length - 1 && (loc === 'hub' || loc === 'kubgu' || loc === 'vkusno') && (
        <button type="button" className="talk-btn" onClick={close}>
          Ясно.
        </button>
      )}
      {phase === 'lines' && loc !== 'letter' && !(loc === 'hub' || loc === 'kubgu' || loc === 'vkusno') && (
        <>
          <button type="button" className="talk-btn" onClick={advanceLines}>
            Дальше
          </button>
          {(loc === 'japan' || loc === 'sport' || loc === 'secret') && (
            <button
              type="button"
              className="talk-btn"
              onClick={() => {
                patch({ toast: 'Можно вернуться сюда позже.' })
                close()
              }}
            >
              Не сейчас
            </button>
          )}
        </>
      )}
      {phase === 'lines' && loc === 'letter' && (
        <button type="button" className="talk-btn" onClick={advanceLines}>
          {line + 1 < lines.length ? 'Дальше' : 'Письмо'}
        </button>
      )}
      {phase === 'lines' && (loc === 'hub' || loc === 'kubgu' || loc === 'vkusno') && line < lines.length - 1 && (
        <button type="button" className="talk-btn" onClick={() => setLine(line + 1)}>
          Дальше
        </button>
      )}

      {phase === 'multi' && (
        <div className="talk-choices">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`talk-btn ${selected.includes(o.id) ? 'is-on' : ''}`}
              onClick={() => pickMulti(o.id)}
            >
              {o.playerLine}
            </button>
          ))}
          <button
            type="button"
            className="talk-btn"
            onClick={() => {
              setReact('')
              setPhase('custom')
            }}
          >
            {loc === 'secret' ? secretCustom.playerLine : loc === 'sport' ? sportCustom.playerLine : japanCustom.playerLine}
          </button>
          {doneMulti && (
            <button
              type="button"
              className="talk-btn is-on"
              onClick={() => {
                if (loc === 'sport') {
                  setReact('')
                  setPhase('sportMode')
                  return
                }
                patch({ toast: farewells[loc] })
                close()
              }}
            >
              Это всё
            </button>
          )}
          {(loc === 'japan' || loc === 'sport' || loc === 'secret') && (
            <button
              type="button"
              className="talk-btn"
              onClick={() => {
                patch({ toast: 'Можно вернуться сюда позже.' })
                close()
              }}
            >
              Не сейчас
            </button>
          )}
        </div>
      )}

      {phase === 'sportMode' && (
        <div className="talk-choices">
          {sportModeOptions.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`talk-btn ${state.sportModeIds.includes(o.id) ? 'is-on' : ''}`}
              onClick={() => {
                setReact(o.npcReact)
                patch({ sportModeIds: toggleLimited(state.sportModeIds, o.id, limits.sportMode.max) })
              }}
            >
              {o.playerLine}
            </button>
          ))}
          <button
            type="button"
            className="talk-btn is-on"
            onClick={() => {
              patch({ toast: farewells.sport })
              close()
            }}
          >
            Это всё
          </button>
        </div>
      )}

      {phase === 'custom' && (
        <>
          <input
            className="talk-input"
            autoFocus
            maxLength={80}
            placeholder={loc === 'japan' ? japanCustom.placeholder : loc === 'sport' ? sportCustom.placeholder : loc === 'date' ? placeCustom.placeholder : secretCustom.placeholder}
            value={customVal}
            onChange={(e) => {
              const v = e.target.value
              if (loc === 'japan') patch({ japanCustom: v })
              else if (loc === 'sport') patch({ sportCustom: v })
              else if (loc === 'secret') patch({ secretCustom: v })
              else patch({ customPlace: v, format: 'custom', flavorId: '' })
            }}
          />
          <button
            type="button"
            className="talk-btn"
            disabled={!customOk}
            onClick={() => {
              if (!customOk) return
              setReact(loc === 'japan' ? japanCustom.npcReact : loc === 'sport' ? sportCustom.npcReact : loc === 'date' ? placeCustom.npcReact : secretCustom.npcReact)
              if (loc === 'date') setPhase('when')
              else setPhase('multi')
            }}
          >
            Запомнить
          </button>
        </>
      )}

      {phase === 'yesno' && !state.saidYes && (
        <div className="talk-choices">
          <button
            type="button"
            className="talk-btn"
            onClick={() => {
              patch({ saidYes: true, toast: farewells.yesno })
              close()
            }}
          >
            Да.
          </button>
          <button
            type="button"
            className="talk-btn"
            onClick={() => {
              patch({ noAttempts: state.noAttempts + 1, toast: copy.noClose })
              close()
            }}
          >
            Нет.
          </button>
          <button
            type="button"
            className="talk-btn"
            onClick={() => {
              patch({ toast: copy.laterClose })
              close()
            }}
          >
            Пока не знаю.
          </button>
        </div>
      )}

      {phase === 'format' && (
        <div className="talk-choices">
          {formatOptions.map((o) => (
            <button
              key={o.id}
              type="button"
              className="talk-btn"
              onClick={() => {
                setReact(o.npcReact)
                patch({ format: o.id as DateFormatId, flavorId: '', customPlace: o.id === 'custom' ? state.customPlace : '' })
                if (o.id === 'custom') setPhase('place')
                else setPhase('flavor')
              }}
            >
              {o.playerLine}
            </button>
          ))}
        </div>
      )}

      {phase === 'flavor' && state.format && state.format !== 'custom' && (
        <div className="talk-choices">
          {flavors[state.format].map((o) => (
            <button
              key={o.id}
              type="button"
              className="talk-btn"
              onClick={() => {
                setReact(o.npcReact)
                patch({ flavorId: o.id })
                setPhase('when')
              }}
            >
              {o.playerLine}
            </button>
          ))}
        </div>
      )}

      {phase === 'place' && (
        <>
          <input
            className="talk-input"
            autoFocus
            maxLength={80}
            placeholder={placeCustom.placeholder}
            value={state.customPlace}
            onChange={(e) => patch({ customPlace: e.target.value, format: 'custom', flavorId: '' })}
          />
          <button
            type="button"
            className="talk-btn"
            disabled={!state.customPlace.trim()}
            onClick={() => {
              if (!state.customPlace.trim()) return
              setReact(placeCustom.npcReact)
              setPhase('when')
            }}
          >
            Запомнить
          </button>
        </>
      )}

      {phase === 'when' && (
        <div className="talk-choices">
          {DATE_CHIPS.map((iso) => (
            <button
              key={iso}
              type="button"
              className={`talk-btn ${state.date === iso ? 'is-on' : ''}`}
              onClick={() => {
                patch({ date: iso })
                setPhase('slot')
              }}
            >
              {formatRuDate(iso)}
            </button>
          ))}
          <input
            className="talk-input"
            type="date"
            min={DATE_MIN}
            max={DATE_MAX}
            value={state.date !== DATE_CHAT && state.date && !(DATE_CHIPS as readonly string[]).includes(state.date) ? state.date : ''}
            onChange={(e) => {
              const v = e.target.value
              if (!v) return
              patch({ date: v })
              setPhase('slot')
            }}
          />
          <button
            type="button"
            className={`talk-btn ${state.date === DATE_CHAT ? 'is-on' : ''}`}
            onClick={() => {
              patch({ date: DATE_CHAT })
              setPhase('slot')
            }}
          >
            Напишу в чате, когда свободна
          </button>
        </div>
      )}

      {phase === 'slot' && (
        <div className="talk-choices">
          {slotOptions.map((o) => (
            <button
              key={o.id}
              type="button"
              className="talk-btn"
              onClick={() => {
                setReact(o.npcReact)
                patch({ slot: o.id as 'day' | 'evening', toast: farewells.date })
                close()
              }}
            >
              {o.playerLine}
            </button>
          ))}
        </div>
      )}

      {phase === 'send' && (
        <>
          <div className="talk-summary">
            {summaryLines(state).map((s) => (
              <p key={s}>{s}</p>
            ))}
          </div>
          {state.sentAt ? (
            <p className="talk-note">{copy.sendAlready}</p>
          ) : (
            <>
              {sendError && <p className="talk-error">{sendError}</p>}
              <button
                type="button"
                className="talk-btn is-on"
                disabled={busy}
                onClick={() => {
                  if (busy || state.sentAt) return
                  setBusy(true)
                  setSendError('')
                  void sendInvite(state).then((res) => {
                    setBusy(false)
                    if (res.ok) {
                      patch({ sentAt: new Date().toISOString(), toast: farewells.send })
                      close()
                      return
                    }
                    setSendError(copy.sendFail)
                  })
                }}
              >
                {busy ? copy.sending : 'Отправить Темычу'}
              </button>
            </>
          )}
        </>
      )}
    </div>
  )
}
