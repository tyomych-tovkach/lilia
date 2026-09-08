export const control = {
  x: 0,
  z: 0,
  interact: 0,
  lookX: 0,
  lookY: 0.28,
}

let consumed = 0

export function consumeInteract() {
  if (control.interact === consumed) return false
  consumed = control.interact
  return true
}

export function bindInput() {
  const down = new Set<string>()

  const syncWalk = () => {
    let x = 0
    let z = 0
    if (down.has('KeyW') || down.has('ArrowUp')) z += 1
    if (down.has('KeyS') || down.has('ArrowDown')) z -= 1
    if (down.has('KeyA') || down.has('ArrowLeft')) x -= 1
    if (down.has('KeyD') || down.has('ArrowRight')) x += 1
    if (!stick.active) {
      control.x = x
      control.z = z
    }
  }

  const onKey = (e: KeyboardEvent, pressed: boolean) => {
    if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return
    down[pressed ? 'add' : 'delete'](e.code)
    if (pressed && (e.code === 'KeyE' || e.code === 'Space')) {
      e.preventDefault()
      control.interact += 1
    }
    syncWalk()
  }

  const onKeyDown = (e: KeyboardEvent) => onKey(e, true)
  const onKeyUp = (e: KeyboardEvent) => onKey(e, false)

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  return () => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
  }
}

export const stick = {
  active: false,
  set(x: number, z: number) {
    this.active = true
    control.x = x
    control.z = z
  },
  end() {
    this.active = false
    control.x = 0
    control.z = 0
  },
}
